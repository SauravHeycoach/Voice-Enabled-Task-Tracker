# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ PostgreSQL installed and running (`psql --version` should work)
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE voice_task_tracker;

# Exit
\q
```

### 3. Configure Backend Environment
Create `backend/.env` file with:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/voice_task_tracker
GROQ_API_KEY=your_key_here  # Optional but recommended (FREE!)
FRONTEND_URL=http://localhost:5173
```

**Note**: Replace `postgres` and `password` with your PostgreSQL username and password.

### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 5. Start PostgreSQL (if not already running)
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows (run as administrator)
net start postgresql-x64-XX  # Replace XX with your version number
```

### 6. Start Backend Server
```bash
cd backend
npm run dev
```
Server should start on http://localhost:5000

### 7. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```
Frontend should start on http://localhost:5173

### 8. Open Application
Navigate to: http://localhost:5173

## Testing Voice Input

1. Click "Voice Input" button
2. Allow microphone access when prompted
3. Click "Start Recording"
4. Say: "Create a high priority task to review the pull request by tomorrow evening"
5. Click "Stop & Parse"
6. Review and edit parsed data
7. Click "Create Task"

## Troubleshooting

**PostgreSQL not connecting?**
- Check if PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
- Verify DATABASE_URL in `.env` (format: `postgresql://user:password@host:port/database`)
- Ensure database exists: `psql -U postgres -l | grep voice_task_tracker`
- Check PostgreSQL is listening on port 5432

**Voice input not working?**
- Use Chrome, Edge, or Safari
- Check browser microphone permissions
- Allow microphone access when prompted

**CORS errors?**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL

**Groq parsing errors?**
- Check API key is correct
- Verify account status at https://console.groq.com
- App will fallback to rule-based parsing if API fails
- Groq is free but check rate limits

