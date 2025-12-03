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
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Status
            </span>
          </label>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 text-sm font-medium text-gray-700 transition-all hover:border-primary-300 cursor-pointer shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Priority
            </span>
          </label>
          <select
            value={priorityFilter}
            onChange={handlePriorityChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 text-sm font-medium text-gray-700 transition-all hover:border-primary-300 cursor-pointer shadow-sm"
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
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search & Actions
            </span>
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
                placeholder="Search tasks..."
                className="flex-1 min-w-0 px-4 py-2.5 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 text-sm transition-all hover:border-primary-300 shadow-sm placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-r-xl hover:from-primary-600 hover:to-purple-600 whitespace-nowrap text-sm font-semibold shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02]"
              >
                Search
              </button>
            </form>

            <button
              onClick={clearFilters}
              className="px-4 sm:px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 whitespace-nowrap text-sm font-semibold transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {(statusFilter || priorityFilter || searchQuery) && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Filters:</span>
            {statusFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {statusFilter}
              </span>
            )}
            {priorityFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {priorityFilter}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                "{searchQuery}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

