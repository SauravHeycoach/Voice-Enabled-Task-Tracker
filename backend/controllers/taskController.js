import Task from '../models/Task.js';

// Get all tasks with optional filters
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;

    const tasks = await Task.findAll(filters);
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// Get single task by ID
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Create new task
export const createTask = async (req, res, next) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'To Do',
      priority: req.body.priority || 'Medium',
      dueDate: req.body.dueDate || null
    };

    const task = await Task.create(taskData);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.update(req.params.id, req.body);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.delete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Search tasks by title or description
export const searchTasks = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const tasks = await Task.search(q.trim());

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

