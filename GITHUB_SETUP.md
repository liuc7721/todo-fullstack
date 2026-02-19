# GitHub 設定指南

## 步驟 1：在 GitHub 建立 Repository

1. 登入 GitHub：https://github.com
2. 點擊右上角的 **+** → **New repository**
3. 填寫資訊：
   - **Repository name**：`todo-fullstack`（或你喜歡的名稱）
   - **Description**：`Todo 全端應用 - Node.js + Express + PostgreSQL + Prisma + Vite`
   - **Visibility**：選擇 Public 或 Private
   - **不要**勾選 "Initialize this repository with a README"（我們已經有檔案了）
4. 點擊 **Create repository**

## 步驟 2：連接本地 Repository 到 GitHub

GitHub 會顯示指令，執行以下命令（**請將 `<YOUR_USERNAME>` 和 `<REPO_NAME>` 替換為你的實際值**）：

```bash
# 新增遠端 repository（請替換為你的 GitHub repository URL）
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git

# 或使用 SSH（如果你有設定 SSH key）
# git remote add origin git@github.com:<YOUR_USERNAME>/<REPO_NAME>.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 步驟 3：驗證

1. 重新整理 GitHub 頁面
2. 確認所有檔案都已上傳
3. 確認 README.md 正確顯示

## 後續操作

### 推送更新

```bash
git add .
git commit -m "描述你的更改"
git push
```

### 拉取更新

```bash
git pull
```

### 查看遠端設定

```bash
git remote -v
```

## 注意事項

⚠️ **重要**：`.env` 檔案已加入 `.gitignore`，**不會**被推送到 GitHub，這是正確的！

如果團隊成員需要環境變數，請：
1. 建立 `backend/.env.example` 範例檔案
2. 在 README.md 中說明如何設定環境變數

## 建立 .env.example（選用）

如果要在 GitHub 上提供環境變數範例：

```bash
# 在 backend/ 目錄建立 .env.example
echo 'DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"' > backend/.env.example
git add backend/.env.example
git commit -m "Add .env.example template"
git push
```
