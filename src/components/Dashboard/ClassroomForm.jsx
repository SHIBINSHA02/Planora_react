// src/components/Dashboard/ClassroomForm.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Grid3X3, User, BookOpen, AlertCircle } from 'lucide-react';

const ClassroomForm = ({ onAddClassroom, teachers = [], subjects = [] }) => {
  // State to manage the input fields for a new classroom
  const [newClassroom, setNewClassroom] = useState({
    admin: '',
    classroomId: '',
    assignedTeacher: '',
    assignedTeachers: [],
    assignedSubjects: [],
    rows: 5,
    columns: 6,
    grid: []
  });

  // State for form validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize grid when rows/columns change
  useEffect(() => {
    const totalCells = newClassroom.rows * newClassroom.columns;
    const newGrid = Array(totalCells).fill().map(() => ({
      teachers: [],
      subjects: []
    }));
    setNewClassroom(prev => ({ ...prev, grid: newGrid }));
  }, [newClassroom.rows, newClassroom.columns]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!newClassroom.admin.trim()) {
      newErrors.admin = 'Admin name is required';
    }
    
    if (!newClassroom.classroomId.trim()) {
      newErrors.classroomId = 'Classroom ID is required';
    }
    
    if (!newClassroom.assignedTeacher) {
      newErrors.assignedTeacher = 'Main assigned teacher is required';
    }
    
    if (newClassroom.assignedTeachers.length === 0) {
      newErrors.assignedTeachers = 'At least one teacher must be assigned';
    }
    
    if (newClassroom.assignedSubjects.length === 0) {
      newErrors.assignedSubjects = 'At least one subject must be assigned';
    }
    

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setNewClassroom(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle teacher selection for assignedTeachers
  const handleTeacherChange = (teacherId, checked) => {
    if (checked) {
      setNewClassroom(prev => ({
        ...prev,
        assignedTeachers: [...prev.assignedTeachers, teacherId]
      }));
    } else {
      setNewClassroom(prev => ({
        ...prev,
        assignedTeachers: prev.assignedTeachers.filter(id => id !== teacherId)
      }));
    }
    
    // Clear error if user selects at least one teacher
    if (errors.assignedTeachers && checked) {
      setErrors(prev => ({ ...prev, assignedTeachers: undefined }));
    }
  };

  // Handle subject selection
  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      setNewClassroom(prev => ({
        ...prev,
        assignedSubjects: [...prev.assignedSubjects, subject]
      }));
    } else {
      setNewClassroom(prev => ({
        ...prev,
        assignedSubjects: prev.assignedSubjects.filter(s => s !== subject)
      }));
    }
    
    // Clear error if user selects at least one subject
    if (errors.assignedSubjects && checked) {
      setErrors(prev => ({ ...prev, assignedSubjects: undefined }));
    }
  };

  // Handles the form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Call the parent function to add the classroom
      const success = await onAddClassroom(newClassroom);
      
      if (success) {
        // Reset form on success
        setNewClassroom({
          classroomId: '',
          assignedTeacher: '',
          assignedTeachers: [],
          assignedSubjects: [],
          rows: 5,
          columns: 6,
          grid: Array(30).fill().map(() => ({ teachers: [], subjects: [] }))
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-[#4f39f6]" />
        <h3 className="text-lg font-semibold">Create New Classroom</h3>
      </div>

      <div className="space-y-4">
        

        {/* Classroom ID */}
        <div>
          <input
            type="text"
            placeholder="Classroom ID (e.g., ROOM-101, CLASS-A)"
            value={newClassroom.classroomId}
            onChange={(e) => handleInputChange('classroomId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f39f6] ${
              errors.classroomId ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.classroomId && (
            <p className="text-red-500 text-xs mt-1">{errors.classroomId}</p>
          )}
        </div>

        {/* Main Assigned Teacher */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Main Assigned Teacher:
          </label>
          <select
            value={newClassroom.assignedTeacher}
            onChange={(e) => handleInputChange('assignedTeacher', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f39f6] ${
              errors.assignedTeacher ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Main Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} (ID: {teacher.id})
              </option>
            ))}
          </select>
          {errors.assignedTeacher && (
            <p className="text-red-500 text-xs mt-1">{errors.assignedTeacher}</p>
          )}
        </div>

        {/* Assigned Teachers (Multiple) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned Teachers:
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
            {teachers.map(teacher => (
              <label key={teacher.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newClassroom.assignedTeachers.includes(teacher.id)}
                  onChange={(e) => handleTeacherChange(teacher.id, e.target.checked)}
                  className="rounded text-[#4f39f6] focus:ring-[#4f39f6]"
                />
                <span className="text-sm">{teacher.name}</span>
              </label>
            ))}
          </div>
          {errors.assignedTeachers && (
            <p className="text-red-500 text-xs mt-1">{errors.assignedTeachers}</p>
          )}
        </div>

        {/* Assigned Subjects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="inline h-4 w-4 mr-1" />
            Assigned Subjects:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map(subject => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newClassroom.assignedSubjects.includes(subject)}
                  onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                  className="rounded text-[#4f39f6] focus:ring-[#4f39f6]"
                />
                <span className="text-sm">{subject}</span>
              </label>
            ))}
          </div>
          {errors.assignedSubjects && (
            <p className="text-red-500 text-xs mt-1">{errors.assignedSubjects}</p>
          )}
        </div>



        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#4f39f6] hover:bg-[#3d2bc4] text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Create Classroom</span>
            </>
          )}
        </button>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Note:</p>
              <p>The grid will be initialized with empty cells. You can assign teachers and subjects to specific grid positions later through the classroom management interface.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomForm;