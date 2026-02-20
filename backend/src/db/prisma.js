import { PrismaClient } from '@prisma/client';

// 優化 Prisma Client 連線池設定，提升效能
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// 優化連線池：重用連線，減少延遲
// Prisma 預設會管理連線池，但我們可以確保在應用關閉時正確斷開連線
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
