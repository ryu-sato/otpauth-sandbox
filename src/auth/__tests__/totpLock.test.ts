import { TOTPService } from '../totpService';

describe('TOTPService 認証失敗時のロック・追加対策', () => {
  it('TOTP認証に複数回失敗した場合にロックされる', () => {
    const service = new TOTPService();
    const userId = 'lockuser';
    for (let i = 0; i < 5; i++) {
      service.verifyCode('KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD', '000000', userId);
    }
    expect(service.isLocked(userId)).toBe(true);
  });
});
