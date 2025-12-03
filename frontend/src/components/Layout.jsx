import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import TaskModal from './TaskModal';
import VoiceInputModal from './VoiceInputModal';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleTaskCreated = () => {
    setShowTaskModal(false);
    setShowVoiceModal(false);
    setEditingTask(null);
    window.location.reload();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-primary-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Voice Task Tracker
              </h1>
              <nav className="flex space-x-2">
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    location.pathname === '/'
                      ? 'bg-primary-100 text-primary-800 shadow-sm'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  Kanban Board
                </Link>
                <Link
                  to="/list"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    location.pathname === '/list'
                      ? 'bg-primary-100 text-primary-800 shadow-sm'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  List View
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowVoiceModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-primary-200 text-sm font-medium rounded-full text-primary-700 bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                Voice Input
              </button>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Modals */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={handleTaskCreated}
        />
      )}

      {showVoiceModal && (
        <VoiceInputModal
          onClose={() => setShowVoiceModal(false)}
          onSave={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default Layout;

