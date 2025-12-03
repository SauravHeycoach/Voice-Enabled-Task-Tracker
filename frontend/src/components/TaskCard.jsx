import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-300';
      case 'High':
        return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-300';
      case 'Medium':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-300';
      case 'Low':
        return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-300';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical':
        return '🔥';
      case 'High':
        return '⚡';
      case 'Medium':
        return '📌';
      case 'Low':
        return '⬇️';
      default:
        return '📋';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return '✓';
      case 'In Progress':
        return '⟳';
      case 'To Do':
        return '○';
      default:
        return '•';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-white/95 backdrop-blur rounded-2xl shadow-sm border border-gray-400 p-3 mb-3 cursor-move hover:shadow-lg hover:-translate-y-1 hover:border-primary-400 transition-all duration-200 relative overflow-hidden"
    >
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-purple-50/0 group-hover:from-primary-50/30 group-hover:to-purple-50/20 transition-all duration-200 rounded-2xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header with title and actions */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-primary-700 transition-colors ">
              {task.title}
            </h3>
            {/* Status indicator */}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
              <span className="text-primary-500">{getStatusIcon(task.status)}</span>
              {task.status}
            </span>
          </div>
          <div className="flex space-x-1.5 shrink-0">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all transform hover:scale-110"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all transform hover:scale-110"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Footer with priority and due date */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getPriorityColor(task.priority)}`}>
            <span className="text-base">{getPriorityIcon(task.priority)}</span>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-400">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

