import { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

interface TodoListProps {
  todos: Todo[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onTodoSelect: (todo: Todo) => void;
  selectedTodoId?: string;
  isLoading?: boolean;
  searchQuery?: string;
}

export default function TodoList({
  todos,
  pagination,
  onPageChange,
  onTodoSelect,
  selectedTodoId,
  isLoading = false,
  searchQuery = '',
}: TodoListProps) {
  // Memoize the getPlainText function
  const getPlainText = useCallback((html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }, []);

  // Memoize the formatted todos
  const formattedTodos = useMemo(() => 
    todos.map(todo => ({
      ...todo,
      plainDescription: getPlainText(todo.description),
      formattedDate: format(new Date(todo.date), 'MMM d, yyyy')
    }))
  , [todos, getPlainText]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-md mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {searchQuery ? (
          <>
            <p className="text-lg">No todos found matching "{searchQuery}"</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </>
        ) : (
          <>
            <p className="text-lg">No todos found</p>
            <p className="text-sm mt-2">Create a new todo to get started</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {searchQuery && (
        <div className="p-2 bg-blue-50 text-blue-700 text-xs border-b border-blue-100">
          Showing results for: "{searchQuery}"
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {formattedTodos.map((todo) => {
          const isSelected = todo._id === selectedTodoId;

          return (
            <div
              key={todo._id}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-white border border-gray-200 shadow-md rounded-md mx-4 my-2' 
                  : 'bg-white shadow-sm hover:shadow rounded-md mx-4 my-2 hover:bg-gray-50'
              }`}
              onClick={() => onTodoSelect(todo)}
            >
              <h3 className="font-medium text-gray-900 text-base mb-1 line-clamp-1">{todo.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1 mb-1">
                {todo.plainDescription}
              </p>
              <div className="text-xs text-gray-400">
                {todo.formattedDate}
              </div>
            </div>
          );
        })}

        {pagination.pages > 1 && (
          <div className="py-3 px-4 flex justify-between text-sm">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 