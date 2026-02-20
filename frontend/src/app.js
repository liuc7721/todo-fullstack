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
    const response = await createTodo(title);
    todoInput.value = '';
    
    // 直接將新 todo 加入本地陣列並重新渲染，不需要重新載入整個列表
    todos.unshift(response.data); // unshift 加到最前面（最新的在最上面）
    renderTodoList(todos, handleToggleTodo, handleDeleteTodo);
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
    const response = await updateTodo(id, { completed });
    
    // 直接更新本地陣列中的 todo 並重新渲染，不需要重新載入整個列表
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index] = response.data;
      renderTodoList(todos, handleToggleTodo, handleDeleteTodo);
    }
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
    
    // 直接從本地陣列移除並重新渲染，不需要重新載入整個列表
    todos = todos.filter(todo => todo.id !== id);
    renderTodoList(todos, handleToggleTodo, handleDeleteTodo);
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
