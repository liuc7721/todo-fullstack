import cors from 'cors';

export const corsMiddleware = cors({
  origin: 'http://localhost:5173', // Vite 預設 port
  credentials: true
});
