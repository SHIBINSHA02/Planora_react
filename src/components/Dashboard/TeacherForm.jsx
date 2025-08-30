// src/components/Dashboard/TeacherForm.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';

const TeacherForm = ({ 
  subjects, 
  onAddTeacher, 
  onUpdateTeacher, 
  editingTeacher = null, 
  onCancelEdit = null 
}) => {
  // State to manage the input fields for a teacher
  const [teacher, setTeacher] = useState({ 
    id: '', 
    name: '', 
    subjects: [],
    classes: []
  });

  // State to manage form validation
  const [errors, setErrors] = useState({});

  // Effect to populate form when editing a teacher
  useEffect(() => {
    if (editingTeacher) {
      setTeacher({
        id: editingTeacher.id || '',
        name: editingTeacher.name || '',
        subjects: editingTeacher.subjects || [],
        classes: editingTeacher.classes || []
      });
      setErrors({});
    } else {
      setTeacher({ id: '', name: '', subjects: [], classes: [] });
      setErrors({});
    }
  }, [editingTeacher]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!teacher.name.trim()) {
      newErrors.name = 'Teacher name is required';
    }
    
    if (!editingTeacher && !teacher.id.trim()) {
      newErrors.id = 'Teacher ID is required';
    }
    
    if (teacher.subjects.length === 0) {
      newErrors.subjects = 'At least one subject must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handles the form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let success = false;
      
      if (editingTeacher) {
        // Update existing teacher
        success = await onUpdateTeacher(teacher);
      } else {
        // Add new teacher
        success = await onAddTeacher(teacher);
      }
      
      if (success) {
        // Reset form only if not editing or if edit was successful
        if (!editingTeacher) {
          setTeacher({ id: '', name: '', subjects: [], classes: [] });
        }
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handles checking and unchecking subjects
  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      setTeacher(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    } else {
      setTeacher(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }));
    }
    
    // Clear subjects error if user selects at least one subject
    if (errors.subjects && checked) {
      setErrors(prev => ({ ...prev, subjects: undefined }));
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setTeacher(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    setTeacher({ id: '', name: '', subjects: [], classes: [] });
    setErrors({});
  };

  const isEditing = !!editingTeacher;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
        </h3>
        {isEditing && onCancelEdit && (
          <button
            onClick={handleCancelEdit}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Cancel Edit"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Teacher ID - only show when adding new teacher */}
        {!isEditing && (
          <div>
            <input
              type="text"
              placeholder="Teacher ID"
              value={teacher.id}
              onChange={(e) => handleInputChange('id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f39f6] ${
                errors.id ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.id && (
              <p className="text-red-500 text-xs mt-1">{errors.id}</p>
            )}
          </div>
        )}

        {/* Teacher Name */}
        <div>
          <input
            type="text"
            placeholder="Teacher Name"
            value={teacher.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f39f6] ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Subject Selection */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Select Subjects:</p>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map(subject => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={teacher.subjects.includes(subject)}
                  onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                  className="rounded text-[#4f39f6] focus:ring-[#4f39f6]"
                />
                <span className="text-sm">{subject}</span>
              </label>
            ))}
          </div>
          {errors.subjects && (
            <p className="text-red-500 text-xs mt-1">{errors.subjects}</p>
          )}
        </div>

        {/* Classes Input - Optional field for teacher's classes */}
        <div>
          <input
            type="text"
            placeholder="Classes (comma-separated, e.g., 10A, 11B)"
            value={teacher.classes.join(', ')}
            onChange={(e) => handleInputChange('classes', 
              e.target.value.split(',').map(cls => cls.trim()).filter(cls => cls)
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f39f6]"
          />
          <p className="text-xs text-gray-500 mt-1">Optional: Enter class names separated by commas</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#4f39f6] text-white px-4 py-2 rounded-md hover:bg-[#3d2bc4] transition-colors flex items-center justify-center space-x-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              <span>Update Teacher</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Teacher</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TeacherForm;