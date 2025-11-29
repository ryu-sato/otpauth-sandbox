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

  /**
   * プロフィール編集（セッションベース認証）
   * @param username 編集対象ユーザー名
   * @param email 新しいメールアドレス
   */
  async editProfile(username: string, email: string, sessionUser: string): Promise<{ success: boolean; error?: string }> {
    if (!username || !email) {
      return { success: false, error: 'バリデーションエラー' };
    }
    if (sessionUser !== username) {
      return { success: false, error: '本人以外は編集できません' };
    }
    // 本来はDB更新処理を行う
    // ここではダミーで成功を返す
    return { success: true };
  }

  async createNewUser(id: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!id || !password) {
      return { success: false, error: 'IDとパスワードは必須です' };
    }
    try {
      const email = `${id}@example.com`;
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({ username: id, email, password: hashedPassword });
      await user.save();
      return { success: true };
    } catch (err) {
      let errorMsg = 'ユーザー作成に失敗しました';
      if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 11000) {
        errorMsg = 'IDまたはメールが既に存在します';
      }
      return { success: false, error: errorMsg };
    }
  }

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
      // パスワード照合（bcryptjsによるハッシュ比較）
      const bcrypt = require('bcryptjs');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
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
