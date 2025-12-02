import pool from '../config/database.js';

class Task {
  // Get all tasks with optional filters
  static async findAll(filters = {}) {
    const { status, priority, sortBy = 'created_at', sortOrder = 'desc' } = filters;
    
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (priority) {
      paramCount++;
      query += ` AND priority = $${paramCount}`;
      params.push(priority);
    }

    // Validate sortBy to prevent SQL injection
    const validSortColumns = ['created_at', 'updated_at', 'due_date', 'title', 'priority', 'status'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortColumn} ${sortDirection}`;

    const result = await pool.query(query, params);
    return result.rows.map(this.mapRowToTask);
  }

  // Get task by ID
  static async findById(id) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRowToTask(result.rows[0]);
  }

  // Create new task
  static async create(taskData) {
    const { title, description = '', status = 'To Do', priority = 'Medium', dueDate = null } = taskData;
    
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, status, priority, dueDate]
    );

    return this.mapRowToTask(result.rows[0]);
  }

  // Update task
  static async update(id, taskData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
    
    for (const [key, value] of Object.entries(taskData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        paramCount++;
        const dbField = key === 'dueDate' ? 'due_date' : key;
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      // No fields to update, just return the existing task
      return await this.findById(id);
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToTask(result.rows[0]);
  }

  // Delete task
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToTask(result.rows[0]);
  }

  // Search tasks by title or description
  static async search(query) {
    const searchTerm = `%${query}%`;
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE title ILIKE $1 OR description ILIKE $1
       ORDER BY created_at DESC`,
      [searchTerm]
    );

    return result.rows.map(this.mapRowToTask);
  }

  // Map database row to task object (convert snake_case to camelCase)
  static mapRowToTask(row) {
    return {
      _id: row.id.toString(),
      id: row.id,
      title: row.title,
      description: row.description || '',
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date ? new Date(row.due_date).toISOString() : null,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  }
}

export default Task;
