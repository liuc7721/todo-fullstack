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

    // 優化：直接更新，如果不存在會拋錯，用 try-catch 處理
    // 這樣可以減少一次資料庫查詢（從 2 次減少到 1 次）
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    // Prisma 會在找不到記錄時拋出 P2025 錯誤
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: '找不到該待辦事項' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/todos/:id - 刪除待辦
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 優化：直接刪除，如果不存在會拋錯，用 try-catch 處理
    // 這樣可以減少一次資料庫查詢（從 2 次減少到 1 次）
    await prisma.todo.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, data: { id: parseInt(id) } });
  } catch (error) {
    // Prisma 會在找不到記錄時拋出 P2025 錯誤
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: '找不到該待辦事項' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
