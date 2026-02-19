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
