import express from 'express';
import path from 'path';
import { AuthService } from './auth/authService';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

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

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
