// src/components/Header.jsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = ({ currentView, setCurrentView }) => {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function to handle view change and close the menu on mobile
  const handleViewChange = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false); // Close the menu after a selection is made
  };

  return (
    <div className="bg-white shadow-sm border-b font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - always visible */}
          <div className="flex-shrink-0">
            <img
              src="./logo.svg"
              alt="Planora Logo"
              className="h-[70px] w-auto object-contain"
            />
          </div>

          {/* Hamburger menu button for mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 rounded-md p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-3 sm:space-x-4">
            <button
              onClick={() => handleViewChange('dashboard')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors font-medium text-sm sm:text-base ${
                currentView === 'dashboard'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ backgroundColor: currentView === 'dashboard' ? '#4f39f6' : 'transparent' }}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleViewChange('classroom')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors font-medium text-sm sm:text-base ${
                currentView === 'classroom'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ backgroundColor: currentView === 'classroom' ? '#4f39f6' : 'transparent' }}
            >
              Classroom Schedules
            </button>
            <button
              onClick={() => handleViewChange('teacher')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors font-medium text-sm sm:text-base ${
                currentView === 'teacher'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ backgroundColor: currentView === 'teacher' ? '#4f39f6' : 'transparent' }}
            >
              Teacher Timetables
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu (toggles visibility) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 pb-4">
          <nav className="flex flex-col items-center space-y-2 px-4 pt-2">
            <button
              onClick={() => handleViewChange('dashboard')}
              className={`w-full text-left px-4 py-2 rounded-md font-medium text-base transition-colors ${
                currentView === 'dashboard'
                  ? 'text-white bg-blue-500 hover:bg-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: currentView === 'dashboard' ? '#4f39f6' : 'transparent', color: currentView === 'dashboard' ? '#ffffff' : '#4b5563' }}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleViewChange('classroom')}
              className={`w-full text-left px-4 py-2 rounded-md font-medium text-base transition-colors ${
                currentView === 'classroom'
                  ? 'text-white bg-blue-500 hover:bg-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: currentView === 'classroom' ? '#4f39f6' : 'transparent', color: currentView === 'classroom' ? '#ffffff' : '#4b5563' }}
            >
              Classroom Schedules
            </button>
            <button
              onClick={() => handleViewChange('teacher')}
              className={`w-full text-left px-4 py-2 rounded-md font-medium text-base transition-colors ${
                currentView === 'teacher'
                  ? 'text-white bg-blue-500 hover:bg-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: currentView === 'teacher' ? '#4f39f6' : 'transparent', color: currentView === 'teacher' ? '#ffffff' : '#4b5563' }}
            >
              Teacher Timetables
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
