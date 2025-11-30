import { IUserSchema } from "../auth/User";

// セッションに記録されたユーザー情報の型定義
export interface SessionUser extends IUserSchema {
  login_time: Date;
  auth_level: "basic" | "elevated";
  elevated_at: Date | null;
};
