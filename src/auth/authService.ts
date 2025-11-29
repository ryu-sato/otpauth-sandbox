export enum AuthErrorType {
  ValidationError = 'ValidationError',
  AuthFailed = 'AuthFailed',
  Locked = 'Locked',
  SystemError = 'SystemError',
}

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
  private userId: string;
  private passwordHash: string;

  constructor(user: { userId: string; passwordHash: string }) {
    this.userId = user.userId;
    this.passwordHash = user.passwordHash;
  }

  async authenticate(id: string, password: string): Promise<AuthResult> {
    if (!id || !password) {
      return {
        success: false,
        error: { type: AuthErrorType.ValidationError, message: 'IDとパスワードは必須です' },
      };
    }
    if (id !== this.userId || password !== this.passwordHash) {
      return {
        success: false,
        error: { type: AuthErrorType.AuthFailed, message: 'IDまたはパスワードが不正です' },
      };
    }
    return { success: true };
  }
}
