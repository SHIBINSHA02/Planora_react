// src/TeacherScheduleSystem.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ClassroomScheduleView from './components/ClassroomScheduleView';
import TeacherTimetableView from './components/TeacherTimetableView';
import ErrorBoundary from './components/ErrorBoundary';
import { useScheduleData } from './components/hooks/useScheduleData';

const TeacherScheduleSystem = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  const {
    teachers,
    classrooms,
    classSubjects,
    schedules,
    addTeacher,
    addClassroom,
    updateSchedule,
    clearAllSchedules,
    getTeacherTimetable,
    getAvailableTeachers,
    getSubjectsForClass, // Add this
    getTeachersForSubject, // Add this
    isTeacherAvailable,
    autoAssignTeachers,
    getTeachersForTimeSlot,
    getSubjectsForTeacher,
    exportData
  } = useScheduleData();

  // Convert classSubjects object to an array of unique subjects
  const subjects = Array.from(
    new Set(
      Object.values(classSubjects).flat()
    )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <ErrorBoundary>
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
          </ErrorBoundary>
        )}
        
        {currentView === 'classroom' && (
          <ErrorBoundary>
            <ClassroomScheduleView 
              classrooms={classrooms}
              teachers={teachers}
              subjects={subjects}
              schedules={schedules}
              selectedClassroom={selectedClassroom}
              setSelectedClassroom={setSelectedClassroom}
              getAvailableTeachers={getAvailableTeachers}
              getSubjectsForClass={getSubjectsForClass} // Pass the function
              getTeachersForSubject={getTeachersForSubject} // Pass the function
              isTeacherAvailable={isTeacherAvailable}
              getTeachersForTimeSlot={getTeachersForTimeSlot}
            getSubjectsForTeacher={getSubjectsForTeacher}
            onUpdateSchedule={updateSchedule}
            />
          </ErrorBoundary>
        )}
        
        {currentView === 'teacher' && (
          <ErrorBoundary>
            <TeacherTimetableView 
              teachers={teachers}
              selectedTeacher={selectedTeacher}
              setSelectedTeacher={setSelectedTeacher}
              getTeacherTimetable={getTeacherTimetable}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default TeacherScheduleSystem;