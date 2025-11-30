import express from "express";
import path from "path";
import { AuthService } from "./auth/authService";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const authService = new AuthService();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB接続
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/otpauth-sandbox";
mongoose.connect(mongoUri)
  .then(() => {
    console.log("MongoDBに接続しました");
  })
  .catch((err) => {
    console.error("MongoDB接続エラー:", err);
    process.exit(1);
  });

// 静的ファイル（Reactビルド成果物）を公開
app.use(express.static(path.join(__dirname, "..", "public")));
// JSONボディのパース
app.use(bodyParser.json());
app.use(cookieParser());
authService.initializeWithExpress(app);

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// ユーザー新規作成要求 RESTful: POST /api/user_registration_requests
app.post("/api/user_registration_requests", async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.requestUserRegistration(username, password);
  if (result.success) {
    res.cookie("registration_session", result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000 // 30分
    });
    res.status(201).json({ success: true, qrCode: result.qrCode });
  } else {
    const status = result.error === "IDとパスワードは必須です" ? 400 : 500;
    res.status(status).json({ success: false, error: result.error });
  }
});

// ユーザー新規作成 RESTful: POST /api/users
app.post("/api/users", async (req, res) => {
  console.log("User creation endpoint hit");
  console.log("Requests cookies: ", req.cookies);
  const registrationSession = req.cookies["registration_session"];
  const { username, code } = req.body;
  const result = await authService.createNewUser(registrationSession, username, code);
  if (result.success) {
    console.log("User creation successful for:", username);
    res.clearCookie("registration_session");
    res.status(201).json({ success: true });
  } else {
    const status = result.error === "セッションが無効です" || result.error === "不正なTOTPコードです" ? 400 : 500;
    console.log("User creation failed:", result.error);
    res.status(status).json({ success: false, error: result.error });
  }
});

// 認証 RESTful: POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  console.log("Login endpoint hit");
  authService.loginHandler(req, res, () => {
    console.log("ログイン成功レスポンス送信");
    res.json({ success: true, user: req.user });
  });
});

// 認証ヘルスチェック RESTful: GET /api/auth/health
app.get("/api/auth/health", authService.requireLogin, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// プロフィール編集 RESTful: PATCH /api/users/:username
app.patch("/api/users/:username",
  authService.requireLogin,
  authService.requireHighLevelAuth
, async (req, res) => {
  console.log("Edit profile endpoint hit");
  const { username, email } = req.body;
  const userId = req.user!.username;
  const result = await authService.editProfile(username, email, userId);
  if (result.success) {
    res.json({ success: true });
  } else {
    if (result.error === "バリデーションエラー") {
      res.status(400).json({ error: result.error });
    } else if (result.error === "本人以外は編集できません") {
      res.status(403).json({ error: result.error });
    } else {
      res.status(500).json({ error: result.error });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});

export default app;
