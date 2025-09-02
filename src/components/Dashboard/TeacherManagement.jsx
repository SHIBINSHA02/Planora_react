// src/components/Dashboard/TeacherManagement.jsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import TeacherForm from './TeacherForm';
import TeacherService from '../../services/teacherService';
import { useOrganization } from '../../contexts/OrganizationContext';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const { currentOrganization } = useOrganization();
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Available subjects - you can move this to a config file or fetch from API
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Economics',
    'Political Science'
  ];

  // Load teachers on component mount
  useEffect(() => {
    if (currentOrganization) {
      loadTeachers();
    }
  }, [currentOrganization]);

  // Load all teachers from the API
  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If you don't have a GET all route yet, you can start with an empty array
      // and populate teachers as you add them
      try {
        const teachersData = await TeacherService.getAllTeachers(currentOrganization.id || currentOrganization.organisationId);
        setTeachers(teachersData);
      } catch (fetchError) {
        // If GET all route doesn't exist yet, start with empty array
        console.warn('GET all teachers route not implemented yet:', fetchError.message);
        setTeachers([]);
      }
    } catch (error) {
      setError('Failed to load teachers: ' + error.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Show success message temporarily
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle adding a new teacher
  const handleAddTeacher = async (newTeacher) => {
    try {
      setError(null);
      const createdTeacher = await TeacherService.createTeacher(currentOrganization.id || currentOrganization.organisationId, newTeacher);
      setTeachers(prev => [...prev, createdTeacher]);
      showSuccessMessage('Teacher added successfully!');
      return true;
    } catch (error) {
      setError('Failed to add teacher: ' + error.message);
      return false;
    }
  };

  // Handle updating an existing teacher
  const handleUpdateTeacher = async (updatedTeacher) => {
    try {
      setError(null);
      const updated = await TeacherService.updateTeacher(currentOrganization.id || currentOrganization.organisationId, updatedTeacher.id, updatedTeacher);
      setTeachers(prev => 
        prev.map(teacher => 
          teacher.id === updatedTeacher.id ? updated : teacher
        )
      );
      setEditingTeacher(null);
      showSuccessMessage('Teacher updated successfully!');
      return true;
    } catch (error) {
      setError('Failed to update teacher: ' + error.message);
      return false;
    }
  };

  // Handle deleting a teacher
  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) {
      return;
    }

    try {
      setError(null);
      await TeacherService.deleteTeacher(currentOrganization.id || currentOrganization.organisationId, teacherId);
      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      
      // If we were editing this teacher, cancel the edit
      if (editingTeacher?.id === teacherId) {
        setEditingTeacher(null);
      }
      
      showSuccessMessage('Teacher deleted successfully!');
    } catch (error) {
      setError('Failed to delete teacher: ' + error.message);
    }
  };

  // Handle edit button click
  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setError(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTeacher(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Teacher Form */}
      <TeacherForm
        subjects={subjects}
        onAddTeacher={handleAddTeacher}
        onUpdateTeacher={handleUpdateTeacher}
        editingTeacher={editingTeacher}
        onCancelEdit={handleCancelEdit}
      />

      {/* Teachers List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Teachers List</h3>
        
        {teachers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No teachers found. Add your first teacher above.</p>
        ) : (
          <div className="space-y-4">
            {teachers.map(teacher => (
              <div
                key={teacher.id}
                className={`border rounded-lg p-4 transition-all ${
                  editingTeacher?.id === teacher.id 
                    ? 'border-[#4f39f6] bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        ID: {teacher.id}
                      </span>
                      {editingTeacher?.id === teacher.id && (
                        <span className="text-xs bg-[#4f39f6] text-white px-2 py-1 rounded">
                          Editing
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Subjects: </span>
                        <span className="text-sm text-gray-800">
                          {teacher.subjects && teacher.subjects.length > 0 
                            ? teacher.subjects.join(', ') 
                            : 'No subjects assigned'
                          }
                        </span>
                      </div>
                      
                      {teacher.classes && teacher.classes.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Classes: </span>
                          <span className="text-sm text-gray-800">
                            {teacher.classes.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTeacher(teacher)}
                      disabled={editingTeacher?.id === teacher.id}
                      className={`p-2 rounded-md transition-colors ${
                        editingTeacher?.id === teacher.id
                          ? 'bg-[#4f39f6] text-white cursor-not-allowed'
                          : 'text-gray-600 hover:text-[#4f39f6] hover:bg-purple-50'
                      }`}
                      title={editingTeacher?.id === teacher.id ? 'Currently Editing' : 'Edit Teacher'}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Teacher"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherManagement;