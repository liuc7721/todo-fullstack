# Todo 全端專案 - Agent 自動建置指令

## 專案概述

你是一個資深的全端工程師 Agent，現在要幫助使用者建立一個「前後端分離」的 Todo 全端專案。

### 專案目標

- **學習重點**：練習 JavaScript、REST API、前後端分離架構
- **技術棧**：
  - 後端：Node.js + Express + PostgreSQL + Prisma ORM
  - 前端：Vite + Vanilla JavaScript（不使用 React）
- **功能範圍**：Todo 的 CRUD（建立、讀取、更新、刪除）

### 執行原則

1. **分階段執行**：完成每個階段後，向使用者報告進度並詢問「是否繼續下一階段？」
2. **驗證優先**：每個階段完成後必須進行驗證（測試 API、檢查檔案、執行程式）
3. **錯誤處理**：遇到錯誤時說明原因、提供解決方案，詢問使用者是否繼續
4. **清晰溝通**：用繁體中文報告進度，說明正在做什麼、為什麼這樣做
5. **MCP 整合**：在適當時機使用 MCP 工具進行資料庫操作、瀏覽器測試、API 測試

---

## 專案結構

```
cursorProject/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma 資料模型定義
│   │   └── migrations/       # 資料庫遷移記錄
│   ├── src/
│   │   ├── index.js          # Express 伺服器入口
│   │   ├── routes/
│   │   │   └── todos.js      # Todo CRUD 路由
│   │   ├── db/
│   │   │   └── prisma.js     # Prisma Client 初始化
│   │   └── middleware/
│   │       └── cors.js       # CORS 設定
│   ├── package.json
│   └── .env                  # 資料庫連線字串
│
├── frontend/
│   ├── src/
│   │   ├── main.js           # 入口檔案
│   │   ├── app.js            # 主要應用邏輯
│   │   ├── api/
│   │   │   └── todos.js      # API 呼叫封裝
│   │   └── components/
│   │       └── todoList.js   # Todo 列表元件
│   ├── index.html
│   ├── style.css
│   ├── vite.config.js
│   └── package.json
│
├── README.md                 # 專案說明與啟動指引
├── API_DOCS.md               # API 文件
└── AGENT_PROMPT.md           # 本文件
```

---

## 前置準備

### PostgreSQL 資料庫

使用者需要：
1. 已安裝 PostgreSQL（本地或遠端）
2. 準備好資料庫連線資訊：
   - 主機位址（如 localhost）
   - 端口（預設 5432）
   - 資料庫名稱（建議：todo_db）
   - 使用者名稱
   - 密碼

**重要**：在開始階段 1 之前，請確認你已經有 PostgreSQL 的連線資訊。Agent 會在階段 1 詢問你這些資訊，並協助設定 `.env` 檔案。

### Navicat（選用）

使用者可以使用 Navicat 來：
- 視覺化管理 PostgreSQL 資料庫
- 查看資料表結構
- 直接查詢和修改資料
- 匯入/匯出資料

這不是必須的，Prisma Studio 也提供類似功能（`npx prisma studio`）。

---

## 執行階段

### 階段 1：後端基礎建設

**目標**：建立後端專案結構、安裝依賴、設定 Prisma、初始化資料庫

**步驟**：

1. 建立 `backend/` 資料夾結構：
   ```
   backend/
   ├── prisma/
   ├── src/
   │   ├── db/
   │   ├── routes/
   │   └── middleware/
   ```

2. 建立 `backend/package.json`：
   ```json
   {
     "name": "todo-backend",
     "version": "1.0.0",
     "type": "module",
     "main": "src/index.js",
     "scripts": {
       "start": "node src/index.js",
       "dev": "node --watch src/index.js",
       "prisma:migrate": "prisma migrate dev",
       "prisma:studio": "prisma studio"
     },
     "dependencies": {
       "express": "^4.18.2",
       "cors": "^2.8.5",
       "@prisma/client": "^5.7.0"
     },
     "devDependencies": {
       "prisma": "^5.7.0"
     }
   }
   ```

3. 執行 `npm install`（在 backend/ 目錄）

4. **詢問使用者 PostgreSQL 連線資訊**，然後建立 `backend/.env`：
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"
   ```
   
   請替換：
   - `username`：PostgreSQL 使用者名稱
   - `password`：密碼
   - `localhost`：主機位址（如果是遠端資料庫則改為 IP）
   - `5432`：端口
   - `todo_db`：資料庫名稱

5. 建立 `backend/prisma/schema.prisma`（Prisma 資料模型定義）：
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model Todo {
     id        Int      @id @default(autoincrement())
     title     String
     completed Boolean  @default(false)
     createdAt DateTime @default(now())
   }
   ```

6. 執行 Prisma 遷移，建立資料表：
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```
   
   這會：
   - 連接到 PostgreSQL
   - 建立 `todos` 表
   - 生成 Prisma Client

7. 建立 `backend/src/db/prisma.js`（Prisma Client 初始化）：
   ```javascript
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   export default prisma;
   ```

8. 建立 `backend/src/middleware/cors.js`：
   ```javascript
   import cors from 'cors';

   export const corsMiddleware = cors({
     origin: 'http://localhost:5173', // Vite 預設 port
     credentials: true
   });
   ```

9. 建立 `backend/src/index.js`（基本 Express server）：
   ```javascript
   import express from 'express';
   import { corsMiddleware } from './middleware/cors.js';
   import prisma from './db/prisma.js';

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

   app.listen(PORT, () => {
     console.log(`🚀 後端伺服器啟動於 http://localhost:${PORT}`);
   });
   ```

**驗證步驟**：

1. 執行 `cd backend && npm start`
2. 開啟瀏覽器或使用 curl 測試：`curl http://localhost:3000/health`
3. 應該回傳：`{"success":true,"message":"Server is running","database":"connected"}`
4. 使用 Navicat 連接 PostgreSQL，確認 `todos` 表已建立
5. 或執行 `npx prisma studio`，在瀏覽器開啟 http://localhost:5555 查看資料庫

**完成後**：向使用者報告「階段 1 完成」，詢問是否繼續階段 2。

---

### 階段 2：後端 API 實作

**目標**：實作 Todo 的 CRUD API（使用 Prisma）

**步驟**：

1. 建立 `backend/src/routes/todos.js`：
   ```javascript
   import express from 'express';
   import prisma from '../db/prisma.js';

   const router = express.Router();

   // GET /api/todos - 取得所有待辦
   router.get('/', async (req, res) => {
     try {
       const todos = await prisma.todo.findMany({
         orderBy: { createdAt: 'desc' }
       });
       res.json({ success: true, data: todos });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });

   // POST /api/todos - 新增待辦
   router.post('/', async (req, res) => {
     try {
       const { title } = req.body;
       
       if (!title || title.trim() === '') {
         return res.status(400).json({ success: false, error: '標題不能為空' });
       }

       const newTodo = await prisma.todo.create({
         data: {
           title: title.trim()
         }
       });
       
       res.status(201).json({ success: true, data: newTodo });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });

   // PATCH /api/todos/:id - 更新待辦
   router.patch('/:id', async (req, res) => {
     try {
       const { id } = req.params;
       const { title, completed } = req.body;

       // 檢查 todo 是否存在
       const todo = await prisma.todo.findUnique({
         where: { id: parseInt(id) }
       });
       
       if (!todo) {
         return res.status(404).json({ success: false, error: '找不到該待辦事項' });
       }

       // 動態更新欄位
       const updateData = {};
       
       if (title !== undefined) {
         updateData.title = title.trim();
       }
       if (completed !== undefined) {
         updateData.completed = completed;
       }

       if (Object.keys(updateData).length === 0) {
         return res.status(400).json({ success: false, error: '沒有提供要更新的欄位' });
       }

       const updatedTodo = await prisma.todo.update({
         where: { id: parseInt(id) },
         data: updateData
       });
       
       res.json({ success: true, data: updatedTodo });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });

   // DELETE /api/todos/:id - 刪除待辦
   router.delete('/:id', async (req, res) => {
     try {
       const { id } = req.params;

       // 檢查 todo 是否存在
       const todo = await prisma.todo.findUnique({
         where: { id: parseInt(id) }
       });
       
       if (!todo) {
         return res.status(404).json({ success: false, error: '找不到該待辦事項' });
       }

       await prisma.todo.delete({
         where: { id: parseInt(id) }
       });

       res.json({ success: true, data: { id: parseInt(id) } });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });

   export default router;
   ```

2. 更新 `backend/src/index.js`，加入路由：
   ```javascript
   import express from 'express';
   import { corsMiddleware } from './middleware/cors.js';
   import prisma from './db/prisma.js';
   import todosRouter from './routes/todos.js';

   const app = express();
   const PORT = 3000;

   app.use(corsMiddleware);
   app.use(express.json());

   app.get('/health', async (req, res) => {
     try {
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
   ```

**驗證步驟**：

1. 重新啟動後端伺服器
2. 測試四支 API：
   ```bash
   # GET - 取得所有待辦
   curl http://localhost:3000/api/todos

   # POST - 新增待辦
   curl -X POST http://localhost:3000/api/todos \
     -H "Content-Type: application/json" \
     -d '{"title":"測試待辦事項"}'

   # PATCH - 更新待辦（假設 id=1）
   curl -X PATCH http://localhost:3000/api/todos/1 \
     -H "Content-Type: application/json" \
     -d '{"completed":true}'

   # DELETE - 刪除待辦（假設 id=1）
   curl -X DELETE http://localhost:3000/api/todos/1
   ```

**完成後**：向使用者報告「階段 2 完成，四支 API 已實作並測試通過」，詢問是否繼續階段 3。

---

### 階段 3：MCP 資料庫工具整合與資料驗證（選用）

**目標**：使用 MCP 資料庫工具或其他方式驗證資料庫結構並插入測試資料

**步驟**：

1. 檢查是否有可用的資料庫 MCP 工具
2. 如果有，使用 MCP 工具：
   - 連接到 PostgreSQL
   - 查詢 `todos` 表結構
   - 插入 3-5 筆測試資料
   - 驗證資料是否正確插入

3. 如果沒有資料庫 MCP，可使用以下方式插入測試資料：
   
   **方式 A：使用 Navicat**
   - 開啟 Navicat，連接到 PostgreSQL 資料庫
   - 找到 `todos` 表，查看結構
   - 手動插入 3-5 筆測試資料
   - 或執行 SQL：
     ```sql
     INSERT INTO "Todo" (title, completed) VALUES 
       ('學習 Prisma', false),
       ('建立 Todo API', false),
       ('測試前端功能', false);
     ```
   
   **方式 B：使用 Prisma Studio**
   - 執行 `cd backend && npx prisma studio`
   - 瀏覽器會開啟 http://localhost:5555
   - 在 GUI 介面中新增 3-5 筆測試資料
   
   **方式 C：使用 POST API**
   - 使用 curl 或 Postman 新增 3-5 筆測試 Todo
   - 使用 GET API 驗證資料

**驗證步驟**：

1. 使用 GET API 確認測試資料存在：
   ```bash
   curl http://localhost:3000/api/todos
   ```

2. 使用 Navicat 或 Prisma Studio 查看資料庫，確認資料已正確儲存

3. 確認資料包含正確的欄位：id、title、completed、createdAt

**完成後**：向使用者報告「階段 3 完成，資料庫已有測試資料，可透過 Navicat 或 Prisma Studio 查看」，詢問是否繼續階段 4。

---

### 階段 4：前端基礎建設

**目標**：建立前端專案結構、安裝 Vite、建立基本 HTML/CSS

**步驟**：

1. 建立 `frontend/` 資料夾結構：
   ```
   frontend/
   ├── src/
   │   ├── api/
   │   └── components/
   ```

2. 建立 `frontend/package.json`：
   ```json
   {
     "name": "todo-frontend",
     "version": "1.0.0",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     },
     "devDependencies": {
       "vite": "^5.0.0"
     }
   }
   ```

3. 執行 `npm install`（在 frontend/ 目錄）

4. 建立 `frontend/vite.config.js`：
   ```javascript
   import { defineConfig } from 'vite';

   export default defineConfig({
     server: {
       port: 5173
     }
   });
   ```

