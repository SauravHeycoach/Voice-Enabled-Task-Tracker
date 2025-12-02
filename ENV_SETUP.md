# Environment Variables Setup Guide

This guide explains all environment variables needed for the Voice Task Tracker application.

## 📁 Backend Environment Variables

Create a file named `.env` in the `backend/` directory with the following variables:

### Required Variables

#### `DATABASE_URL`
- **Description**: PostgreSQL database connection string
- **Format**: `postgresql://username:password@host:port/database_name`
- **Example**: `postgresql://postgres:postgres@localhost:5432/voice_task_tracker`
- **How to get**: 
  - Replace `postgres` with your PostgreSQL username
  - Replace `postgres` (password) with your PostgreSQL password
  - Replace `localhost:5432` if your PostgreSQL runs on different host/port
  - Replace `voice_task_tracker` with your database name

#### `PORT`
- **Description**: Port number for the backend server
- **Default**: `5000`
- **Example**: `5000`

#### `NODE_ENV`
- **Description**: Environment mode (development or production)
- **Default**: `development`
- **Example**: `development`

#### `FRONTEND_URL`
- **Description**: URL where the React frontend is running (for CORS)
- **Default**: `http://localhost:5173`
- **Example**: `http://localhost:5173`
- **Note**: Must match the URL where your frontend runs

### Optional Variables

#### `GROQ_API_KEY`
- **Description**: Groq API key for intelligent voice parsing (FREE!)
- **Required**: No (app will use fallback parsing if not provided)
- **How to get**: 
  1. Go to https://console.groq.com/keys
  2. Sign up or log in (FREE account)
  3. Create a new API key
  4. Copy and paste it here
- **Example**: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Note**: Groq offers free, fast inference with open-source models like Llama 3.3 70B

---

## 📁 Frontend Environment Variables

Create a file named `.env` in the `frontend/` directory with the following variables:

### Optional Variables

#### `VITE_API_URL`
- **Description**: Backend API base URL
- **Default**: `http://localhost:5000/api` (if not set)
- **When to change**: 
  - If your backend runs on a different port
  - If your backend is hosted on a different server
- **Example**: `http://localhost:5000/api`
- **Production Example**: `https://api.yourdomain.com/api`

---

## 🚀 Quick Setup

### Backend `.env` File

1. Navigate to the `backend/` directory
2. Copy the example file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and update these values:
   ```env
   DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/voice_task_tracker
   GROQ_API_KEY=your_actual_groq_key_here
   ```

### Frontend `.env` File

1. Navigate to the `frontend/` directory
2. Copy the example file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` if your backend runs on a different URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 📝 Example Configuration Files

### Backend `.env` (Development)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:myPassword123@localhost:5432/voice_task_tracker
GROQ_API_KEY=gsk_abc123def456ghi789
FRONTEND_URL=http://localhost:5173
```

### Backend `.env` (Production)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:secure_password@db.example.com:5432/voice_task_tracker
GROQ_API_KEY=gsk_production-key-here
FRONTEND_URL=https://yourdomain.com
```

### Frontend `.env` (Development)
```env
VITE_API_URL=http://localhost:5000/api
```

### Frontend `.env` (Production)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🔒 Security Notes

1. **Never commit `.env` files to Git** - They contain sensitive information
2. **Use different keys for development and production**
3. **Keep your Groq API key secret** - Don't share it publicly
4. **Use strong database passwords** in production
5. **The `.env.example` files are safe to commit** - They don't contain real values

---

## 🐛 Troubleshooting

### Backend can't connect to PostgreSQL
- Check `DATABASE_URL` format is correct
- Verify PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
- Ensure database exists: `psql -U postgres -l | grep voice_task_tracker`
- Check username and password are correct

### CORS errors
- Verify `FRONTEND_URL` in backend `.env` matches where frontend runs
- Check for typos in the URL (http vs https, port numbers)

### Frontend can't reach backend
- Verify `VITE_API_URL` in frontend `.env` is correct
- Check backend is running on the specified port
- Ensure no firewall is blocking the connection

### Groq parsing not working
- Verify `GROQ_API_KEY` is set correctly
- Check API key is valid at https://console.groq.com
- App will use fallback parsing if API key is missing/invalid
- Groq is free but check rate limits if you encounter issues

---

## 📚 Additional Resources

- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [Groq API Keys](https://console.groq.com/keys)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

