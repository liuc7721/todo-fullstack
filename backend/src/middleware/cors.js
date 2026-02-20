import cors from 'cors';

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

export const corsMiddleware = cors({
  origin: allowedOrigin, // Vite 預設 port
  credentials: true
});
