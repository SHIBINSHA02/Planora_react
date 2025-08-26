// src/components/Header.jsx
import React from 'react';

const Header = ({ currentView, setCurrentView }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <img
            src="/logo.svg"
            alt="Planora Logo"
            className="h-[70px] w-auto object-contain"
          />
          <nav className="flex space-x-3 sm:space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors ${
                currentView === 'dashboard'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ backgroundColor: currentView === 'dashboard' ? '#8493d4' : 'transparent' }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('classroom')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors ${
                currentView === 'classroom'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ backgroundColor: currentView === 'classroom' ? '#8493d4' : 'transparent' }}
            >
              Classroom Schedules
            </button>
            <button
              onClick={() => setCurrentView('teacher')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors ${
                currentView === 'teacher'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ backgroundColor: currentView === 'teacher' ? '#8493d4' : 'transparent' }}
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