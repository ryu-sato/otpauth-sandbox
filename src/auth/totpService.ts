import { authenticator } from "otplib";
import * as qrcode from "qrcode";


export type TOTPSecretDTO = {
  userId: string;
  secret: string;
  qrCode: string;
  createdAt: Date;
};

export class TOTPService {
  private failedAttempts: Record<string, number> = {};
  private users: Set<string> = new Set();
  private auditLog: Array<{ event: string; userId: string; detail?: unknown }> = [];

  async generateSecret(userId: string): Promise<TOTPSecretDTO> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(userId, "OTPAuthSandbox", secret);
    const qrCode = await qrcode.toDataURL(otpauth);
    this.users.add(userId);
    this.auditLog.push({ event: "generateSecret", userId });
    return {
      userId,
      secret,
      qrCode,
      createdAt: new Date(),
    };
  }

  async saveSecret(userId: string, secret: string, db: unknown): Promise<void> {
    await db.collection("totpSecrets").insertOne({
      userId,
      secret,
      createdAt: new Date(),
    });
  }

  verifyCode(secret: string, code: string, userId?: string): boolean {
    const valid = authenticator.check(code, secret);
    if (userId) {
      this.users.add(userId);
      if (!valid) {
        this.failedAttempts[userId] = (this.failedAttempts[userId] || 0) + 1;
        this.auditLog.push({ event: "verifyCode", userId, detail: "fail" });
        if (this.isLocked(userId)) {
          this.auditLog.push({ event: "lock", userId });
        }
      } else {
        this.failedAttempts[userId] = 0;
        this.auditLog.push({ event: "verifyCode", userId, detail: "success" });
      }
    }
    return valid;
  }
  getAuditLog(): Array<{ event: string; userId: string; detail?: unknown }> {
    return this.auditLog;
  }
  getStats(): { userCount: number; failedAttempts: Record<string, number> } {
    // 有効ユーザー数と各ユーザーの認証失敗回数を返す
    const stats: Record<string, number> = {};
    this.users.forEach(userId => {
      stats[userId] = this.failedAttempts[userId] || 0;
    });
    return {
      userCount: this.users.size,
      failedAttempts: stats,
    };
  }

  isLocked(userId: string): boolean {
    return (this.failedAttempts[userId] || 0) >= 3;
  }
}
