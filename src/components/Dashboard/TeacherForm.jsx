// src/components/Dashboard/TeacherForm.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TeacherForm = ({ subjects, onAddTeacher }) => {
  // State to manage the input fields for a new teacher
  const [newTeacher, setNewTeacher] = useState({ name: '', subjects: [] });

  // Handles the form submission
  const handleSubmit = () => {
    // Call the parent function to add the teacher and check if it was successful
    if (onAddTeacher(newTeacher)) {
      // If successful, reset the input fields
      setNewTeacher({ name: '', subjects: [] });
    }
  };

  // Handles checking and unchecking subjects
  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      // Add the subject to the newTeacher's subjects array
      setNewTeacher(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    } else {
      // Remove the subject from the newTeacher's subjects array
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
          // Updated the focus ring color to the new hex code
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f39f6]"
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
                  // Updated the checkbox color
                  className="rounded text-[#4f39f6] focus:ring-[#4f39f6]"
                />
                <span className="text-sm">{subject}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          // Updated the background and hover colors to the new hex code
          className="w-full bg-[#4f39f6] text-white px-4 py-2 rounded-md hover:bg-[#4f39f6] transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Teacher</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherForm;
