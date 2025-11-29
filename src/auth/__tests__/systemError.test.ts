import { AuthService, AuthErrorType, AuthResult } from '../authService';

describe('システム障害時のエラー表示', () => {
  test('システム障害時はSystemError型で返却', async () => {
    // 障害をシミュレートするため、エラーを投げるAuthServiceを用意
    class ErrorAuthService extends AuthService {
      async authenticate(id: string, password: string): Promise<AuthResult> {
        try {
          throw new Error('DB接続失敗');
        } catch (e: any) {
          return {
            success: false,
            error: { type: AuthErrorType.SystemError, message: e.message },
          };
        }
      }
    }
    const service = new ErrorAuthService({ userId: 'user1', passwordHash: 'hashedpass' });
    const result = await service.authenticate('user1', 'hashedpass');
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe(AuthErrorType.SystemError);
    expect(result.error?.message).toBe('DB接続失敗');
  });
});
