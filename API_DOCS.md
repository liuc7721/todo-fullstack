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
      "completed": false,
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "title": "寫程式",
      "completed": true,
      "createdAt": "2024-01-01T13:00:00.000Z"
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
    "completed": false,
    "createdAt": "2024-01-01T14:00:00.000Z"
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
    "completed": true,
    "createdAt": "2024-01-01T12:00:00.000Z"
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
