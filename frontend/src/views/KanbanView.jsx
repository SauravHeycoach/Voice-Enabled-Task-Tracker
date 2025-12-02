import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { taskAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/FilterBar';

const ColumnDroppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
};

const KanbanView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filters, setFilters] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (filters.searchResults) {
      setTasks(filters.searchResults);
    } else {
      loadTasks();
    }
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskAPI.getAll(filters);
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const taskId = active.id;
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    let newStatus = null;

    // If dropped on a task
    const overTask = tasks.find(t => t._id === over.id);
    if (overTask) newStatus = overTask.status;

    // If dropped into column droppable area
    if (['To Do', 'In Progress', 'Done'].includes(over.id)) {
      newStatus = over.id;
    }

    if (!newStatus || newStatus === task.status) return;

    // ⭐ IMPORTANT: Update UI immediately BEFORE backend call
    setTasks(prev =>
      prev.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await taskAPI.update(taskId, { status: newStatus });
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      await taskAPI.delete(task._id);
      loadTasks();
    }
  };

  const handleTaskSaved = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    loadTasks();
  };

  const columns = ['To Do', 'In Progress', 'Done'];
  const tasksByStatus = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done')
  };

  const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>;
  }

  return (
    <div>
      <FilterBar onFilterChange={setFilters} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {columns.map((status) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
              
              <ColumnDroppable id={status}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">{status}</h2>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {tasksByStatus[status].length}
                  </span>
                </div>

                <SortableContext
                  items={tasksByStatus[status].map(t => t._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {tasksByStatus[status].map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </ColumnDroppable>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white rounded-lg shadow-lg border p-4 opacity-90">
              <h3 className="font-semibold">{activeTask.title}</h3>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={handleTaskSaved}
        />
      )}
    </div>
  );
};

export default KanbanView;
