export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // PostgreSQL errors
  if (err.code) {
    // Unique constraint violation
    if (err.code === '23505') {
      return res.status(400).json({
        error: 'Duplicate entry',
        message: err.detail || 'This record already exists'
      });
    }

    // Foreign key constraint violation
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'Foreign key constraint violation',
        message: err.detail || 'Referenced record does not exist'
      });
    }

    // Check constraint violation
    if (err.code === '23514') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.detail || 'Invalid value for field'
      });
    }

    // Invalid input syntax
    if (err.code === '22P02') {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }
  }

  // Custom error with status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details || null
    });
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

