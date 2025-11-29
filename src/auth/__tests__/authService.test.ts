import { AuthService, AuthErrorType } from '../authService';

describe('AuthService', () => {
  test('IDとパスワードが一致すれば認証成功', async () => {
  const service = new AuthService();
    const result = await service.authenticate('user1', 'hashedpass');
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('IDが不一致ならAuthFailedエラー', async () => {
  const service = new AuthService();
    const result = await service.authenticate('user2', 'hashedpass');
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe(AuthErrorType.AuthFailed);
  });

  test('パスワードが不一致ならAuthFailedエラー', async () => {
  const service = new AuthService();
    const result = await service.authenticate('user1', 'wrongpass');
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe(AuthErrorType.AuthFailed);
  });

  test('空欄ならValidationError', async () => {
    const service = new AuthService({ userId: 'user1', passwordHash: 'hashedpass' });
    const result = await service.authenticate('', '');
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe(AuthErrorType.ValidationError);
  });
});
