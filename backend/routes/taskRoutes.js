import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks
} from '../controllers/taskController.js';
import { validateCreateTask, validateUpdateTask } from '../middleware/validateTask.js';

const router = express.Router();

// Get all tasks with optional filters
router.get('/', getTasks);

// Search tasks
router.get('/search', searchTasks);

// Get single task by ID
router.get('/:id', getTaskById);

// Create new task
router.post('/', validateCreateTask, createTask);

// Update task (partial updates allowed)
router.put('/:id', validateUpdateTask, updateTask);

// Delete task
router.delete('/:id', deleteTask);

export default router;

