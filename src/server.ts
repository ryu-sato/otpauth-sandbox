import express from "express";
import path from "path";
import { AuthService } from "./auth/authService";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { IUser } from "./auth/User";

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
authService.initializeWithExpress(app);

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// ユーザー新規作成 RESTful: POST /api/users
app.post("/api/users", async (req, res) => {
  const { id, password } = req.body;
  const result = await authService.createNewUser(id, password);
  if (result.success) {
    res.status(201).json({ success: true });
  } else {
    const status = result.error === "IDとパスワードは必須です" ? 400 : 500;
    res.status(status).json({ success: false, error: result.error });
  }
});

// 認証 RESTful: POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  console.log("Login endpoint hit");
  authService.loginHandler(req, res, () => {
    console.log("ログイン成功レスポンス送信");
    return res.json({ success: true, user: req.user });
  });
});

// 認証ヘルスチェック RESTful: GET /api/auth/health
app.get("/api/auth/health", authService.requireLogin, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// プロフィール編集 RESTful: PATCH /api/users/:username
app.patch("/api/users/:username", authService.requireLogin, async (req, res) => {
  console.log("Edit profile endpoint hit");
  const { username, email } = req.body;
  const userId = (req.user as IUser).username;
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
