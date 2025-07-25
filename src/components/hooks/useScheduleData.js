// src/components/hooks/useScheduleData.js
// hooks/useScheduleData.js
import { useState } from 'react';

export const useScheduleData = () => {
  // Initial data
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Smith', subjects: ['Mathematics', 'Physics'] },
    { id: 2, name: 'Ms. Johnson', subjects: ['English', 'Literature'] },
    { id: 3, name: 'Mr. Brown', subjects: ['Science', 'Biology'] },
    { id: 4, name: 'Mrs. Davis', subjects: ['History', 'Geography'] }
  ]);

  const [classrooms, setClassrooms] = useState([
    { id: 1, name: 'Class A', grade: '10th' },
    { id: 2, name: 'Class B', grade: '10th' },
    { id: 3, name: 'Class C', grade: '9th' },
    { id: 4, name: 'Class D', grade: '9th' }
  ]);

  const [subjects] = useState([
    'Mathematics', 'English', 'Science', 'Physics', 'Biology', 
    'Chemistry', 'History', 'Geography', 'Literature', 'Art'
  ]);

  // Schedule state - stores assignments for each classroom
  const [schedules, setSchedules] = useState(() => {
    const initialSchedules = {};
    const initialClassrooms = [
      { id: 1, name: 'Class A', grade: '10th' },
      { id: 2, name: 'Class B', grade: '10th' },
      { id: 3, name: 'Class C', grade: '9th' },
      { id: 4, name: 'Class D', grade: '9th' }
    ];
    
    initialClassrooms.forEach(classroom => {
      initialSchedules[classroom.id] = Array(5).fill().map(() => 
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });
    return initialSchedules;
  });

  // Add new teacher
  const addTeacher = (teacherData) => {
    if (teacherData.name && teacherData.subjects.length > 0) {
      setTeachers(prev => [...prev, {
        id: Date.now(),
        name: teacherData.name,
        subjects: teacherData.subjects
      }]);
      return true;
    }
    return false;
  };

  // Add new classroom
  const addClassroom = (classroomData) => {
    if (classroomData.name && classroomData.grade) {
      const newClass = { 
        id: Date.now(), 
        name: classroomData.name, 
        grade: classroomData.grade 
      };
      
      setClassrooms(prev => [...prev, newClass]);
      setSchedules(prev => ({
        ...prev,
        [newClass.id]: Array(5).fill().map(() => 
          Array(6).fill({ teacher: '', subject: '', teacherId: null })
        )
      }));
      return true;
    }
    return false;
  };

  // Get available teachers for a specific day and period (excluding current classroom)
  const getAvailableTeachers = (dayIndex, periodIndex, currentClassroomId = null) => {
    return teachers.filter(teacher => {
      // Check if teacher is already assigned at this day/period in any classroom
      for (const classroomId of Object.keys(schedules)) {
        // Skip the current classroom if we're editing an existing assignment
        if (currentClassroomId && parseInt(classroomId) === currentClassroomId) {
          continue;
        }
        
        const classroomSchedule = schedules[classroomId];
        if (classroomSchedule[dayIndex] && classroomSchedule[dayIndex][periodIndex]) {
          const period = classroomSchedule[dayIndex][periodIndex];
          if (period.teacherId === teacher.id) {
            return false; // Teacher is already assigned elsewhere
          }
        }
      }
      return true; // Teacher is available
    });
  };

  // Update schedule assignment
  const updateSchedule = (classroomId, dayIndex, periodIndex, teacherId, subject) => {
    const teacher = teachers.find(t => t.id === parseInt(teacherId));
    setSchedules(prev => {
      const newSchedules = { ...prev };
      newSchedules[classroomId] = newSchedules[classroomId].map((day, dIdx) =>
        day.map((period, pIdx) => 
          dIdx === dayIndex && pIdx === periodIndex 
            ? { teacher: teacher ? teacher.name : '', subject, teacherId: teacherId ? parseInt(teacherId) : null }
            : period
        )
      );
      return newSchedules;
    });
  };

  // Clear all schedules
  const clearAllSchedules = () => {
    const clearedSchedules = {};
    classrooms.forEach(classroom => {
      clearedSchedules[classroom.id] = Array(5).fill().map(() => 
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });
    setSchedules(clearedSchedules);
  };

  // Get teacher's timetable
  const getTeacherTimetable = (teacherId) => {
    const timetable = Array(5).fill().map(() => Array(6).fill(null));
    
    classrooms.forEach(classroom => {
      schedules[classroom.id].forEach((day, dayIndex) => {
        day.forEach((period, periodIndex) => {
          if (period.teacherId === teacherId) {
            timetable[dayIndex][periodIndex] = {
              classroom: classroom.name,
              subject: period.subject,
              grade: classroom.grade
            };
          }
        });
      });
    });
    
    return timetable;
  };

  // Check if a teacher is available at a specific time slot
  const isTeacherAvailable = (teacherId, dayIndex, periodIndex, excludeClassroomId = null) => {
    for (const classroomId of Object.keys(schedules)) {
      if (excludeClassroomId && parseInt(classroomId) === excludeClassroomId) {
        continue;
      }
      
      const classroomSchedule = schedules[classroomId];
      if (classroomSchedule[dayIndex] && classroomSchedule[dayIndex][periodIndex]) {
        const period = classroomSchedule[dayIndex][periodIndex];
        if (period.teacherId === teacherId) {
          return false;
        }
      }
    }
    return true;
  };

  // Auto-assign teachers (improved algorithm with conflict checking)
  const autoAssignTeachers = () => {
    const newSchedules = { ...schedules };
    
    classrooms.forEach(classroom => {
      const schedule = newSchedules[classroom.id];
      
      schedule.forEach((day, dayIndex) => {
        day.forEach((period, periodIndex) => {
          if (!period.teacherId) {
            // Find available teachers for this time slot
            const availableTeachers = teachers.filter(teacher => {
              // Check if teacher is available at this time across all classrooms
              for (const otherClassroomId of Object.keys(newSchedules)) {
                if (parseInt(otherClassroomId) === classroom.id) continue;
                
                const otherSchedule = newSchedules[otherClassroomId];
                if (otherSchedule[dayIndex] && otherSchedule[dayIndex][periodIndex]) {
                  const otherPeriod = otherSchedule[dayIndex][periodIndex];
                  if (otherPeriod.teacherId === teacher.id) {
                    return false;
                  }
                }
              }
              return true;
            });
            
            if (availableTeachers.length > 0) {
              const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
              const subject = teacher.subjects[Math.floor(Math.random() * teacher.subjects.length)];
              
              schedule[dayIndex][periodIndex] = {
                teacher: teacher.name,
                subject: subject,
                teacherId: teacher.id
              };
            }
          }
        });
      });
    });
    
    setSchedules(newSchedules);
  };

  // Export data
  const exportData = () => {
    const exportData = {
      teachers,
      classrooms,
      schedules: schedules
    };
    console.log('Schedule Data:', exportData);
    
    // Create downloadable JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teacher_schedules.json';
    link.click();
  };

  return {
    teachers,
    classrooms,
    subjects,
    schedules,
    addTeacher,
    addClassroom,
    updateSchedule,
    clearAllSchedules,
    getTeacherTimetable,
    getAvailableTeachers,
    isTeacherAvailable,
    autoAssignTeachers,
    exportData
  };
};