// components/ClassroomForm.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const ClassroomForm = ({ onAddClassroom }) => {
  const [newClassroom, setNewClassroom] = useState({ name: '', grade: '' });

  const handleSubmit = () => {
    if (onAddClassroom(newClassroom)) {
      setNewClassroom({ name: '', grade: '' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Add New Classroom</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Classroom Name"
          value={newClassroom.name}
          onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <input
          type="text"
          placeholder="Grade (e.g., 10th)"
          value={newClassroom.grade}
          onChange={(e) => setNewClassroom({...newClassroom, grade: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Classroom</span>
        </button>
      </div>
    </div>
  );
};

export default ClassroomForm;