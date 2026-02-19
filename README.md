# Todo 全端應用

一個前後端分離的 Todo 應用，使用 Vanilla JavaScript 與 PostgreSQL 建立。

## 技術棧

- **後端**：Node.js + Express + PostgreSQL + Prisma ORM
- **前端**：Vite + Vanilla JavaScript
- **資料庫**：PostgreSQL
- **ORM**：Prisma

## 專案結構

```
cursorProject/
├── backend/          # 後端 API 伺服器
│   ├── prisma/       # Prisma schema 與 migrations
│   └── src/          # 原始碼
├── frontend/         # 前端 UI
└── README.md
```

## 前置需求

- Node.js 18+ 
- PostgreSQL 資料庫（本地或遠端）
- （選用）Navicat 或其他資料庫管理工具

## 快速開始

### 1. 設定資料庫

在 `backend/.env` 檔案中設定 PostgreSQL 連線字串：

```
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"
```

請替換為你的 PostgreSQL 連線資訊。

### 2. 安裝依賴

```bash
# 安裝後端依賴
cd backend
npm install

# 安裝前端依賴
cd ../frontend
npm install
```

### 3. 執行資料庫遷移

```bash
cd backend
npx prisma migrate dev --name init
```

這會建立 `todos` 資料表。

### 4. 啟動後端

```bash
cd backend
npm start
```

後端會在 `http://localhost:3000` 啟動。

### 5. 啟動前端

開啟新的終端視窗：

```bash
cd frontend
npm run dev
```

前端會在 `http://localhost:5173` 啟動。

### 6. 開始使用

在瀏覽器開啟 `http://localhost:5173`，即可開始使用 Todo 應用！

## 功能

- ✅ 新增待辦事項
- ✅ 切換完成狀態
- ✅ 刪除待辦事項
- ✅ 資料持久化（存在 PostgreSQL）
- ✅ 美觀的 UI 設計
- ✅ 錯誤處理與載入狀態

## API 文件

詳見 [API_DOCS.md](./API_DOCS.md)

## 開發

### 後端開發模式（自動重啟）

```bash
cd backend
npm run dev
```

### 前端開發模式（熱更新）

```bash
cd frontend
npm run dev
```

### 資料庫管理

**使用 Prisma Studio**：

```bash
cd backend
npx prisma studio
```

會在瀏覽器開啟 http://localhost:5555，提供視覺化的資料庫管理介面。

**使用 Navicat**：

你也可以使用 Navicat 連接 PostgreSQL 資料庫，查看和管理資料。

### Prisma 常用指令

```bash
# 建立新的 migration
npx prisma migrate dev --name migration_name

# 重設資料庫
npx prisma migrate reset

# 生成 Prisma Client
npx prisma generate

# 查看資料庫結構
npx prisma studio
```

## 建置

### 前端建置

```bash
cd frontend
npm run build
```

建置後的檔案會在 `frontend/dist/` 目錄。

## 學習重點

這個專案適合練習：

1. **前後端分離**：前端透過 REST API 與後端溝通
2. **JavaScript 非同步**：fetch、async/await、錯誤處理
3. **REST API 設計**：CRUD 操作、HTTP 方法、狀態碼
4. **DOM 操作**：動態渲染、事件處理
5. **PostgreSQL 資料庫**：關聯式資料庫、SQL 查詢
6. **Prisma ORM**：型別安全的資料庫操作、資料庫遷移

## 授權

MIT
