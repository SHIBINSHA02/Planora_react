// src/components/hooks/useScheduleData.js
import { useState } from 'react';
import classSubjects from '../data/classSubjects';
import { teacher } from '../data/teacher';
import { classes } from '../data/classes';
import { addTeacherUtil,getAvailableTeachersUtil ,getTeachersForSubjectUtil } from '../utils/teacher';
import { addClassroomUtil } from '../utils/classroom';
export const useScheduleData = () => {
  const [teachers, setTeachers] = useState(teacher);
  const [classrooms, setClassrooms] = useState(classes);
  const getSubjectsForClass = (grade) => {
    return classSubjects[grade] || [];
  };
  const [schedules, setSchedules] = useState(() => {
    const initialSchedules = {};
    const initialClassrooms = classes;
    
    initialClassrooms.forEach(classroom => {
      initialSchedules[classroom.id] = Array(5).fill().map(() => 
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });
    return initialSchedules;
  });

const addTeacher = (teacherData) => {
  return addTeacherUtil(teachers, setTeachers, teacherData);
};

const addClassroom = (classroomData) => {
  return addClassroomUtil(classrooms, setClassrooms, schedules, setSchedules, classroomData);
};


 
const getAvailableTeachers = (classroomId, dayIndex, periodIndex, subject) =>
  getAvailableTeachersUtil(teachers, classrooms, schedules, classroomId, dayIndex, periodIndex, subject);

const getTeachersForSubject = (grade, subject) => getTeachersForSubjectUtil(teachers, grade, subject);


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

  setSchedules(prev => {
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
  return true;
};

  const clearAllSchedules = () => {
    const clearedSchedules = {};
    classrooms.forEach(classroom => {
      clearedSchedules[classroom.id] = Array(5).fill().map(() => 
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });
    setSchedules(clearedSchedules);
  };

  const getTeacherTimetable = (teacherId) => {
    const timetable = Array(5).fill().map(() => Array(6).fill(null));
    
    classrooms.forEach(classroom => {
      schedules[classroom.id].forEach((day, dayIndex) => {
        day.forEach((period, periodIndex) => {
          if (period.teacherId === teacherId) {
            timetable[dayIndex][periodIndex] = {
              classroom: classroom.name,
              subject: period.subject,
              grade: classroom.grade,
              division: classroom.division
            };
          }
        });
      });
    });
    
    return timetable;
  };
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

  const autoAssignTeachers = () => {
    const newSchedules = { ...schedules };
    
    classrooms.forEach(classroom => {
      const schedule = newSchedules[classroom.id];
      const classSubjectsList = getSubjectsForClass(classroom.grade);
      
      schedule.forEach((day, dayIndex) => {
        day.forEach((period, periodIndex) => {
          if (!period.teacherId && classSubjectsList.length > 0) {
            // Try to assign a subject from the class curriculum
            const subject = classSubjectsList[Math.floor(Math.random() * classSubjectsList.length)];
            
            // Find available teachers who can teach this subject to this class
            const availableTeachers = teachers.filter(teacher => {
              // Check if teacher can teach this subject and class
              if (!teacher.subjects.includes(subject) || !teacher.classes.includes(classroom.grade)) {
                return false;
              }
              
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

  // Get schedule conflicts
  const getScheduleConflicts = () => {
    const conflicts = [];
    
    // Check for teacher conflicts (teacher assigned to multiple classes at same time)
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      for (let periodIndex = 0; periodIndex < 6; periodIndex++) {
        const teacherAssignments = {};
        
        classrooms.forEach(classroom => {
          const period = schedules[classroom.id][dayIndex][periodIndex];
          if (period.teacherId) {
            if (teacherAssignments[period.teacherId]) {
              conflicts.push({
                type: 'teacher_conflict',
                teacher: period.teacher,
                day: dayIndex,
                period: periodIndex,
                classrooms: [teacherAssignments[period.teacherId], classroom.name]
              });
            } else {
              teacherAssignments[period.teacherId] = classroom.name;
            }
          }
        });
      }
    }
    
    return conflicts;
  };

  // Export data
  const exportData = () => {
    const exportData = {
      teachers,
      classrooms,
      classSubjects,
      schedules: schedules,
      conflicts: getScheduleConflicts()
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
    classSubjects,
    schedules,
    addTeacher,
    addClassroom,
    updateSchedule,
    clearAllSchedules,
    getTeacherTimetable,
    getAvailableTeachers,
    getTeachersForSubject,
    getSubjectsForClass,
    isTeacherAvailable,
    autoAssignTeachers,
    getScheduleConflicts,
    exportData
  };
};