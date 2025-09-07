// src/components/TeacherScheduleSystem.jsx
// src/TeacherScheduleSystem.jsx
import React, { useState } from 'react';
import Header from './Header';
import DashboardView from './Dashboard/DashboardView';
import ClassroomScheduleView from './ClassroomScheduleView';
import TeacherTimetableView from './TeacherTimetableView';
import ErrorBoundary from './ErrorBoundary';
// import { useScheduleData } from './hooks/useScheduleData';
import { useOrganization } from '../contexts/OrganizationContext';
import TeacherService from '../services/teacherService';
import OrganizationService from '../services/organizationService';

const TeacherScheduleSystem = ({ navigate }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  const { currentOrganization } = useOrganization();
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [classSubjects, setClassSubjects] = useState({});
  const [classSchedules, setClassSchedules] = useState({});

  // Load org-scoped teachers and classrooms
  useEffect(() => {
    const load = async () => {
      const orgId = currentOrganization?.id || currentOrganization?.organisationId;
      if (!orgId) { setTeachers([]); setClassrooms([]); return; }
      try {
        const t = await TeacherService.getAllTeachers(orgId);
        setTeachers(Array.isArray(t) ? t : []);
      } catch { setTeachers([]); }
      try {
        const c = await OrganizationService.getClassrooms(orgId);
        setClassrooms(c.classrooms || []);
      } catch { setClassrooms([]); }
    };
    load();
  }, [currentOrganization]);

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

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <ErrorBoundary>
            <DashboardView
              teachers={teachers}
              classrooms={classrooms}
              subjects={[]}
              addTeacher={() => {}}
              addClassroom={() => {}}
              autoAssignTeachers={() => {}}
              clearAllSchedules={() => {}}
              exportData={() => {}}
              navigate={navigate}
            />
          </ErrorBoundary>
        )}
        
        {currentView === 'classroom' && (
          <ErrorBoundary>
            <ClassroomScheduleView 
              classrooms={classrooms}
              teachers={teachers}
              subjects={subjects}
              classSchedules={classSchedules}
              selectedClassroom={selectedClassroom}
              setSelectedClassroom={setSelectedClassroom}
              updateSchedule={updateSchedule}
              getAvailableTeachers={getAvailableTeachers}
              getSubjectsForClass={getSubjectsForClass} // Pass the function
              getTeachersForSubject={getTeachersForSubject} // Pass the function
              isTeacherAvailable={isTeacherAvailable}
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