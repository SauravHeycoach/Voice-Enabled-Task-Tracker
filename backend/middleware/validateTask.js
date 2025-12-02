import { body, validationResult } from 'express-validator';

// Validation for creating a task (full payload, title required)
export const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done']).withMessage('Status must be one of: To Do, In Progress, Done'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Priority must be one of: Low, Medium, High, Critical'),
  
  body('dueDate')
    .optional()
    .custom((value) => {
      if (value === null || value === '') return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }).withMessage('Invalid date format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }
    next();
  }
];

// Validation for updating a task (partial updates allowed)
export const validateUpdateTask = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done']).withMessage('Status must be one of: To Do, In Progress, Done'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Priority must be one of: Low, Medium, High, Critical'),
  
  body('dueDate')
    .optional()
    .custom((value) => {
      if (value === null || value === '') return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }).withMessage('Invalid date format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }
    next();
  }
];

