import User, { IUser } from "./User";
import bcrypt from "bcryptjs";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express, Request, Response, NextFunction } from "express";

export enum AuthErrorType {
  ValidationError = "ValidationError",
  AuthFailed = "AuthFailed",
  Locked = "Locked",
  SystemError = "SystemError",
}

export type AuthError =
  | { type: AuthErrorType.ValidationError; message: string }
  | { type: AuthErrorType.AuthFailed; message: string }
  | { type: AuthErrorType.Locked; message: string }
  | { type: AuthErrorType.SystemError; message: string };

export type AuthResult = {
  success: boolean;
  error?: AuthError;
  user?: InstanceType<typeof User> | undefined;
};

export type AfterAuthenticatedCallback = (
  err: null,
  user: IUser | undefined,
  info?: { message: string }
) => void;

export class AuthService {
  private loginAttempts: number = 0;
  private locked: boolean = false;

  constructor() {}

  initializeWithExpress(app: Express) {
    passport.use(new LocalStrategy(async (username, password, cb: AfterAuthenticatedCallback) => {
      console.log("ローカルストラテジー実行:", username);
      const authService = new AuthService();
      const authResult = await authService.authenticate(username, password);
      if (!authResult.success) {
        const message = authResult.error?.message || "認証に失敗しました";
        console.log("認証失敗:", message, username);
        return cb(null, undefined, { message });
      }
      console.log("認証成功:", authResult.user);
      return cb(null, authResult.user);
    }));

    // セッション管理(express-session)
    type SessionUser = {
      username: string;
    };

    app.use(session({
      secret: "keyboard cat",
      resave: true,
      saveUninitialized: false,
    }));
    app.use(passport.authenticate("session"));

    passport.serializeUser(function(user, cb) {
      process.nextTick(function() {
        cb(null, { username: user.username } as SessionUser);
      });
    });

    passport.deserializeUser(function(sessionUser: SessionUser, cb) {
      process.nextTick(async function() {
        const user = await User.findOne({ username: sessionUser.username });
        return cb(null, user);
      });
    });
  }

  // ログイン用のミドルウェア
  loginHandler(req: Request, res: Response, next: NextFunction) {
    const callback: AfterAuthenticatedCallback = (err, user, info) => {
      if (err || !user) {
        console.log("ログイン失敗:", info?.message || "認証に失敗しました");
        return res.status(401).json({ error: info?.message || "認証に失敗しました" });
      }
      // 注意: このミドルウェアを使う前に Express アプリで express-session を必ず有効化してください。
      // 例:
      // import session from "express-session";
      // app.use(session({ secret: "your-secret", resave: false, saveUninitialized: false }));
      req.logIn(user, (err) => {
        if (err) {
          console.log("ログイン処理エラー:", err);
          return res.status(500).json({ error: "ログイン処理に失敗しました" });
        }
        console.log("ログイン成功:", user.username);
        return res.json({ success: true, user });
      });
    };
    passport.authenticate("local", callback)(req, res, next);
  }

  requireLogin(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      console.log("requireLogin: User is not authenticated");
      return res.status(401).json({ error: "未認証です" });
    }
    if (!req.user) {
      console.log("requireLogin: req.user is undefined");
      return res.status(401).json({ error: "未認証です" });
    }
    next();
  }

  /**
   * プロフィール編集（セッションベース認証）
   * @param username 編集対象ユーザー名
   * @param email 新しいメールアドレス
   */
  async editProfile(username: string, email: string, sessionUser: string): Promise<{ success: boolean; error?: string }> {
    if (!username || !email) {
      return { success: false, error: "バリデーションエラー" };
    }
    if (sessionUser !== username) {
      return { success: false, error: "本人以外は編集できません" };
    }
    // 本来はDB更新処理を行う
    // ここではダミーで成功を返す
    return { success: true };
  }

  async createNewUser(id: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!id || !password) {
      return { success: false, error: "IDとパスワードは必須です" };
    }
    try {
      const email = `${id}@example.com`;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({ username: id, email, password: hashedPassword });
      await user.save();
      return { success: true };
    } catch (err) {
      let errorMsg = "ユーザー作成に失敗しました";
      if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
        errorMsg = "IDまたはメールが既に存在します";
      }
      return { success: false, error: errorMsg };
    }
  }

  async authenticate(id: string, password: string): Promise<AuthResult> {
    try {
      if (this.locked) {
        return {
          success: false,
          error: { type: AuthErrorType.Locked, message: "アカウントがロックされています" },
        };
      }
      if (!id || !password) {
        return {
          success: false,
          error: { type: AuthErrorType.ValidationError, message: "IDとパスワードは必須です" },
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
            error: { type: AuthErrorType.Locked, message: "アカウントがロックされています" },
          };
        }
        return {
          success: false,
          error: { type: AuthErrorType.AuthFailed, message: "IDまたはパスワードが不正です" },
        };
      }
      // パスワード照合（bcryptjsによるハッシュ比較）
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        this.loginAttempts++;
        if (this.loginAttempts >= 5) {
          this.locked = true;
          return {
            success: false,
            error: { type: AuthErrorType.Locked, message: "アカウントがロックされています" },
          };
        }
        return {
          success: false,
          error: { type: AuthErrorType.AuthFailed, message: "IDまたはパスワードが不正です" },
        };
      }
      this.loginAttempts = 0;
      return { success: true, user: user };
    } catch (e: unknown) {
      return {
        success: false,
        error: { type: AuthErrorType.SystemError, message: (e as Error).message || "システム障害" },
      };
    }
  }
}
