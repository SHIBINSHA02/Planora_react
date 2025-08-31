// src/components/Dashboard/DashboardView.jsx
import { useState, useEffect } from 'react';
import { Plus, User, MapPin, BookOpen } from 'lucide-react';
import StatsCard from './StatsCard';
import ClassroomForm from './ClassroomForm';
import QuickActions from './QuickActions';
import { motion } from 'framer-motion';
import TeacherManagement from './TeacherManagement';
import TeacherService from '../../services/teacherService';
import OrganizationService from '../../services/organizationService.js';

const DashboardView = ({
  teachers = [],
  classrooms = [],
  subjects = [],
  autoAssignTeachers,
  clearAllSchedules,
  exportData,
}) => {
  const [localTeachers, setLocalTeachers] = useState(teachers);
  const [localClassrooms, setLocalClassrooms] = useState(classrooms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Default subjects if not provided
  const defaultSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
    'History', 'Geography', 'Computer Science', 'Economics', 'Political Science'
  ];

  const availableSubjects = subjects.length > 0 ? subjects : defaultSubjects;

  // Load teachers and classrooms on component mount
  useEffect(() => {
    loadTeachers();
    loadClassrooms();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const teachersData = await TeacherService.getAllTeachers();
      setLocalTeachers(teachersData);
    } catch (error) {
      console.warn('Could not load teachers:', error.message);
      setLocalTeachers(teachers);
    } finally {
      setLoading(false);
    }
  };

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const classroomsData = await OrganizationService.getClassrooms('default-org-id'); // Replace with actual organization ID
      setLocalClassrooms(classroomsData.classrooms || []); // Adjust based on actual response structure
    } catch (error) {
      console.warn('Could not load classrooms:', error.message);
      setLocalClassrooms(classrooms);
    } finally {
      setLoading(false);
    }
  };

  // Validate teacher IDs before submitting
  const validateTeachers = async (teacherIds) => {
    try {
      await OrganizationService.validateTeachersExist(teacherIds);
      return true;
    } catch (error) {
      setError(`Teacher validation failed: ${error.message}`);
      return false;
    }
  };

  // Handle adding a new classroom
  const handleAddClassroom = async (classroomData) => {
    try {
      setError(null);

      // Validate teacher IDs
      const teacherIds = [
        classroomData.assignedTeacher,
        ...(classroomData.assignedTeachers || [])
      ];
      const isValidTeachers = await validateTeachers(teacherIds);
      if (!isValidTeachers) {
        return false;
      }

      // Validate the data before sending
      OrganizationService.validateClassroomData(classroomData);

      // Create the classroom
      const result = await OrganizationService.createClassroom({
        ...classroomData,
        organisationId: 'default-org-id' // Replace with actual organization ID
      });

      // Update local state with the new classroom
      setLocalClassrooms(prev => [...prev, result.classroom]); // Adjust based on actual response structure

      setSuccessMessage('Classroom created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      return true;
    } catch (error) {
      setError(`Failed to create classroom: ${error.message}`);
      return false;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-8 p-6 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage your teachers, classrooms, and schedules efficiently
        </p>
      </motion.div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div 
          variants={itemVariants}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
        >
          {successMessage}
        </motion.div>
      )}

      {error && (
        <motion.div 
          variants={itemVariants}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          {error}
        </motion.div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <motion.div 
          variants={itemVariants}
          className="text-gray-600 text-center"
        >
          Loading...
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        <StatsCard
          title="Total Teachers"
          value={localTeachers.length}
          icon={User}
          bgColor="bg-white"
          textColor="text-gray-900"
          valueColor="text-[#4f39f6]"
          iconColor="text-[#4f39f6]"
          className="hover:shadow-lg transition-shadow duration-300"
        />

        <StatsCard
          title="Total Classrooms"
          value={localClassrooms.length}
          icon={MapPin}
          bgColor="bg-white"
          textColor="text-gray-900"
          valueColor="text-[#4f39f6]"
          iconColor="text-[#4f39f6]"
          className="hover:shadow-lg transition-shadow duration-300"
        />

        <StatsCard
          title="Total Subjects"
          value={availableSubjects.length}
          icon={BookOpen}
          bgColor="bg-white"
          textColor="text-gray-900"
          valueColor="text-[#4f39f6]"
          iconColor="text-[#4f39f6]"
          className="hover:shadow-lg transition-shadow duration-300"
        />
      </motion.div>

      {/* Forms */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Teacher Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <TeacherManagement />
          </div>
        </div>

        {/* Enhanced Classroom Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <ClassroomForm
            onAddClassroom={handleAddClassroom}
            teachers={localTeachers}
            subjects={availableSubjects}
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <QuickActions
          onAutoAssign={autoAssignTeachers}
          onClearAll={clearAllSchedules}
          onExport={exportData}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300"
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardView;