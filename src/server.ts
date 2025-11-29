import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイル（Reactビルド成果物）を公開
app.use(express.static(path.join(__dirname, "..", 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
