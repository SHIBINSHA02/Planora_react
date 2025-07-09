// src/components/TeacherForm.jsx
// components/TeacherForm.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TeacherForm = ({ subjects, onAddTeacher }) => {
  const [newTeacher, setNewTeacher] = useState({ name: '', subjects: [] });

  const handleSubmit = () => {
    if (onAddTeacher(newTeacher)) {
      setNewTeacher({ name: '', subjects: [] });
    }
  };

  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      setNewTeacher(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    } else {
      setNewTeacher(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Add New Teacher</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Teacher Name"
          value={newTeacher.name}
          onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Select Subjects:</p>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map(subject => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newTeacher.subjects.includes(subject)}
                  onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">{subject}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Teacher</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherForm;