import { authenticator } from "otplib";
import * as qrcode from "qrcode";


export type TOTPSecretDTO = {
  username: string;
  secret: string;
  qrCode: string;
  createdAt: Date;
};

export class TOTPService {
  private failedAttempts: Record<string, number> = {};
  private users: Set<string> = new Set();
  private auditLog: Array<{ event: string; username: string; detail?: unknown }> = [];

  async generateSecret(username: string): Promise<TOTPSecretDTO> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(username, "OTPAuthSandbox", secret);
    const qrCode = await qrcode.toDataURL(otpauth);
    this.users.add(username);
    this.auditLog.push({ event: "generateSecret", username });
    return {
      username,
      secret,
      qrCode,
      createdAt: new Date(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveSecret(username: string, secret: string, db: any): Promise<void> {
    await db.collection("totpSecrets").insertOne({
      username,
      secret,
      createdAt: new Date(),
    });
  }

  verifyCode(secret: string, code: string, username?: string): boolean {
    const valid = authenticator.check(code, secret);
    if (username) {
      this.users.add(username);
      if (!valid) {
        this.failedAttempts[username] = (this.failedAttempts[username] || 0) + 1;
        this.auditLog.push({ event: "verifyCode", username, detail: "fail" });
        if (this.isLocked(username)) {
          this.auditLog.push({ event: "lock", username });
        }
      } else {
        this.failedAttempts[username] = 0;
        this.auditLog.push({ event: "verifyCode", username, detail: "success" });
      }
    }
    return valid;
  }
  getAuditLog(): Array<{ event: string; username: string; detail?: unknown }> {
    return this.auditLog;
  }
  getStats(): { userCount: number; failedAttempts: Record<string, number> } {
    // 有効ユーザー数と各ユーザーの認証失敗回数を返す
    const stats: Record<string, number> = {};
    this.users.forEach(username => {
      stats[username] = this.failedAttempts[username] || 0;
    });
    return {
      userCount: this.users.size,
      failedAttempts: stats,
    };
  }

  isLocked(username: string): boolean {
    return (this.failedAttempts[username] || 0) >= 3;
  }
}
