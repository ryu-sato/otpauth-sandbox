import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';


export type TOTPSecretDTO = {
  userId: string;
  secret: string;
  qrCode: string;
  createdAt: Date;
};

export class TOTPService {
  private failedAttempts: Record<string, number> = {};

  async generateSecret(userId: string): Promise<TOTPSecretDTO> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(userId, 'OTPAuthSandbox', secret);
    const qrCode = await qrcode.toDataURL(otpauth);
    return {
      userId,
      secret,
      qrCode,
      createdAt: new Date(),
    };
  }

  async saveSecret(userId: string, secret: string, db: any): Promise<void> {
    await db.collection('totpSecrets').insertOne({
      userId,
      secret,
      createdAt: new Date(),
    });
  }

  verifyCode(secret: string, code: string, userId?: string): boolean {
    const valid = authenticator.check(code, secret);
    if (userId) {
      if (!valid) {
        this.failedAttempts[userId] = (this.failedAttempts[userId] || 0) + 1;
      } else {
        this.failedAttempts[userId] = 0;
      }
    }
    return valid;
  }

  isLocked(userId: string): boolean {
    return (this.failedAttempts[userId] || 0) >= 3;
  }
}
