import express from 'express';
import path from 'path';
import { AuthService } from './auth/authService';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './auth/User';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB接続
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/otpauth-sandbox';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDBに接続しました');
  })
  .catch((err) => {
    console.error('MongoDB接続エラー:', err);
    process.exit(1);
  });

// 静的ファイル（Reactビルド成果物）を公開
app.use(express.static(path.join(__dirname, "..", 'public')));
// JSONボディのパース
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'public', 'index.html'));
});

app.post('/api/create-user', async (req, res) => {
  const { id, password } = req.body;
  const authService = new AuthService();
  const result = await authService.createUser(id, password);
  if (result.success) {
    res.json({ success: true });
  } else {
    const status = result.error === 'IDとパスワードは必須です' ? 400 : 500;
    res.status(status).json({ success: false, error: result.error });
  }
});

app.post('/api/authenticate', async (req, res) => {
  const { id, password } = req.body;
  const authService = new AuthService();
  const result = await authService.authenticate(id, password);
  if (result.success) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: result.error });
  }
});

// UserProfileEditAPI: プロフィール編集
app.post('/api/profile/edit', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '認証トークンが必要です' });
  }
  const token = authHeader.replace('Bearer ', '');
  let payload: any;
  try {
    payload = jwt.verify(token, 'test-secret');
  } catch (e) {
    return res.status(401).json({ error: '認証トークンが不正です' });
  }
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'バリデーションエラー' });
  }
  // 本人確認
  if (payload.id !== username) {
    return res.status(403).json({ error: '本人以外は編集できません' });
  }
  // 編集処理（ダミー）
  // 本来はDB更新処理を行う
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});

export default app;