5. 建立 `frontend/index.html`：
   ```html
   <!DOCTYPE html>
   <html lang="zh-TW">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Todo 應用</title>
     <link rel="stylesheet" href="/style.css">
   </head>
   <body>
     <div id="app">
       <header>
         <h1>📝 我的待辦清單</h1>
       </header>
       
       <main>
         <div class="add-todo">
           <input 
             type="text" 
             id="todoInput" 
             placeholder="輸入新的待辦事項..." 
             autocomplete="off"
           />
           <button id="addBtn">新增</button>
         </div>

         <div id="loading" class="loading" style="display: none;">
           載入中...
         </div>

         <div id="error" class="error" style="display: none;"></div>

         <ul id="todoList" class="todo-list">
           <!-- Todo 項目會動態插入這裡 -->
         </ul>
       </main>
     </div>

     <script type="module" src="/src/main.js"></script>
   </body>
   </html>
   ```

6. 建立 `frontend/style.css`：
   ```css
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   body {
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     min-height: 100vh;
     padding: 20px;
   }

   #app {
     max-width: 600px;
     margin: 0 auto;
     background: white;
     border-radius: 12px;
     box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
     overflow: hidden;
   }

   header {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     color: white;
     padding: 30px;
     text-align: center;
   }

   header h1 {
     font-size: 28px;
     font-weight: 600;
   }

   main {
     padding: 30px;
   }

   .add-todo {
     display: flex;
     gap: 10px;
     margin-bottom: 30px;
   }

   #todoInput {
     flex: 1;
     padding: 12px 16px;
     border: 2px solid #e0e0e0;
     border-radius: 8px;
     font-size: 16px;
     transition: border-color 0.3s;
   }

   #todoInput:focus {
     outline: none;
     border-color: #667eea;
   }

   #addBtn {
     padding: 12px 24px;
     background: #667eea;
     color: white;
     border: none;
     border-radius: 8px;
     font-size: 16px;
     font-weight: 600;
     cursor: pointer;
     transition: background 0.3s;
   }

   #addBtn:hover {
     background: #5568d3;
   }

   #addBtn:active {
     transform: scale(0.98);
   }

   .loading {
     text-align: center;
     color: #667eea;
     padding: 20px;
     font-size: 16px;
   }

   .error {
     background: #fee;
     color: #c33;
     padding: 12px 16px;
     border-radius: 8px;
     margin-bottom: 20px;
     border-left: 4px solid #c33;
   }

   .todo-list {
     list-style: none;
   }

   .todo-item {
     display: flex;
     align-items: center;
     gap: 12px;
     padding: 16px;
     background: #f9f9f9;
     border-radius: 8px;
     margin-bottom: 10px;
     transition: all 0.3s;
   }

   .todo-item:hover {
     background: #f0f0f0;
     transform: translateX(4px);
   }

   .todo-item.completed {
     opacity: 0.6;
   }

   .todo-checkbox {
     width: 20px;
     height: 20px;
     cursor: pointer;
   }

   .todo-title {
     flex: 1;
     font-size: 16px;
     cursor: pointer;
     user-select: none;
   }

   .todo-item.completed .todo-title {
     text-decoration: line-through;
     color: #999;
   }

   .todo-delete {
     padding: 6px 12px;
     background: #ff4757;
     color: white;
     border: none;
     border-radius: 6px;
     font-size: 14px;
     cursor: pointer;
     transition: background 0.3s;
   }

   .todo-delete:hover {
     background: #ee5a6f;
   }

   .empty-state {
     text-align: center;
     color: #999;
     padding: 40px 20px;
     font-size: 16px;
   }
   ```

**驗證步驟**：

1. 執行 `cd frontend && npm run dev`
2. 開啟瀏覽器訪問 `http://localhost:5173`
3. 應該看到美觀的 Todo 介面（但還沒有功能）

**完成後**：向使用者報告「階段 4 完成，前端介面已建立」，詢問是否繼續階段 5。

---

### 階段 5：前端 API 層與 UI 邏輯

**目標**：實作 API 呼叫封裝、Todo 列表渲染、新增/切換/刪除功能

**步驟**：

1. 建立 `frontend/src/api/todos.js`（API 封裝）：
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api';

   /**
    * 處理 API 回應
    */
   async function handleResponse(response) {
     const data = await response.json();
     
     if (!response.ok) {
       throw new Error(data.error || '請求失敗');
     }
     
     return data;
   }

   /**
    * 取得所有待辦事項
    */
   export async function getTodos() {
     const response = await fetch(`${API_BASE_URL}/todos`);
     return handleResponse(response);
   }

   /**
    * 新增待辦事項
    */
   export async function createTodo(title) {
     const response = await fetch(`${API_BASE_URL}/todos`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ title }),
     });
     return handleResponse(response);
   }

   /**
    * 更新待辦事項
    */
   export async function updateTodo(id, updates) {
     const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
       method: 'PATCH',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(updates),
     });
     return handleResponse(response);
   }

   /**
    * 刪除待辦事項
    */
   export async function deleteTodo(id) {
     const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
       method: 'DELETE',
     });
     return handleResponse(response);
   }
   ```

2. 建立 `frontend/src/components/todoList.js`（渲染邏輯）：
   ```javascript
   /**
    * 渲染單個 Todo 項目
    */
   function renderTodoItem(todo, onToggle, onDelete) {
     const li = document.createElement('li');
     li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
     li.dataset.id = todo.id;

     const checkbox = document.createElement('input');
     checkbox.type = 'checkbox';
     checkbox.className = 'todo-checkbox';
     checkbox.checked = todo.completed;
     checkbox.addEventListener('change', () => onToggle(todo.id, !todo.completed));

     const title = document.createElement('span');
     title.className = 'todo-title';
     title.textContent = todo.title;
     title.addEventListener('click', () => onToggle(todo.id, !todo.completed));

     const deleteBtn = document.createElement('button');
     deleteBtn.className = 'todo-delete';
     deleteBtn.textContent = '刪除';
     deleteBtn.addEventListener('click', () => onDelete(todo.id));

     li.appendChild(checkbox);
     li.appendChild(title);
     li.appendChild(deleteBtn);

     return li;
   }

   /**
    * 渲染 Todo 列表
    */
   export function renderTodoList(todos, onToggle, onDelete) {
     const listElement = document.getElementById('todoList');
     listElement.innerHTML = '';

     if (todos.length === 0) {
       const emptyState = document.createElement('div');
       emptyState.className = 'empty-state';
       emptyState.textContent = '🎉 沒有待辦事項！';
       listElement.appendChild(emptyState);
       return;
     }

     todos.forEach(todo => {
       const todoItem = renderTodoItem(todo, onToggle, onDelete);
       listElement.appendChild(todoItem);
     });
   }
   ```

3. 建立 `frontend/src/app.js`（主要應用邏輯）：
   ```javascript
   import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todos.js';
   import { renderTodoList } from './components/todoList.js';

   // 應用狀態
   let todos = [];

   // DOM 元素
   const todoInput = document.getElementById('todoInput');
   const addBtn = document.getElementById('addBtn');
   const loadingEl = document.getElementById('loading');
   const errorEl = document.getElementById('error');

   /**
    * 顯示載入中
    */
   function showLoading() {
     loadingEl.style.display = 'block';
     errorEl.style.display = 'none';
   }

   /**
    * 隱藏載入中
    */
   function hideLoading() {
     loadingEl.style.display = 'none';
   }

   /**
    * 顯示錯誤訊息
    */
   function showError(message) {
     errorEl.textContent = `❌ ${message}`;
     errorEl.style.display = 'block';
     setTimeout(() => {
       errorEl.style.display = 'none';
     }, 3000);
   }

   /**
    * 載入所有待辦事項
    */
   async function loadTodos() {
     try {
       showLoading();
       const response = await getTodos();
       todos = response.data;
       renderTodoList(todos, handleToggleTodo, handleDeleteTodo);
     } catch (error) {
       showError(error.message);
     } finally {
       hideLoading();
     }
   }

   /**
    * 新增待辦事項
    */
   async function handleAddTodo() {
     const title = todoInput.value.trim();
     
     if (!title) {
       showError('請輸入待辦事項');
       return;
     }

     try {
       showLoading();
       await createTodo(title);
       todoInput.value = '';
       await loadTodos(); // 重新載入列表
     } catch (error) {
       showError(error.message);
     } finally {
       hideLoading();
     }
   }

   /**
    * 切換待辦事項完成狀態
    */
   async function handleToggleTodo(id, completed) {
     try {
       await updateTodo(id, { completed });
       await loadTodos(); // 重新載入列表
     } catch (error) {
       showError(error.message);
     }
   }

   /**
    * 刪除待辦事項
    */
   async function handleDeleteTodo(id) {
     if (!confirm('確定要刪除這個待辦事項嗎？')) {
       return;
     }

     try {
       showLoading();
       await deleteTodo(id);
       await loadTodos(); // 重新載入列表
     } catch (error) {
       showError(error.message);
     } finally {
       hideLoading();
     }
   }

   /**
    * 初始化應用
    */
   export function initApp() {
     // 綁定事件
     addBtn.addEventListener('click', handleAddTodo);
     todoInput.addEventListener('keypress', (e) => {
       if (e.key === 'Enter') {
         handleAddTodo();
       }
     });

     // 載入初始資料
     loadTodos();
   }
   ```

4. 建立 `frontend/src/main.js`（入口檔案）：
   ```javascript
   import { initApp } from './app.js';

   // 當 DOM 載入完成後初始化應用
   document.addEventListener('DOMContentLoaded', () => {
     initApp();
   });
   ```

**驗證步驟**：

1. 確保後端伺服器正在運行（`http://localhost:3000`）
2. 確保前端開發伺服器正在運行（`http://localhost:5173`）
3. 開啟瀏覽器，測試以下功能：
   - 頁面載入時應該顯示現有的 Todo（如果有的話）
   - 在輸入框輸入「測試項目」並點擊「新增」，應該出現在列表中
   - 點擊 Todo 項目或勾選框，應該切換完成狀態（文字會有刪除線）
   - 點擊「刪除」按鈕，確認後項目應該消失
   - 重新整理頁面，資料應該還在（持久化）

**完成後**：向使用者報告「階段 5 完成，Todo 應用已可正常使用」，詢問是否繼續階段 6。

---

### 階段 6：MCP 瀏覽器測試（選用）

**目標**：使用 cursor-ide-browser MCP 自動測試前端功能

**步驟**：

1. 確認前端開發伺服器正在運行
2. 使用 browser MCP 工具進行自動化測試：

   a. 導航到前端頁面：
   ```
   使用 browser_navigate 開啟 http://localhost:5173
   ```

   b. 取得頁面快照：
   ```
   使用 browser_snapshot 檢查頁面結構
   ```

   c. 測試新增 Todo：
   ```
   使用 browser_fill 在輸入框填入「自動測試項目」
   使用 browser_click 點擊「新增」按鈕
   等待 2 秒
   使用 browser_snapshot 確認項目已新增
   ```

   d. 測試切換完成狀態：
   ```
   使用 browser_click 點擊第一個 Todo 的勾選框
   等待 1 秒
   使用 browser_snapshot 確認狀態已改變
   ```

   e. 測試刪除功能：
   ```
   使用 browser_click 點擊「刪除」按鈕
   處理確認對話框（browser_handle_dialog）
   等待 1 秒
   使用 browser_snapshot 確認項目已刪除
   ```

   f. 截圖驗證：
   ```
   使用 browser_screenshot 截取最終畫面
   ```

**驗證步驟**：

1. 檢查每個操作後的 snapshot，確認 DOM 變化正確
2. 檢查截圖，確認 UI 顯示正常
3. 如果測試失敗，記錄錯誤並報告給使用者

**完成後**：向使用者報告「階段 6 完成，瀏覽器自動化測試通過」，詢問是否繼續階段 7。

---

### 階段 7：整合測試與文件

**目標**：建立專案文件、進行最終驗證

**步驟**：

1. 建立 `README.md`：
   ```markdown
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
   ```

