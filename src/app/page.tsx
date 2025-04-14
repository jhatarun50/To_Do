'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TodoList from '@/components/TodoList';
import TodoDetail from '@/components/TodoDetail';
import Header from '@/components/Header';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

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

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTodos(1);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchTodos = async (page: number = 1, search: string = searchQuery) => {
    if (page === 1) {
      setIsLoading(true);
      if (search) {
        setIsSearching(true);
      }
    }
    setError('');
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (search) {
        query.append('search', search);
      }
      
      const response = await fetch(`/api/todos?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data.todos);
      setPagination(data.pagination);

      // Show search results message
      if (search && page === 1) {
        if (data.todos.length === 0) {
          toast.error(`No results found for "${search}"`);
        } else {
          toast.success(`Found ${data.pagination.total} results for "${search}"`);
        }
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please try again.');
      toast.error('Failed to load todos');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchTodos(1, searchQuery.trim());
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible && !searchQuery) {
      // If closing search with empty query, refresh todos
      fetchTodos(1, '');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchTodos(1, '');
    setIsSearchVisible(false);
  };

  const handleCreateTodo = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const defaultDate = new Date();
      defaultDate.setMinutes(defaultDate.getMinutes() + 30);
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Additions',
          description: '<p>To stay representative of framework & new example apps.</p>',
          date: defaultDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setSelectedTodo(newTodo);
      toast.success('Todo created successfully');
    } catch (error) {
      console.error('Error creating todo:', error);
      setError('Failed to create todo. Please try again.');
      toast.error('Failed to create todo');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTodo = async (
    id: string,
    data: Partial<Todo>
  ) => {
    try {
      console.log(`Updating todo: ${id}`, data);
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Update failed with status: ${response.status}`, errorData);
        throw new Error(`HTTP error! status: ${response.status}${errorData.error ? `, message: ${errorData.error}` : ''}`);
      }

      const updatedTodo = await response.json();
      console.log('Todo updated successfully:', updatedTodo);
      
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      setSelectedTodo(updatedTodo);
      toast.success('Todo updated successfully');
      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
      throw error;
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodos(todos.filter((todo) => todo._id !== id));
      setSelectedTodo(null);
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
      throw error;
    }
  };

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {selectedTodo ? (
        /* Mobile view - Todo detail */
        <div className="block md:hidden h-full flex flex-col">
          <Header />
          <div className="px-4 py-3 border-b border-gray-200 flex items-center">
            <button
              onClick={() => setSelectedTodo(null)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <TodoDetail
            todo={selectedTodo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            onClose={() => setSelectedTodo(null)}
            isMobile={true}
          />
        </div>
      ) : (
        /* Mobile view - Todo list */
        <div className="block md:hidden h-full flex flex-col">
          <Header />
          
          <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
            <button
              onClick={handleCreateTodo}
              disabled={isCreating}
              className="flex items-center justify-center px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Todo
            </button>
            
            {isSearchVisible ? (
              <form onSubmit={handleSearch} className="flex items-center flex-1 mx-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search todos..."
                  className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm w-full text-gray-900 bg-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gray-800 text-white rounded-r-md text-sm hover:bg-gray-700 disabled:bg-gray-400"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                <button
                  type="button" 
                  onClick={clearSearch}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button 
                onClick={toggleSearch} 
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-100">
            <TodoList
              todos={todos}
              pagination={pagination}
              onPageChange={fetchTodos}
              onTodoSelect={setSelectedTodo}
              selectedTodoId={(selectedTodo as any)?._id}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      )}
      
      {/* Desktop view - Split screen */}
      <div className="hidden md:flex h-full flex-col">
        <Header />
        <div className="flex flex-1">
          {/* List sidebar */}
          <div className="w-96 flex flex-col bg-gray-100 border-r border-gray-200">
            <div className="p-4 flex items-center justify-between">
              <button
                onClick={handleCreateTodo}
                disabled={isCreating}
                className="flex items-center justify-center px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Todo
              </button>
              
              {isSearchVisible ? (
                <form onSubmit={handleSearch} className="flex items-center flex-1 mx-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search todos..."
                    className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm w-full text-gray-900 bg-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gray-800 text-white rounded-r-md text-sm hover:bg-gray-700 disabled:bg-gray-400"
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                  <button
                    type="button" 
                    onClick={clearSearch}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button 
                  onClick={toggleSearch} 
                  className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <TodoList
                todos={todos}
                pagination={pagination}
                onPageChange={fetchTodos}
                onTodoSelect={setSelectedTodo}
                selectedTodoId={(selectedTodo as any)?._id}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            </div>
          </div>
          
          {/* Todo details */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {selectedTodo ? (
              <TodoDetail
                todo={selectedTodo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
                onClose={() => setSelectedTodo(null)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Select a todo from the list</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer for login/signup - shown when not logged in */}
      {!session && (
        <div className="bg-white border-t border-gray-200 p-4 flex justify-center space-x-4">
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full text-center">
            Sign up
          </a>
          <a href="/login" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors w-full text-center">
            Log in
          </a>
        </div>
      )}
    </div>
  );
}
