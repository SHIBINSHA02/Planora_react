// src/components/hooks/useScheduleData.js
import { useState } from 'react';
import classSubjects from '../data/classSubjects';
import { teacher } from '../data/teacher';
import { classes } from '../data/classes';
import { addTeacherUtil, getAvailableTeachersUtil, getTeachersForSubjectUtil, getWorkloadSummary, getTeacherWorkload } from '../utils/teacher';
import { addClassroomUtil, getClassroomStats, getAllClassroomsStats, removeClassroomUtil, validateClassroomData } from '../utils/classroom';

export const useScheduleData = () => {
  const [teachers, setTeachers] = useState(teacher);
  const [classrooms, setClassrooms] = useState(classes);

  const getSubjectsForClass = (grade) => {
    return classSubjects[grade] || [];
  };

  const [classSchedules, setclassSchedules] = useState(() => {
    const initialClassroomSchedules = {};
    const initialClassrooms = classes;
    
    initialClassrooms.forEach(classroom => {
      initialClassroomSchedules[classroom.id] = Array(5).fill().map(() => 
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });
    return initialClassroomSchedules;
  });

  const [teacherSchedules, setTeacherSchedules] = useState(() => {
    const initialTeacherSchedules = {};
    
    teachers.forEach(teacher => {
      initialTeacherSchedules[teacher.id] = Array(5).fill().map(() => 
        Array(6).fill({ classroomId: null, subject: null, classroomName: null, grade: null })
      );
    });
    return initialTeacherSchedules;
  });

  const addTeacher = (teacherData) => {
    const result = addTeacherUtil(teachers, setTeachers, teacherData);
    
    // Add new teacher to teacherSchedules when a teacher is added
    if (result && result.success) {
      setTeacherSchedules(prev => ({
        ...prev,
        [result.teacher.id]: Array(5).fill().map(() => 
          Array(6).fill({ classroomId: null, subject: null, classroomName: null, grade: null })
        )
      }));
    }
    
    return result;
  };

  const addClassroom = (classroomData) => {
    return addClassroomUtil(classrooms, setClassrooms, classSchedules, setclassSchedules, classroomData, teacherSchedules, setTeacherSchedules);
  };

  const getAvailableTeachers = (classroomId, dayIndex, periodIndex, subject) =>
    getAvailableTeachersUtil(teachers, classrooms, classSchedules, classroomId, dayIndex, periodIndex, subject, teacherSchedules);

  const getTeachersForSubject = (grade, subject) => getTeachersForSubjectUtil(teachers, grade, subject);

  // Utility function to sync both schedules
  const syncSchedules = (classroomId, dayIndex, periodIndex, teacherId, subject, teacher, classroom) => {
    // Update class schedule
    setclassSchedules(prev => {
      const newSchedules = { ...prev };
      newSchedules[classroomId] = newSchedules[classroomId].map((day, dIdx) =>
        day.map((period, pIdx) => 
          dIdx === dayIndex && pIdx === periodIndex 
            ? { 
                teacher: teacher ? teacher.name : '', 
                subject, 
                teacherId: teacherId ? parseInt(teacherId) : null 
              }
            : period
        )
      );
      return newSchedules;
    });

    // Update teacher schedule
    setTeacherSchedules(prev => {
      const newTeacherSchedules = { ...prev };
      
      // Clear previous assignment if updating existing slot
      Object.keys(newTeacherSchedules).forEach(tId => {
        if (newTeacherSchedules[tId][dayIndex] && newTeacherSchedules[tId][dayIndex][periodIndex]) {
          const currentAssignment = newTeacherSchedules[tId][dayIndex][periodIndex];
          if (currentAssignment.classroomId === classroomId) {
            newTeacherSchedules[tId][dayIndex][periodIndex] = { 
              classroomId: null, 
              subject: null, 
              classroomName: null, 
              grade: null 
            };
          }
        }
      });

      // Add new assignment if teacher is selected
      if (teacherId && teacher && classroom) {
        if (!newTeacherSchedules[teacherId]) {
          newTeacherSchedules[teacherId] = Array(5).fill().map(() => 
            Array(6).fill({ classroomId: null, subject: null, classroomName: null, grade: null })
          );
        }
        newTeacherSchedules[teacherId][dayIndex][periodIndex] = {
          classroomId: parseInt(classroomId),
          subject,
          classroomName: classroom.name,
          grade: classroom.grade
        };
      }

      return newTeacherSchedules;
    });
  };

  const updateSchedule = (classroomId, dayIndex, periodIndex, teacherId, subject) => {
    const teacher = teachers.find(t => t.id === parseInt(teacherId));
    const classroom = classrooms.find(c => c.id === classroomId);
    
    // Validate only if subject is selected
    if (teacher && classroom) {
      if (subject) {
        if (!teacher.subjects.includes(subject)) {
          console.warn(`Teacher ${teacher.name} cannot teach ${subject}`);
          return false;
        }
      }
      if (!teacher.classes.includes(classroom.grade)) {
        console.warn(`Teacher ${teacher.name} cannot teach class ${classroom.grade}`);
        return false;
      }
    }

    // Sync both schedules
    syncSchedules(classroomId, dayIndex, periodIndex, teacherId, subject, teacher, classroom);
    return true;
  };

  const clearAllSchedules = () => {
    const clearedClassSchedules = {};
    const clearedTeacherSchedules = {};
    
    classrooms.forEach(classroom => {
      clearedClassSchedules[classroom.id] = Array(5).fill().map(() => 
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });

    teachers.forEach(teacher => {
      clearedTeacherSchedules[teacher.id] = Array(5).fill().map(() => 
        Array(6).fill({ classroomId: null, subject: null, classroomName: null, grade: null })
      );
    });

    setclassSchedules(clearedClassSchedules);
    setTeacherSchedules(clearedTeacherSchedules);
  };

  // Simplified function using teacherSchedules
  const getTeacherTimetable = (teacherId) => {
    if (!teacherSchedules[teacherId]) {
      return Array(5).fill().map(() => Array(6).fill(null));
    }
    
    return teacherSchedules[teacherId].map(day => 
      day.map(period => 
        period.classroomId ? {
          classroom: period.classroomName,
          subject: period.subject,
          grade: period.grade,
          division: classrooms.find(c => c.id === period.classroomId)?.division || ''
        } : null
      )
    );
  };

  // Simplified function using teacherSchedules
  const isTeacherAvailable = (teacherId, dayIndex, periodIndex, excludeClassroomId = null) => {
    if (!teacherSchedules[teacherId]) return true;
    
    const assignment = teacherSchedules[teacherId][dayIndex][periodIndex];
    if (!assignment || !assignment.classroomId) return true;
    
    // If excluding a specific classroom, check if the assignment is for that classroom
    if (excludeClassroomId && assignment.classroomId === excludeClassroomId) {
      return true;
    }
    
    return false;
  };

  const autoAssignTeachers = () => {
    const newClassSchedules = { ...classSchedules };
    const newTeacherSchedules = { ...teacherSchedules };
    
    classrooms.forEach(classroom => {
      const schedule = newClassSchedules[classroom.id];
      const classSubjectsList = getSubjectsForClass(classroom.grade);
      
      schedule.forEach((day, dayIndex) => {
        day.forEach((period, periodIndex) => {
          if (!period.teacherId && classSubjectsList.length > 0) {
            const subject = classSubjectsList[Math.floor(Math.random() * classSubjectsList.length)];
            
            const availableTeachers = teachers.filter(teacher => {
              if (!teacher.subjects.includes(subject) || !teacher.classes.includes(classroom.grade)) {
                return false;
              }
              
              // Use teacherSchedules for availability check
              if (newTeacherSchedules[teacher.id] && 
                  newTeacherSchedules[teacher.id][dayIndex] && 
                  newTeacherSchedules[teacher.id][dayIndex][periodIndex] &&
                  newTeacherSchedules[teacher.id][dayIndex][periodIndex].classroomId) {
                return false;
              }
              
              return true;
            });
            
            if (availableTeachers.length > 0) {
              const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
              
              // Update class schedule
              schedule[dayIndex][periodIndex] = {
                teacher: teacher.name,
                subject: subject,
                teacherId: teacher.id
              };

              // Update teacher schedule
              if (!newTeacherSchedules[teacher.id]) {
                newTeacherSchedules[teacher.id] = Array(5).fill().map(() => 
                  Array(6).fill({ classroomId: null, subject: null, classroomName: null, grade: null })
                );
              }
              newTeacherSchedules[teacher.id][dayIndex][periodIndex] = {
                classroomId: classroom.id,
                subject: subject,
                classroomName: classroom.name,
                grade: classroom.grade
              };
            }
          }
        });
      });
    });
    
    setclassSchedules(newClassSchedules);
    setTeacherSchedules(newTeacherSchedules);
  };

  // Simplified conflict detection using teacherSchedules
  const getScheduleConflicts = () => {
    const conflicts = [];
    
    Object.keys(teacherSchedules).forEach(teacherId => {
      const teacher = teachers.find(t => t.id === parseInt(teacherId));
      if (!teacher) return;

      for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        for (let periodIndex = 0; periodIndex < 6; periodIndex++) {
          const assignment = teacherSchedules[teacherId][dayIndex][periodIndex];
          
          if (assignment && assignment.classroomId) {
            // Check if this teacher appears in multiple classrooms at the same time
            // by cross-referencing with classSchedules
            const conflictingClassrooms = [];
            
            classrooms.forEach(classroom => {
              const period = classSchedules[classroom.id][dayIndex][periodIndex];
              if (period.teacherId === parseInt(teacherId)) {
                conflictingClassrooms.push(classroom.name);
              }
            });
            
            if (conflictingClassrooms.length > 1) {
              conflicts.push({
                type: 'teacher_conflict',
                teacher: teacher.name,
                day: dayIndex,
                period: periodIndex,
                classrooms: conflictingClassrooms
              });
            }
          }
        }
      }
    });
    
    return [...new Set(conflicts)]; // Remove duplicates
  };

  // Additional utility functions using the enhanced utilities
  const removeClassroom = (classroomId) => {
    return removeClassroomUtil(classroomId, classrooms, setClassrooms, classSchedules, setclassSchedules, teacherSchedules, setTeacherSchedules);
  };

  const validateNewClassroom = (classroomData) => {
    return validateClassroomData(classroomData, classrooms);
  };

  const getClassroomStatistics = (classroomId) => {
    return getClassroomStats(classroomId, classSchedules, teachers);
  };

  const getAllClassroomStatistics = () => {
    return getAllClassroomsStats(classrooms, classSchedules, teachers);
  };

  const getTeachersWorkloadSummary = () => {
    return getWorkloadSummary(teachers, teacherSchedules);
  };

  const getIndividualTeacherWorkload = (teacherId) => {
    return getTeacherWorkload(teacherId, teacherSchedules);
  };

  const exportData = () => {
    const exportData = {
      teachers,
      classrooms,
      classSubjects,
      classSchedules,
      teacherSchedules, // Include teacher schedules in export
      conflicts: getScheduleConflicts()
    };
    
    console.log('Schedule Data:', exportData);
    
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
    classSubjects,
    classSchedules,
    teacherSchedules, // Export teacherSchedules for external use
    addTeacher,
    addClassroom,
    removeClassroom,
    updateSchedule,
    clearAllSchedules,
    getTeacherTimetable,
    getAvailableTeachers,
    getTeachersForSubject,
    getSubjectsForClass,
    isTeacherAvailable,
    autoAssignTeachers,
    getScheduleConflicts,
    validateNewClassroom,
    getClassroomStatistics,
    getAllClassroomStatistics,
    getTeachersWorkloadSummary,
    getIndividualTeacherWorkload,
    exportData
  };
};