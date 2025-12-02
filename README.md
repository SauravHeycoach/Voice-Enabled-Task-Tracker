# Voice-Enabled Task Tracker

A modern task tracking application with intelligent voice input capabilities. Create, manage, and organize tasks using natural language voice commands or traditional form inputs. Built with React, Node.js, Express, and PostgreSQL.

## 🎯 Features

### Core Functionality
- **Task Management**: Create, read, update, and delete tasks
- **Dual View Modes**: 
  - Kanban board view with drag-and-drop functionality
  - List view with detailed table layout
- **Smart Filtering**: Filter tasks by status, priority, or search by title/description
- **Task Properties**: Title, description, status (To Do, In Progress, Done), priority (Low, Medium, High, Critical), and due dates

### Voice Input Feature (Key Differentiator)
- **Speech-to-Text**: Record voice input using browser's Web Speech API
- **Intelligent Parsing**: AI-powered extraction of task details from natural language
  - Automatically extracts task title
  - Identifies priority keywords (urgent, high priority, critical, etc.)
  - Parses relative dates (tomorrow, next Monday, in 3 days) and absolute dates
  - Sets default status to "To Do" unless specified
- **Review & Edit**: Preview parsed data before saving with ability to correct any fields
- **Graceful Fallback**: Rule-based parsing when AI service is unavailable

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Drag-and-drop library for Kanban board
- **Axios** - HTTP client
- **date-fns** - Date formatting utilities
- **Web Speech API** - Browser-based speech recognition

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **pg** (node-postgres) - PostgreSQL client for Node.js
- **Groq API** - Fast, free natural language processing for voice parsing
- **express-validator** - Input validation middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Groq API Key** (optional but recommended for best parsing results) - [Get API Key](https://console.groq.com/keys) - FREE!

## 🚀 Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd voice-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file and add your configuration
# Required: DATABASE_URL (PostgreSQL connection string)
# Optional but recommended: GROQ_API_KEY (FREE API key from Groq)
```

**Backend Environment Variables** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voice_task_tracker
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:5173
```

**Important**: 
- Replace `postgres:postgres` with your actual PostgreSQL username and password
- Replace `voice_task_tracker` with your database name if different
- `GROQ_API_KEY` is optional but recommended for best voice parsing results (FREE API key available)

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example (optional)
cp .env.example .env
```

**Frontend Environment Variables** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: This is optional. If not set, it defaults to `http://localhost:5000/api`

### 4. Set Up PostgreSQL Database

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE voice_task_tracker;

# Create user (optional, you can use default postgres user)
CREATE USER voice_tracker_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE voice_task_tracker TO voice_tracker_user;

# Exit psql
\q
```

The database schema will be automatically created when you start the server for the first time.

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Tasks

##### Get All Tasks
```
GET /tasks
```

**Query Parameters:**
- `status` (optional): Filter by status (To Do, In Progress, Done)
- `priority` (optional): Filter by priority (Low, Medium, High, Critical)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)

**Example Request:**
```bash
GET /api/tasks?status=To Do&priority=High&sortBy=dueDate&sortOrder=asc
```

**Example Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Review pull request",
      "description": "Review the authentication module PR",
      "status": "To Do",
      "priority": "High",
      "dueDate": "2024-01-15T18:00:00.000Z",
      "createdAt": "2024-01-14T10:00:00.000Z",
      "updatedAt": "2024-01-14T10:00:00.000Z"
    }
  ]
}
```

##### Get Task by ID
```
GET /tasks/:id
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Review pull request",
    "description": "Review the authentication module PR",
    "status": "To Do",
    "priority": "High",
    "dueDate": "2024-01-15T18:00:00.000Z",
    "createdAt": "2024-01-14T10:00:00.000Z",
    "updatedAt": "2024-01-14T10:00:00.000Z"
  }
}
```

##### Create Task
```
POST /tasks
```

**Request Body:**
```json
{
  "title": "Review pull request",
  "description": "Review the authentication module PR",
  "status": "To Do",
  "priority": "High",
  "dueDate": "2024-01-15T18:00:00.000Z"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Review pull request",
    "description": "Review the authentication module PR",
    "status": "To Do",
    "priority": "High",
    "dueDate": "2024-01-15T18:00:00.000Z",
    "createdAt": "2024-01-14T10:00:00.000Z",
    "updatedAt": "2024-01-14T10:00:00.000Z"
  }
}
```

##### Update Task
```
PUT /tasks/:id
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "status": "In Progress",
  "priority": "Critical"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Updated title",
    "status": "In Progress",
    "priority": "Critical",
    "updatedAt": "2024-01-14T11:00:00.000Z"
  }
}
```

##### Delete Task
```
DELETE /tasks/:id
```

**Example Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Review pull request"
  }
}
```

##### Search Tasks
```
GET /tasks/search?q=query
```

**Query Parameters:**
- `q` (required): Search query string

**Example Request:**
```bash
GET /api/tasks/search?q=authentication
```

**Example Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Review authentication module",
      "description": "Review the authentication module PR",
      "status": "To Do",
      "priority": "High"
    }
  ]
}
```

