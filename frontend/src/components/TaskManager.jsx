import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from '../components/Card';
import Button from '../components/Button';
import { v4 as uuidv4 } from 'uuid';

const TaskManagerPage = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('All');

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    setTasks([
      ...tasks,
      { id: uuidv4(), text: newTask.trim(), completed: false }
    ]);
    setNewTask('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-180px)] p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Task Manager</h1>
      <Card className="w-full max-w-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add New Task</h2>
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </form>
      </Card>
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Tasks</h2>
        <div className="flex justify-center space-x-2 mb-4 flex-wrap gap-2">
          <Button variant={filter === 'All' ? 'primary' : 'secondary'} onClick={() => setFilter('All')}>All</Button>
          <Button variant={filter === 'Active' ? 'primary' : 'secondary'} onClick={() => setFilter('Active')}>Active</Button>
          <Button variant={filter === 'Completed' ? 'primary' : 'secondary'} onClick={() => setFilter('Completed')}>Completed</Button>
        </div>
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tasks found for this filter.</p>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors"
              >
                <span
                  className={`flex-grow cursor-pointer text-gray-900 dark:text-gray-100 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400 italic' : ''}`}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {task.text}
                </span>
                <Button variant="danger" onClick={() => deleteTask(task.id)} className="ml-4 flex-shrink-0">
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default TaskManagerPage;
