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
