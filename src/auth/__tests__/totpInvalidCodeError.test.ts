import { TOTPService } from '../totpService';

describe('TOTPService 無効なTOTPコードのエラー表示', () => {
  it('無効なTOTPコード入力時にfalseを返す', async () => {
    const service = new TOTPService();
    const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
    const invalidCode = '000000';
    const result = service.verifyCode(secret, invalidCode);
    expect(result).toBe(false);
  });
});
