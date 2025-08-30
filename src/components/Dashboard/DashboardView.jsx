// src/components/Dashboard/DashboardView.jsx
import { Plus, User, MapPin, BookOpen, Calendar, Download, RotateCcw } from 'lucide-react';
import StatsCard from './StatsCard';
import ClassroomForm from './ClassroomForm';
import QuickActions from './QuickActions';
import { motion } from 'framer-motion';
import TeacherManagement from './TeacherManagement';

const DashboardView = ({
  teachers,
  classrooms,
  subjects,
  addTeacher, // This prop might not be needed anymore since TeacherManagement handles it internally
  addClassroom,
  autoAssignTeachers,
  clearAllSchedules,
  exportData,
}) => {
  // Animation variants for smooth entrance
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your teachers, classrooms, and schedules efficiently
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        <StatsCard
          title="Total Teachers"
          value={teachers.length}
          icon={User}
          bgColor="bg-white"
          textColor="text-gray-900"
          valueColor="text-[#4f39f6]"
          iconColor="text-[#4f39f6]"
          className="hover:shadow-lg transition-shadow duration-300"
        />

        <StatsCard
          title="Total Classrooms"
          value={classrooms.length}
          icon={MapPin}
          bgColor="bg-white"
          textColor="text-gray-900"
          valueColor="text-[#4f39f6]"
          iconColor="text-[#4f39f6]"
          className="hover:shadow-lg transition-shadow duration-300"
        />

        <StatsCard
          title="Total Subjects"
          value={subjects.length}
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
        {/* Teacher Management - Now handles its own state and API calls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <TeacherManagement />
          </div>
        </div>

        {/* Classroom Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <ClassroomForm
            onAddClassroom={addClassroom}
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