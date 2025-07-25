// src/components/QuickActions.jsx
// components/QuickActions.jsx
import React from 'react';
import { Calendar, Download, RotateCcw } from 'lucide-react';

const QuickActions = ({ onAutoAssign, onClearAll, onExport }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onAutoAssign}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center space-x-2"
        >
          <Calendar className="h-4 w-4" />
          <span>Auto Assign Teachers</span>
        </button>
        
        <button
          onClick={onClearAll}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Clear All Schedules</span>
        </button>
        
        <button
          onClick={onExport}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;