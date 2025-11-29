import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

export type TOTPSecretDTO = {
  userId: string;
  secret: string;
  qrCode: string;
  createdAt: Date;
};

export class TOTPService {
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

  verifyCode(secret: string, code: string): boolean {
    return authenticator.check(code, secret);
  }
}
