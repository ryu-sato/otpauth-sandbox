export enum AuthErrorType {
  ValidationError = 'ValidationError',
  AuthFailed = 'AuthFailed',
  Locked = 'Locked',
  SystemError = 'SystemError',
}

import User from './User';

export type AuthError =
  | { type: AuthErrorType.ValidationError; message: string }
  | { type: AuthErrorType.AuthFailed; message: string }
  | { type: AuthErrorType.Locked; message: string }
  | { type: AuthErrorType.SystemError; message: string };

export type AuthResult = {
  success: boolean;
  error?: AuthError;
};

export class AuthService {
  private loginAttempts: number = 0;
  private locked: boolean = false;

  constructor() {}

  async authenticate(id: string, password: string): Promise<AuthResult> {
    try {
      if (this.locked) {
        return {
          success: false,
          error: { type: AuthErrorType.Locked, message: 'アカウントがロックされています' },
        };
      }
      if (!id || !password) {
        return {
          success: false,
          error: { type: AuthErrorType.ValidationError, message: 'IDとパスワードは必須です' },
        };
      }
      // Mongooseでユーザー検索
      const user = await User.findOne({ username: id });
      if (!user) {
        this.loginAttempts++;
        if (this.loginAttempts >= 5) {
          this.locked = true;
          return {
            success: false,
            error: { type: AuthErrorType.Locked, message: 'アカウントがロックされています' },
          };
        }
        return {
          success: false,
          error: { type: AuthErrorType.AuthFailed, message: 'IDまたはパスワードが不正です' },
        };
      }
      // パスワード照合（本来はハッシュ化して比較するべき）
      if (password !== user.password) {
        this.loginAttempts++;
        if (this.loginAttempts >= 5) {
          this.locked = true;
          return {
            success: false,
            error: { type: AuthErrorType.Locked, message: 'アカウントがロックされています' },
          };
        }
        return {
          success: false,
          error: { type: AuthErrorType.AuthFailed, message: 'IDまたはパスワードが不正です' },
        };
      }
      this.loginAttempts = 0;
      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error: { type: AuthErrorType.SystemError, message: e.message || 'システム障害' },
      };
    }
  }
}
