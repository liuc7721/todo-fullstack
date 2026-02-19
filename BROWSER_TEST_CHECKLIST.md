# Todo 應用 - 瀏覽器手動測試清單

> cursor-ide-browser MCP 工具目前無法使用，請依此清單手動驗證功能。

## 前置條件

- [ ] 後端已啟動：`cd backend && npm start`（http://localhost:3000）
- [ ] 前端已啟動：`cd frontend && npm run dev`（http://localhost:5173）

## 測試步驟

### 1. 頁面載入
- [ ] 開啟 http://localhost:5173
- [ ] 確認標題「📝 我的待辦清單」顯示
- [ ] 確認輸入框與「新增」按鈕存在
- [ ] 確認現有 Todo 項目顯示（若有 5 筆測試資料應全部顯示）

### 2. 新增待辦
- [ ] 在輸入框輸入「自動測試項目」
- [ ] 點擊「新增」按鈕
- [ ] 確認新項目出現在列表中
- [ ] 按 Enter 鍵也可新增（輸入後按 Enter）

### 3. 切換完成狀態
- [ ] 點擊某個 Todo 的勾選框
- [ ] 確認該項目顯示刪除線、變灰
- [ ] 再次點擊勾選框或標題，確認可取消完成狀態

### 4. 刪除待辦
- [ ] 點擊某個 Todo 的「刪除」按鈕
- [ ] 確認出現「確定要刪除這個待辦事項嗎？」對話框
- [ ] 點擊「確定」，確認項目從列表消失
- [ ] （可選）點擊「取消」，確認項目保留

### 5. 資料持久化
- [ ] 重新整理頁面（F5）
- [ ] 確認 Todo 列表資料仍存在（來自 PostgreSQL）

### 6. 錯誤處理
- [ ] 嘗試新增空字串，確認顯示錯誤提示
- [ ] 停止後端後重新載入頁面，確認顯示連線錯誤

## 啟用 MCP 瀏覽器工具（cursor-ide-browser）

**cursor-ide-browser** 是 Cursor 的 MCP（Model Context Protocol）伺服器，可讓 AI Agent 透過工具自動操作瀏覽器，例如：
- `browser_navigate`：導航到指定 URL
- `browser_snapshot`：取得頁面結構與元素 ref
- `browser_fill` / `browser_click`：填寫表單、點擊按鈕
- `browser_take_screenshot`：截圖驗證

**啟用步驟**：
1. 開啟 Cursor 設定 → MCP
2. 確認 **cursor-ide-browser** 已啟用
3. 重新啟動 Cursor 或重新載入 MCP 設定

啟用後，Agent 即可使用上述工具進行前端自動化測試。