#### Voice Parsing

##### Parse Voice Transcript
```
POST /voice/parse
```

**Request Body:**
```json
{
  "transcript": "Create a high priority task to review the pull request for the authentication module by tomorrow evening"
}
```

**Example Response:**
```json
{
  "success": true,
  "transcript": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
  "parsed": {
    "title": "Review the pull request for the authentication module",
    "description": "",
    "priority": "High",
    "dueDate": "2024-01-15T18:00:00.000Z",
    "status": "To Do"
  }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation Error",
  "details": [
    {
      "msg": "Title is required",
      "param": "title"
    }
  ]
}
```

**404 Not Found:**
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "Error details (only in development)"
}
```

## 🎨 User Flows

### Flow 1: Manual Task Creation
1. Click "Add Task" button in the header
2. Fill in the form fields (title, description, status, priority, due date)
3. Click "Create Task"
4. Task appears in the appropriate column/view

### Flow 2: Voice Task Creation
1. Click "Voice Input" button (microphone icon)
2. Click "Start Recording"
3. Speak your task: *"Remind me to send the project proposal to the client by next Wednesday, it's high priority"*
4. Click "Stop & Parse"
5. Review the parsed data in the preview modal
6. Edit any fields if needed
7. Click "Create Task"
8. Task is saved and appears on the board

### Flow 3: Task Update
1. Click on a task card (or "Edit" button in list view)
2. Modify fields in the edit modal
3. Click "Update Task"
4. Task updates in real-time

### Flow 4: Drag-and-Drop (Kanban View)
1. Drag a task card from one column to another
2. Task status automatically updates
3. Card appears in the new column

## 🏗️ Project Structure

```
voice-tracker/
├── backend/
│   ├── controllers/
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validateTask.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   ├── taskRoutes.js
│   │   └── voiceRoutes.js
│   ├── services/
│   │   └── voiceParser.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── VoiceInputModal.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── views/
│   │   │   ├── KanbanView.jsx
│   │   │   └── ListView.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🔧 Key Design Decisions

### 1. Database Choice: PostgreSQL
- **Reason**: Robust relational database with ACID compliance, excellent for structured data, strong query capabilities
- **Alternative Considered**: MongoDB (chose PostgreSQL for better data integrity and relational capabilities)

### 2. Voice Parsing: Enhanced Rule-Based (Default) with Optional Groq
- **Default**: Enhanced rule-based parsing (FREE, no API key needed)
- **Optional**: Groq API with Llama 3.3 70B for advanced parsing (FREE API key available)
- **Reason**: Fully functional without any paid services. Groq offers fast, free inference with open-source models

