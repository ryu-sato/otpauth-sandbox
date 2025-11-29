import express from "express";
import path from "path";
import { AuthService } from "./auth/authService";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// ユーザー新規作成 RESTful: POST /api/users
app.post("/api/users", async (req, res) => {
  const { id, password } = req.body;
  const authService = new AuthService();
  const result = await authService.createNewUser(id, password);
  if (result.success) {
    res.status(201).json({ success: true });
  } else {
    const status = result.error === "IDとパスワードは必須です" ? 400 : 500;
    res.status(status).json({ success: false, error: result.error });
  }
});

// 認証 RESTful: POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  const { id, password } = req.body;
  const authService = new AuthService();
  const result = await authService.authenticate(id, password);
  if (result.success) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: result.error });
  }
});

// プロフィール編集 RESTful: PATCH /api/users/:id
// 前提:
// - セッションベース認証
// - 編集操作を行うユーザー名はログインしているユーザーと同一であること
app.patch("/api/users/:id", async (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;
  const authService = new AuthService();
  const result = await authService.editProfile(username, email, userId);
  if (result.success) {
    res.json({ success: true });
  } else {
    // エラー内容に応じてステータスを返す
    if (result.error === "認証トークンが不正です") {
      res.status(401).json({ error: result.error });
    } else if (result.error === "バリデーションエラー") {
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