2. 建立 `API_DOCS.md`：
   ```markdown
   # API 文件

   Base URL: `http://localhost:3000/api`

   ## 回應格式

   所有 API 回應都使用統一格式：

   **成功**：
   ```json
   {
     "success": true,
     "data": { ... }
   }
   ```

   **失敗**：
   ```json
   {
     "success": false,
     "error": "錯誤訊息"
   }
   ```

   ## 端點

   ### 1. 取得所有待辦事項

   ```
   GET /api/todos
   ```

   **回應範例**：
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "title": "買牛奶",
         "completed": 0,
         "createdAt": "2024-01-01 12:00:00"
       },
       {
         "id": 2,
         "title": "寫程式",
         "completed": 1,
         "createdAt": "2024-01-01 13:00:00"
       }
     ]
   }
   ```

   ### 2. 新增待辦事項

   ```
   POST /api/todos
   ```

   **請求 Body**：
   ```json
   {
     "title": "待辦事項標題"
   }
   ```

   **回應範例**：
   ```json
   {
     "success": true,
     "data": {
       "id": 3,
       "title": "待辦事項標題",
       "completed": 0,
       "createdAt": "2024-01-01 14:00:00"
     }
   }
   ```

   **錯誤回應**（400）：
   ```json
   {
     "success": false,
     "error": "標題不能為空"
   }
   ```

   ### 3. 更新待辦事項

   ```
   PATCH /api/todos/:id
   ```

   **請求 Body**（可只傳要更新的欄位）：
   ```json
   {
     "title": "新標題",
     "completed": true
   }
   ```

   **回應範例**：
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "title": "新標題",
       "completed": 1,
       "createdAt": "2024-01-01 12:00:00"
     }
   }
   ```

   **錯誤回應**（404）：
   ```json
   {
     "success": false,
     "error": "找不到該待辦事項"
   }
   ```

   ### 4. 刪除待辦事項

   ```
   DELETE /api/todos/:id
   ```

   **回應範例**：
   ```json
   {
     "success": true,
     "data": {
       "id": 1
     }
   }
   ```

   **錯誤回應**（404）：
   ```json
   {
     "success": false,
     "error": "找不到該待辦事項"
   }
   ```

   ## 錯誤碼

   - `200` - 成功
   - `201` - 建立成功
   - `400` - 請求錯誤（如缺少必要欄位）
   - `404` - 找不到資源
   - `500` - 伺服器錯誤

   ## CORS

   後端已設定 CORS，允許來自 `http://localhost:5173` 的請求。

   如果前端使用不同的 port，請修改 `backend/src/middleware/cors.js`。
   ```

3. 最終驗證清單：
   - [ ] 後端可以啟動且無錯誤
   - [ ] 前端可以啟動且無錯誤
   - [ ] PostgreSQL 連線正常
   - [ ] 可以新增 Todo
   - [ ] 可以切換完成狀態
   - [ ] 可以刪除 Todo
   - [ ] 重新整理後資料仍存在（PostgreSQL 持久化）
   - [ ] 可使用 Navicat 或 Prisma Studio 查看資料
   - [ ] README.md 清楚說明如何啟動與設定資料庫
   - [ ] API_DOCS.md 完整記錄所有 API

**完成後**：向使用者報告「🎉 專案完成！所有功能已實作並測試通過。資料已持久化到 PostgreSQL，可使用 Navicat 或 Prisma Studio 管理資料庫。」

---

## MCP 工具使用指南

### 何時使用 MCP 工具

1. **資料庫 MCP**（如果可用）：
   - 階段 1：連接 PostgreSQL，驗證資料表結構
   - 階段 3：插入測試資料、查詢驗證
   - 階段 7：最終資料驗證
   - 可執行 SQL 查詢：`SELECT * FROM "Todo"`

2. **瀏覽器 MCP**（cursor-ide-browser）：
   - 階段 6：自動化 UI 測試
   - 重要：必須遵循 lock/unlock 流程
   - 測試前先用 `browser_snapshot` 了解頁面結構

3. **API 測試 MCP**（如果可用）：
   - 階段 2：測試四支 API
   - 階段 7：最終整合測試

### MCP 使用範例

**資料庫 MCP（PostgreSQL）**：
```
1. 連接到 PostgreSQL（使用 .env 中的 DATABASE_URL）
2. 執行查詢：SELECT * FROM "Todo" ORDER BY "createdAt" DESC
3. 插入測試資料：INSERT INTO "Todo" (title, completed) VALUES ('測試', false)
4. 驗證資料結構：DESCRIBE "Todo" 或查看 schema
```

**瀏覽器測試流程**：
```
1. browser_tabs (action: "list") - 檢查現有分頁
2. browser_navigate (url: "http://localhost:5173") - 開啟前端
3. browser_lock - 鎖定分頁
4. browser_snapshot - 取得頁面結構
5. browser_fill - 填入資料
6. browser_click - 點擊按鈕
7. browser_wait (ms: 2000) - 等待更新
8. browser_snapshot - 驗證結果
9. browser_screenshot - 截圖
10. browser_unlock - 解鎖分頁
```

### 如果 MCP 不可用

- **資料庫**：
  - 使用 Navicat 連接 PostgreSQL 查看資料
  - 使用 `npx prisma studio` 開啟 Prisma 的 GUI
  - 使用 curl 測試 API
  
- **瀏覽器**：手動在瀏覽器測試

- **API 測試**：使用 curl 或 Postman

---

## 技術細節與最佳實踐

### 後端

1. **錯誤處理**：所有路由都要有 try-catch，使用 async/await
2. **輸入驗證**：檢查必要欄位、清理輸入（trim）
3. **HTTP 狀態碼**：正確使用 200、201、400、404、500
4. **Prisma 最佳實踐**：
   - Prisma 自動處理 SQL injection 防護
   - 使用型別安全的查詢（TypeScript 更佳）
   - 善用 Prisma 的關聯查詢功能
   - ID 轉換：`parseInt(id)` 確保型別正確
5. **資料庫連線**：Prisma Client 自動管理連線池，無需手動關閉

### 前端

1. **API 封裝**：統一在 `api/` 資料夾，方便維護
2. **錯誤處理**：所有 fetch 都要有 try-catch
3. **使用者體驗**：載入狀態、錯誤提示、確認對話框
4. **狀態管理**：API 成功後更新狀態，再重新渲染

### Prisma 相關

1. **Schema 設計**：
   - 使用有意義的 model 名稱（單數、PascalCase）
   - 適當設定 default 值
   - 使用 `@default(now())` 自動設定時間戳記

2. **Migration 管理**：
   - 每次 schema 變更都要建立 migration
   - Migration 名稱要有意義（如 `add_user_table`）
   - 開發環境用 `migrate dev`，正式環境用 `migrate deploy`

3. **查詢優化**：
   - 只查詢需要的欄位（使用 `select`）
   - 善用 `orderBy`、`where`、`take`、`skip` 等
   - 複雜查詢可使用 `$queryRaw`

### 程式碼品質

1. **命名**：使用有意義的變數名、函式名
2. **註解**：解釋「為什麼」而非「做什麼」
3. **模組化**：每個檔案單一職責
4. **一致性**：統一的程式碼風格

### 資料庫管理

1. **使用 Navicat**：視覺化查看資料、執行 SQL、匯出資料
2. **使用 Prisma Studio**：快速查看和編輯資料，適合開發時使用
3. **備份**：定期備份 PostgreSQL 資料庫

---

## 完成標準

當以下所有項目都達成時，專案即完成：

- [x] 後端四支 API 正常運作（使用 Prisma）
- [x] 前端 UI 美觀且功能完整
- [x] 資料持久化（存在 PostgreSQL）
- [x] PostgreSQL 連線正常
- [x] Prisma migrations 已執行
- [x] 可使用 Navicat 或 Prisma Studio 查看資料
- [x] 錯誤處理完善
- [x] 文件完整（README + API_DOCS）
- [x] 所有功能經過測試

---

## 開始執行

現在請按照以上階段，從「階段 1：後端基礎建設」開始執行。

每完成一個階段後：
1. 報告完成的內容
2. 展示驗證結果
3. 詢問使用者：「階段 X 已完成，是否繼續下一階段？」

祝你建置順利！🚀
