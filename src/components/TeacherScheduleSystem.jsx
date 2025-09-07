// src/components/TeacherScheduleSystem.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect import
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
      if (!orgId) { 
        setTeachers([]); 
        setClassrooms([]); 
        return; 
      }
      
      try {
        const t = await TeacherService.getAllTeachers(orgId);
        setTeachers(Array.isArray(t) ? t : []);
      } catch { 
        setTeachers([]); 
      }
      
      try {
        const c = await OrganizationService.getClassrooms(orgId);
        setClassrooms(c.classrooms || []);
      } catch { 
        setClassrooms([]); 
      }
    };
    load();
  }, [currentOrganization]);

  // Convert classSubjects object to an array of unique subjects
  const subjects = Array.from(
    new Set(
      Object.values(classSubjects).flat()
    )
  );

  // Helper functions that were missing
  const updateSchedule = (classroomId, day, period, assignment) => {
    setClassSchedules(prev => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [`${day}-${period}`]: assignment
      }
    }));
  };

  const getAvailableTeachers = (day, period, subject) => {
    return teachers.filter(teacher => {
      // Check if teacher is already assigned at this time
      const isAssigned = Object.values(classSchedules).some(schedule => 
        schedule[`${day}-${period}`]?.teacherId === teacher.id
      );
      return !isAssigned;
    });
  };

  const getSubjectsForClass = (classroomId) => {
    return classSubjects[classroomId] || [];
  };

  const getTeachersForSubject = (subject) => {
    return teachers.filter(teacher => 
      teacher.subjects && teacher.subjects.includes(subject)
    );
  };

  const isTeacherAvailable = (teacherId, day, period) => {
    return !Object.values(classSchedules).some(schedule => 
      schedule[`${day}-${period}`]?.teacherId === teacherId
    );
  };

  const getTeacherTimetable = (teacherId) => {
    const timetable = {};
    
    Object.entries(classSchedules).forEach(([classroomId, schedule]) => {
      Object.entries(schedule).forEach(([timeSlot, assignment]) => {
        if (assignment.teacherId === teacherId) {
          timetable[timeSlot] = {
            ...assignment,
            classroomId
          };
        }
      });
    });
    
    return timetable;
  };

  // Dashboard action functions
  const addTeacher = async (teacherData) => {
    try {
      const orgId = currentOrganization?.id || currentOrganization?.organisationId;
      if (!orgId) return;
      
      const newTeacher = await TeacherService.addTeacher(orgId, teacherData);
      setTeachers(prev => [...prev, newTeacher]);
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const addClassroom = async (classroomData) => {
    try {
      const orgId = currentOrganization?.id || currentOrganization?.organisationId;
      if (!orgId) return;
      
      const newClassroom = await OrganizationService.createClassroom({
        organisationId: orgId,
        ...classroomData
      });
      setClassrooms(prev => [...prev, newClassroom]);
    } catch (error) {
      console.error('Error adding classroom:', error);
    }
  };

  const autoAssignTeachers = () => {
    // Auto-assign logic - randomly assign available teachers to empty slots
    const newSchedules = { ...classSchedules };
    
    classrooms.forEach(classroom => {
      const availableTeachers = teachers.filter(teacher => 
        teacher.organizations?.some(org => 
          org.organisationId === (currentOrganization?.id || currentOrganization?.organisationId)
        )
      );
      
      if (!newSchedules[classroom.classroomId]) {
        newSchedules[classroom.classroomId] = {};
      }
      
      // Fill empty slots with random teachers
      for (let day = 0; day < 5; day++) {
        for (let period = 0; period < 6; period++) {
          const timeSlot = `${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][day]}-${period}`;
          if (!newSchedules[classroom.classroomId][timeSlot] && availableTeachers.length > 0) {
            const randomTeacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
            const teacherSubjects = randomTeacher.organizations?.find(org => 
              org.organisationId === (currentOrganization?.id || currentOrganization?.organisationId)
            )?.subjects || [];
            
            newSchedules[classroom.classroomId][timeSlot] = {
              teacherId: randomTeacher.id,
              teacherName: randomTeacher.name,
              subject: teacherSubjects[0] || 'General',
              subjects: teacherSubjects
            };
          }
        }
      }
    });
    
    setClassSchedules(newSchedules);
  };

  const clearAllSchedules = () => {
    const emptySchedules = {};
    classrooms.forEach(classroom => {
      emptySchedules[classroom.classroomId] = {};
    });
    setClassSchedules(emptySchedules);
  };

  const exportData = () => {
    const exportObj = {
      organization: currentOrganization,
      teachers,
      classrooms,
      schedules: classSchedules,
      subjects: classSubjects,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentOrganization?.name || 'organization'}_schedule_export.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <ErrorBoundary>
            <DashboardView
              teachers={teachers}
              classrooms={classrooms}
              subjects={subjects}
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
              getSubjectsForClass={getSubjectsForClass}
              getTeachersForSubject={getTeachersForSubject}
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