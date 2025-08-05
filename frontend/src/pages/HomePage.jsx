import { StrictMode } from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
const Home = () => {
      return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-6 animate-fade-in
                 text-shadow-md text-shadow-blue-300/50 dark:text-shadow-blue-700/50"> {/* Added text-shadow */}
        Welcome to Your React App
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl animate-fade-in delay-100">
        This application demonstrates modern React development practices, including component architecture, state management with hooks, and API integration, all styled beautifully with Tailwind CSS.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/tasks">
          <Button variant="primary" className="text-lg px-8 py-4 animate-slide-up delay-200">
            Go to Task Manager
          </Button>
        </Link>
        <Link to="/data">
          <Button variant="secondary" className="text-lg px-8 py-4 animate-slide-up delay-300">
            Explore API Data
          </Button>
        </Link>
      </div>
    </div>
  );
};



export default Home;