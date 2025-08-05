import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogIn,
  UserPlus,
  LayoutGrid,
  ClipboardList,
  Database,
  Home,
  Sun,
  Moon,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Loader,
  XCircle,
} from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = async (endpoint, method = 'GET', body = null) => {
  const { token } = JSON.parse(localStorage.getItem('userInfo')) || {};
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Tailwind CSS classes for consistent styling
const buttonClass = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200';
const primaryButtonClass = `${buttonClass} bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
const secondaryButtonClass = `${buttonClass} bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2`;
const dangerButtonClass = `${buttonClass} bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`;
const inputClass = 'w-full px-4 py-2 mb-4 text-gray-800 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200';
const cardClass = 'bg-white p-6 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700';



// --- Global Contexts ---
const ThemeContext = createContext();
const AuthContext = createContext(null);

const useTheme = () => useContext(ThemeContext);
const useAuth = () => useContext(AuthContext);

// --- Providers ---
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  const login = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// API utility to handle requests with auth headers
const api = async (endpoint, method = 'GET', body = null) => {
  const { token } = JSON.parse(localStorage.getItem('userInfo')) || {};
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// --- App Component ---
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="tasks" element={<PrivateRoutes><TaskManagerPage /></PrivateRoutes>} />
              <Route path="data" element={<ApiDataPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// --- Protected Route Wrapper ---
const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  return user ? children : null;
};

// --- Page and Layout Components ---
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="p-4 container mx-auto">
        <Outlet />
      </div>
    </>
  );
};

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/tasks', name: 'Tasks', icon: ClipboardList },
    { path: '/data', name: 'API Data', icon: Database },
  ];

  return (
    <nav className="p-4 shadow-md bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto mb-4 md:mb-0 space-y-2 md:space-y-0">
          <Link to="/" className="text-xl font-bold flex items-center mb-2 md:mb-0">
            <LayoutGrid className="mr-2 text-blue-500" /> My App
          </Link>
          <div className="flex space-x-4 md:ml-6">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 flex items-center">
                <link.icon className="mr-1" size={18} /> {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <button onClick={handleLogout} className={`${secondaryButtonClass} flex items-center`}>
              <LogOut className="mr-2" size={18} />
              Logout
            </button>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center">
                <LogIn className="mr-1" size={18} /> Login
              </Link>
              <Link to="/register" className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center">
                <UserPlus className="mr-1" size={18} /> Register
              </Link>
            </div>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const PageContainer = ({ title, children }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">{title}</h1>
      <div className={cardClass}>
        {children}
      </div>
    </div>
  );
};

// --- Functional Components ---

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api('auth/login', 'POST', { email, password });
      login(data);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className={`${cardClass} text-center`}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:border-red-600 dark:text-red-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <button type="submit" className={`w-full ${primaryButtonClass} flex justify-center items-center`} disabled={loading}>
            {loading ? <Loader className="animate-spin mr-2" /> : <LogIn className="mr-2" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api('auth/register', 'POST', { name, email, password });
      login(data);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className={`${cardClass} text-center`}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:border-red-600 dark:text-red-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <button type="submit" className={`w-full ${primaryButtonClass} flex justify-center items-center`} disabled={loading}>
            {loading ? <Loader className="animate-spin mr-2" /> : <UserPlus className="mr-2" />}
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => (
  <PageContainer title="Welcome to My App">
    <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-6">
      This is a full-stack task management application. Please log in or register to get started.
    </p>
    <div className="flex justify-center space-x-4">
      <Link to="/login" className={`${primaryButtonClass} flex items-center`}>
        <LogIn className="mr-2" size={18} />
        Login
      </Link>
      <Link to="/register" className={`${secondaryButtonClass} flex items-center`}>
        <UserPlus className="mr-2" size={18} />
        Register
      </Link>
    </div>
  </PageContainer>
);

const TaskManagerPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api('tasks');
      setTasks(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await api('tasks', 'POST', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async (taskId, updatedFields) => {
    try {
      await api(`tasks/${taskId}`, 'PUT', updatedFields);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api(`tasks/${taskId}`, 'DELETE');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageContainer title={`Welcome, ${user?.name.split(' ')[0]}!`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add a New Task</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:border-red-600 dark:text-red-200 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleCreateTask} className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter a new task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-grow px-4 py-2 text-gray-800 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            required
          />
          <button type="submit" className={primaryButtonClass}>
            <Plus size={20} />
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">My Tasks</h2>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="animate-spin text-blue-600 w-8 h-8" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">You have no tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
};

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const handleToggleCompleted = () => {
    onUpdate(task._id, { completed: !task.completed });
  };

  const handleDelete = () => {
    // NOTE: For a real app, you would use a custom modal instead of alert
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id);
    }
  };

  return (
    <li className={`flex items-center p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-transform duration-200 ease-in-out ${task.completed ? 'bg-green-50 dark:bg-green-900' : 'bg-gray-50 dark:bg-gray-700'}`}>
      <button onClick={handleToggleCompleted} className="mr-4 text-gray-400 hover:text-green-600 transition-colors duration-200">
        {task.completed ? <CheckCircle className="text-green-600" size={24} /> : <Circle size={24} />}
      </button>
      <div className="flex-grow">
        <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
          {task.title}
        </h3>
      </div>
      <button onClick={handleDelete} className="ml-4 text-gray-400 hover:text-red-600 transition-colors duration-200">
        <Trash2 size={24} />
      </button>
    </li>
  );
};

const ApiDataPage = () => (
  <PageContainer title="API Data Page">
    <p className="text-center text-lg text-gray-600 dark:text-gray-400">
      This page is a placeholder for displaying general API data.
    </p>
  </PageContainer>
);

const NotFoundPage = () => (
  <PageContainer title="404 - Page Not Found">
    <p className="text-center text-lg text-gray-600 dark:text-gray-400">
      The page you are looking for does not exist.
    </p>
  </PageContainer>
);

export default App;
