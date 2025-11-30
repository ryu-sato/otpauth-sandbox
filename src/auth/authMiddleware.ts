import { Strategy as LocalStrategy } from "passport-local";
import { AuthService } from "./authService";
import passport from "passport";

passport.use(new LocalStrategy(async (username, password, cb) => {
  const authService = new AuthService();
  const authResult = await authService.authenticate(username, password);
  if (!authResult.success) {
    const message = authResult.error?.message || "認証に失敗しました";
    return cb(null, false, { message });
  }
  return cb(null, authResult.user);
}));

export const requireLogin = () => {
  return passport.authenticate("local");
};
