// src/components/QuickActions.jsx
import React from 'react';
import { Calendar, Download, RotateCcw } from 'lucide-react';

const QuickActions = ({ onAutoAssign, onClearAll, onExport, allowMultiTeacher, setAllowMultiTeacher }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
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

      {/* Toggle Multi-Teacher */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Allow Multiple Teachers per Subject
        </span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={allowMultiTeacher}
            onChange={(e) => setAllowMultiTeacher(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-11 h-6 rounded-full transition-colors ${
            allowMultiTeacher ? 'bg-green-500' : 'bg-gray-300'
          } relative`}>
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                allowMultiTeacher ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default QuickActions;
