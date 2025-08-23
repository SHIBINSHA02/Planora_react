// src/components/hooks/useScheduleData.js
import { useState } from 'react';
import { classSubjects } from '../data/classSubjects';
import { initialTeachers } from '../data/initialTeachers';
import { initialClassrooms } from '../data/initialClassrooms';

import {
  getSubjectsForClass,
  getTeachersForSubject,
  isTeacherAvailable,
  getScheduleConflicts,
} from '../utils/scheduleUtils';

import { autoAssignTeachers } from '../utils/autoAssign';
import { exportData } from '../utils/exportUtils';

export const useScheduleData = () => {
  // State: teachers and classrooms
  const [teachers, setTeachers] = useState(initialTeachers);
  const [classrooms, setClassrooms] = useState(initialClassrooms);

  // State: schedules for each classroom (5 days × 6 periods)
  const [schedules, setSchedules] = useState(() => {
    const initialSchedules = {};
    initialClassrooms.forEach(classroom => {
      initialSchedules[classroom.id] = Array(5).fill().map(() =>
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });
    return initialSchedules;
  });

  // ➤ Add new teacher
  const addTeacher = (teacherData) => {
    if (teacherData.name && teacherData.subjects.length > 0 && teacherData.classes.length > 0) {
      const newId = Date.now();
      setTeachers(prev => ({
        ...prev,
        [newId]: {
          id: newId,
          name: teacherData.name,
          subjects: teacherData.subjects,
          classes: teacherData.classes
        }
      }));
      return true;
    }
    return false;
  };

  // ➤ Add new classroom
  const addClassroom = (classroomData) => {
    if (classroomData.name && classroomData.grade && classroomData.division) {
      const newClass = { 
        id: Date.now(), 
        name: classroomData.name, 
        grade: classroomData.grade,
        division: classroomData.division
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

  // ➤ Update a specific period in the schedule
  const updateSchedule = (classroomId, dayIndex, periodIndex, teacherId, subject) => {
    const teacher = teachers[teacherId];
    const classroom = classrooms.find(c => c.id === classroomId);

    if (teacher && classroom) {
      if (subject && !teacher.subjects.includes(subject)) {
        console.warn(`Teacher ${teacher.name} cannot teach ${subject}`);
        return false;
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

  // ➤ Clear all schedules
  const clearAllSchedules = () => {
    const clearedSchedules = {};
    classrooms.forEach(classroom => {
      clearedSchedules[classroom.id] = Array(5).fill().map(() =>
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      );
    });
    setSchedules(clearedSchedules);
  };

  // ➤ Get teacher's timetable (cross-class)
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

  return {
    teachers,
    classrooms,
    classSubjects,
    schedules,

    // CRUD operations
    addTeacher,
    addClassroom,
    updateSchedule,
    clearAllSchedules,

    // Queries
    getTeacherTimetable,
    getSubjectsForClass: (grade) => getSubjectsForClass(classSubjects, grade),
    getTeachersForSubject: (grade, subject) => getTeachersForSubject(teachers, grade, subject),
    isTeacherAvailable: (teacherId, day, period, exclude) => isTeacherAvailable(schedules, teacherId, day, period, exclude),

    // Advanced utilities
    autoAssignTeachers: () => autoAssignTeachers({ teachers, classrooms, schedules, setSchedules, classSubjects }),
    getScheduleConflicts: () => getScheduleConflicts(schedules, classrooms),
    exportData: () => exportData(teachers, classrooms, classSubjects, schedules, getScheduleConflicts(schedules, classrooms))
  };
};
