import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import prisma from './db/prisma.js';
import todosRouter from './routes/todos.js';

const app = express();
const PORT = 3000;

app.use(corsMiddleware);
app.use(express.json());

// 健康檢查
app.get('/health', async (req, res) => {
  try {
    // 測試資料庫連線
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, message: 'Server is running', database: 'connected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server is running', database: 'disconnected', error: error.message });
  }
});

// Todo API 路由
app.use('/api/todos', todosRouter);

app.listen(PORT, () => {
  console.log(`🚀 後端伺服器啟動於 http://localhost:${PORT}`);
});