### 2. Database Schema
- **Approach**: SQL schema with proper constraints, indexes, and triggers
- **Features**: Automatic timestamp updates, full-text search indexes, data validation at database level

### 3. Frontend State Management
- **Approach**: Local component state with React hooks
- **Reason**: No need for Redux for single-user application. State is manageable with useState/useEffect

### 4. Database Connection: Connection Pooling
- **Approach**: PostgreSQL connection pooling with pg library
- **Reason**: Efficient resource management, handles concurrent requests

### 5. Drag-and-Drop: @dnd-kit
- **Reason**: Modern, accessible, and performant drag-and-drop library
- **Alternative Considered**: react-beautiful-dnd (chose @dnd-kit for better React 18 support)

### 6. Styling: Tailwind CSS
- **Reason**: Rapid development, consistent design system, no CSS conflicts
- **Alternative Considered**: CSS Modules, styled-components (chose Tailwind for utility-first approach)

### 7. Speech Recognition: Web Speech API
- **Reason**: No external service required, works in modern browsers
- **Limitation**: Browser-specific (Chrome, Edge, Safari support)

## 📝 Assumptions

1. **Single User**: Application is designed for single-user use (no authentication)
2. **Browser Support**: Voice input requires Chrome, Edge, or Safari (Web Speech API)
3. **PostgreSQL Local**: Default setup assumes local PostgreSQL instance
4. **Database Auto-Init**: Database schema is automatically created on first server start
5. **Groq API**: Optional but recommended for best parsing accuracy (FREE API key available)
6. **Network**: Frontend and backend run on same machine during development
7. **Date Format**: ISO 8601 format for dates (handled automatically)
8. **Task Limits**: 
   - Title: 200 characters max
   - Description: TEXT field (unlimited, but frontend limits to 1000)

## 🤖 AI Tools Usage

### Tools Used
- **Cursor AI** - Primary development assistant
- **ChatGPT** - Code review and debugging assistance

### What AI Helped With
1. **Boilerplate Code**: Generated initial project structure and configuration files
2. **Voice Parsing Logic**: Designed the prompt engineering for Groq API to extract structured data
3. **Date Parsing**: Implemented fallback date parsing logic for relative dates
4. **Error Handling**: Structured error handling patterns across the application
5. **Component Architecture**: Designed reusable React component structure
6. **API Design**: RESTful endpoint structure and validation patterns

### Notable Prompts/Approaches
- **Voice Parsing Prompt**: Carefully crafted system and user prompts to ensure Groq returns valid JSON with specific structure
- **Error Handling**: Asked AI to review error handling patterns for production readiness
- **Component Design**: Requested modular, reusable component structure

### Learnings & Changes
1. **Fallback Parsing**: Initially planned to use only AI, but added rule-based fallback for reliability
2. **Date Handling**: Learned to handle both relative and absolute dates, including time specifications
3. **Browser Compatibility**: Discovered Web Speech API limitations and added proper error messages
4. **State Management**: Simplified from Redux to local state after realizing complexity wasn't needed

## 🐛 Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If connection fails, start PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: net start postgresql-x64-XX (version number)

# Verify database exists
psql -U postgres -l | grep voice_task_tracker

# If database doesn't exist, create it
psql -U postgres -c "CREATE DATABASE voice_task_tracker;"
```

### Voice Input Not Working
- Ensure you're using Chrome, Edge, or Safari
- Check microphone permissions in browser settings
- Try refreshing the page and allowing microphone access

### Groq Parsing Errors
- Verify your API key is correct in `backend/.env`
- Check your Groq account status at https://console.groq.com
- Application will fall back to rule-based parsing if API fails
- Groq API is free, but check rate limits if you encounter issues

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default: `http://localhost:5173`

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

Built as a demonstration project showcasing modern full-stack development with AI integration.

---

**Note**: This application is designed for single-user use. For production deployment with multiple users, add authentication and user management features.

