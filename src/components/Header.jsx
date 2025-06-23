// components/Header.jsx
import React from 'react';

const Header = ({ currentView, setCurrentView }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Schedule Management</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('classroom')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'classroom' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Classroom Schedules
            </button>
            <button
              onClick={() => setCurrentView('teacher')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'teacher' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Teacher Timetables
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;