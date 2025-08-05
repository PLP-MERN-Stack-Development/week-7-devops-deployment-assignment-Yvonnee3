// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card'; // Optional, just for consistency

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center p-4 text-center">
      <Card className="p-8">
        <h1 className="text-6xl font-bold text-red-500 mb-4 animate-bounce">404</h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8">Page Not Found</p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
          The page you are looking for does not exist.
        </p>
        <Link to="/">
          <Button variant="primary" className="text-lg px-8 py-4">
            Go to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;