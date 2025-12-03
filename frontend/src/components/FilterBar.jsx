import { useState } from 'react';
import { taskAPI } from '../services/api';

const FilterBar = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    onFilterChange({
      status: value || undefined,
      priority: priorityFilter || undefined
    });
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setPriorityFilter(value);
    onFilterChange({
      status: statusFilter || undefined,
      priority: value || undefined
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      onFilterChange({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined
      });
      return;
    }

    try {
      const results = await taskAPI.search(searchQuery);
      setSearchResults(results);
      onFilterChange({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        searchResults: results
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setSearchQuery('');
    setSearchResults(null);
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-400 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Priority
          </label>
          <select
            value={priorityFilter}
            onChange={handlePriorityChange}
            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Search + Clear: stay in one row on md+, shrink responsively, wrap only when very small */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search & Actions
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
            <form
              onSubmit={handleSearch}
              className="flex flex-1 min-w-0"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="flex-1 min-w-0 px-2 sm:px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-gray-500 whitespace-nowrap text-xs sm:text-sm"
              >
                Search
              </button>
            </form>

            <button
              onClick={clearFilters}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 whitespace-nowrap text-xs sm:text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {(statusFilter || priorityFilter || searchQuery) && (
        <div className="mt-4 text-sm text-gray-600">
          Active filters: {statusFilter && `Status: ${statusFilter}`}
          {priorityFilter && ` Priority: ${priorityFilter}`}
          {searchQuery && ` Search: "${searchQuery}"`}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

