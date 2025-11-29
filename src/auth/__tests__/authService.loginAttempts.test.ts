import { AuthService, AuthErrorType } from '../authService';

describe('AuthService ログイン試行回数・ロック機能', () => {
  test('5回失敗でロックされる', async () => {
    const service = new AuthService({ userId: 'user1', passwordHash: 'hashedpass' });
    for (let i = 0; i < 5; i++) {
      await service.authenticate('user1', 'wrongpass');
    }
    const result = await service.authenticate('user1', 'hashedpass');
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe(AuthErrorType.Locked);
  });

  test('ロック状態では常にLockedエラー', async () => {
    const service = new AuthService({ userId: 'user1', passwordHash: 'hashedpass' });
    for (let i = 0; i < 5; i++) {
      await service.authenticate('user1', 'wrongpass');
    }
    const result = await service.authenticate('user1', 'wrongpass');
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe(AuthErrorType.Locked);
  });

  test('ロック前はAuthFailedエラー', async () => {
    const service = new AuthService({ userId: 'user1', passwordHash: 'hashedpass' });
    for (let i = 0; i < 4; i++) {
      const result = await service.authenticate('user1', 'wrongpass');
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe(AuthErrorType.AuthFailed);
    }
  });
});
