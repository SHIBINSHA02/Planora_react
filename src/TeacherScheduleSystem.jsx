// src/TeacherScheduleSystem.jsx
// TeacherScheduleSystem.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ClassroomScheduleView from './components/ClassroomScheduleView';
import TeacherTimetableView from './components/TeacherTimetableView';
import { useScheduleData } from './components/hooks/useScheduleData';


const TeacherScheduleSystem = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  const {
    teachers,
    classrooms,
    subjects,
    schedules,
    addTeacher,
    addClassroom,
    updateSchedule,
    clearAllSchedules,
    getTeacherTimetable,
    autoAssignTeachers,
    exportData
  } = useScheduleData();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <DashboardView 
            teachers={teachers}
            classrooms={classrooms}
            subjects={subjects}
            addTeacher={addTeacher}
            addClassroom={addClassroom}
            autoAssignTeachers={autoAssignTeachers}
            clearAllSchedules={clearAllSchedules}
            exportData={exportData}
          />
        )}
        
        {currentView === 'classroom' && (
          <ClassroomScheduleView 
            classrooms={classrooms}
            teachers={teachers}
            subjects={subjects}
            schedules={schedules}
            selectedClassroom={selectedClassroom}
            setSelectedClassroom={setSelectedClassroom}
            updateSchedule={updateSchedule}
          />
        )}
        
        {currentView === 'teacher' && (
          <TeacherTimetableView 
            teachers={teachers}
            selectedTeacher={selectedTeacher}
            setSelectedTeacher={setSelectedTeacher}
            getTeacherTimetable={getTeacherTimetable}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherScheduleSystem;