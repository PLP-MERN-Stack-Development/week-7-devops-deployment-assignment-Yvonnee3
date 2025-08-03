// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <Link to="/" className="text-2xl font-bold text-blue-400 whitespace-nowrap">
          React App
        </Link>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-blue-300 transition ${isActive ? 'text-blue-300 font-medium' : 'text-white'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `hover:text-blue-300 transition ${isActive ? 'text-blue-300 font-medium' : 'text-white'}`
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="/data"
            className={({ isActive }) =>
              `hover:text-blue-300 transition ${isActive ? 'text-blue-300 font-medium' : 'text-white'}`
            }
          >
            API Data
          </NavLink>
          <Button onClick={toggleTheme} variant="secondary" className="text-sm">
            Toggle Theme ({theme === 'light' ? 'Dark' : 'Light'})
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;