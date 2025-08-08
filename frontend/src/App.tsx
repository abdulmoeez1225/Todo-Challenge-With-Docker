/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchTodos(savedToken);
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/users/register', { email, password });
      showNotification('Registration successful! Please login.', 'success');
      setIsRegistering(false);
      setEmail('');
      setPassword('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Registration failed',
        'error'
      );
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/users/login', {
        email,
        password,
      });
      const { token: newToken } = response.data;
      setToken(newToken);
      setIsLoggedIn(true);
      localStorage.setItem('token', newToken);
      fetchTodos(newToken);
      showNotification('Welcome back!', 'success');
      setEmail('');
      setPassword('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Login failed',
        'error'
      );
    }
    setLoading(false);
  };

  const fetchTodos = async (authToken: string) => {
    try {
      const response = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTodos(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showNotification('Failed to fetch todos', 'error');
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/todos', newTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '', status: 'pending' });

      showNotification('Todo added successfully!', 'success');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showNotification('Failed to add todo', 'error');
    }
    setLoading(false);
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `/api/todos/${editingTodo.id}`,
        editingTodo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodos(
        todos.map(todo => (todo.id === editingTodo.id ? response.data : todo))
      );
      setEditingTodo(null);
      showNotification('Todo updated successfully!', 'success');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showNotification('Failed to update todo', 'error');
    }
    setLoading(false);
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter(todo => todo.id !== id));
      showNotification('Todo deleted successfully!', 'success');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showNotification('Failed to delete todo', 'error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setTodos([]);
    localStorage.removeItem('token');
    showNotification('Logged out successfully', 'success');
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || todo.status === filter;
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⏳';
      case 'pending':
        return '○';
      default:
        return '○';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>✨ TodoMaster</h1>
              <p>Organize your life, one task at a time</p>
            </div>

            <div className="auth-tabs">
              <button
                className={!isRegistering ? 'active' : ''}
                onClick={() => setIsRegistering(false)}
              >
                Login
              </button>
              <button
                className={isRegistering ? 'active' : ''}
                onClick={() => setIsRegistering(true)}
              >
                Register
              </button>
            </div>

            <form
              onSubmit={isRegistering ? handleRegister : handleLogin}
              className="auth-form"
            >
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '⏳' : isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>✨ TodoMaster</h1>
          <div className="header-actions">
            <button
              className="btn btn-icon"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="two-column-layout">
          {/* Left Column - Add Todo */}
          <div className="left-column">
            <div className="column-header">
              <h2>✨ Create New Todo</h2>
              <p>Add a new task to your list</p>
            </div>

            <div className="add-todo-section">
              <form onSubmit={handleAddTodo} className="add-todo-form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="Enter todo title..."
                    value={newTodo.title}
                    onChange={e =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                    className="todo-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter description (optional)..."
                    value={newTodo.description}
                    onChange={e =>
                      setNewTodo({ ...newTodo, description: e.target.value })
                    }
                    className="todo-textarea"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newTodo.status}
                    onChange={e =>
                      setNewTodo({ ...newTodo, status: e.target.value })
                    }
                    className="status-select"
                  >
                    <option value="pending">📋 Pending</option>
                    <option value="in-progress">⏳ In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? '⏳ Adding...' : '➕ Add Todo'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-full"
                  onClick={() =>
                    setNewTodo({
                      title: '',
                      description: '',
                      status: 'pending',
                    })
                  }
                >
                  🗑️ Clear Form
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - View Todos */}
          <div className="right-column">
            <div className="column-header">
              <h2>📋 Your Todos</h2>
              <p>Manage and track your tasks</p>
            </div>

            <div className="todo-controls">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="🔍 Search todos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-tabs">
                {['all', 'pending', 'in-progress', 'completed'].map(
                  filterOption => (
                    <button
                      key={filterOption}
                      className={`filter-tab ${filter === filterOption ? 'active' : ''}`}
                      onClick={() => setFilter(filterOption)}
                    >
                      {filterOption === 'all' && '📋'}
                      {filterOption === 'pending' && '⏸️'}
                      {filterOption === 'in-progress' && '⏳'}
                      {filterOption === 'completed' && '✅'}
                      <span className="filter-text">
                        {filterOption.charAt(0).toUpperCase() +
                          filterOption.slice(1).replace('-', ' ')}
                      </span>
                      <span className="count">
                        {filterOption === 'all'
                          ? todos.length
                          : todos.filter(t => t.status === filterOption).length}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="todos-list">
              {filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No todos found</h3>
                  <p>
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : filter !== 'all'
                        ? `No ${filter.replace('-', ' ')} todos yet`
                        : 'Create your first todo using the form on the left!'}
                  </p>
                </div>
              ) : (
                filteredTodos.map(todo => (
                  <div key={todo.id} className="todo-card">
                    {editingTodo?.id === todo.id ? (
                      <form
                        onSubmit={handleUpdateTodo}
                        className="edit-todo-form"
                      >
                        <div className="form-group">
                          <input
                            type="text"
                            value={editingTodo.title}
                            onChange={e =>
                              setEditingTodo({
                                ...editingTodo,
                                title: e.target.value,
                              })
                            }
                            className="todo-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <textarea
                            value={editingTodo.description}
                            onChange={e =>
                              setEditingTodo({
                                ...editingTodo,
                                description: e.target.value,
                              })
                            }
                            className="todo-textarea"
                            rows={3}
                          />
                        </div>
                        <div className="form-row">
                          <select
                            value={editingTodo.status}
                            onChange={e =>
                              setEditingTodo({
                                ...editingTodo,
                                status: e.target.value,
                              })
                            }
                            className="status-select"
                          >
                            <option value="pending">📋 Pending</option>
                            <option value="in-progress">⏳ In Progress</option>
                            <option value="completed">✅ Completed</option>
                          </select>
                          <div className="form-actions">
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary"
                              disabled={loading}
                            >
                              {loading ? '⏳' : '💾 Save'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary"
                              onClick={() => setEditingTodo(null)}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="todo-content">
                          <div
                            className="todo-status"
                            style={{ color: getStatusColor(todo.status) }}
                          >
                            <span className="status-icon">
                              {getStatusIcon(todo.status)}
                            </span>
                            <span className="status-text">
                              {todo.status.replace('-', ' ')}
                            </span>
                          </div>
                          <h3 className="todo-title">{todo.title}</h3>
                          {todo.description && (
                            <p className="todo-description">
                              {todo.description}
                            </p>
                          )}
                          <div className="todo-meta">
                            <span>
                              📅 Created:{' '}
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </span>
                            {todo.updatedAt !== todo.createdAt && (
                              <span>
                                🔄 Updated:{' '}
                                {new Date(todo.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="todo-actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingTodo(todo)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
