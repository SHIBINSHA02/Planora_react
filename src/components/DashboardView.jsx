// components/DashboardView.jsx
import React, { useState } from 'react';
import { Plus, User, BookOpen, MapPin, Calendar, Download, RotateCcw } from 'lucide-react';
import StatsCard from './StatsCard';
import TeacherForm from './TeacherForm';
import ClassroomForm from './ClassroomForm';
import QuickActions from './QuickActions';

const DashboardView = ({
  teachers,
  classrooms,
  subjects,
  addTeacher,
  addClassroom,
  autoAssignTeachers,
  clearAllSchedules,
  exportData
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Teachers"
          value={teachers.length}
          icon={User}
          bgColor="bg-blue-100"
          textColor="text-blue-800"
          valueColor="text-blue-600"
          iconColor="text-blue-600"
        />
        
        <StatsCard
          title="Total Classrooms"
          value={classrooms.length}
          icon={MapPin}
          bgColor="bg-green-100"
          textColor="text-green-800"
          valueColor="text-green-600"
          iconColor="text-green-600"
        />
        
        <StatsCard
          title="Total Subjects"
          value={subjects.length}
          icon={BookOpen}
          bgColor="bg-purple-100"
          textColor="text-purple-800"
          valueColor="text-purple-600"
          iconColor="text-purple-600"
        />
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeacherForm 
          subjects={subjects}
          onAddTeacher={addTeacher}
        />
        
        <ClassroomForm 
          onAddClassroom={addClassroom}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onAutoAssign={autoAssignTeachers}
        onClearAll={clearAllSchedules}
        onExport={exportData}
      />
    </div>
  );
};

export default DashboardView;