// src/components/Dashboard/QuickActions.jsx
import React from 'react';
import { Calendar, Download, RotateCcw } from 'lucide-react';

const QuickActions = ({ onAutoAssign, onClearAll, onExport}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={onAutoAssign}
          // The background and hover colors have been updated to the new hex code
          className="bg-[#4f39f6] text-white px-4 py-2 rounded-md hover:bg-[#4f39f6] transition-colors flex items-center space-x-2"
        >
          <Calendar className="h-4 w-4" />
          <span>Auto Assign Teachers</span>
        </button>
        
        <button
          onClick={onClearAll}
          // The background and hover colors have been updated to the new hex code
          className="bg-[#4f39f6] text-white px-4 py-2 rounded-md hover:bg-[#4f39f6] transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Clear All Schedules</span>
        </button>
        
        <button
          onClick={onExport}
          // The background and hover colors have been updated to the new hex code
          className="bg-[#4f39f6] text-white px-4 py-2 rounded-md hover:bg-[#4f39f6] transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
