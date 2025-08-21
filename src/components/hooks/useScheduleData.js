// src/components/hooks/useScheduleData.js
import { useState } from 'react';

export const useScheduleData = () => {


  // Define class-specific subjects
  const classSubjects = {
    'S1': ['Mathematics', 'English', 'Science', 'Social Studies', 'Malayalam'],
    'S2': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'],
    'S3': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Computer Science'],
    'S4': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Economics'],
    'S5': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Business Studies']
  };

  // Initial teachers with their subject specializations and class preferences
  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      name: 'Dr. Smith', 
      subjects: ['Mathematics'], 
      classes: ['S1', 'S2', 'S3', 'S4'] // Can teach math to all classes
    },
    { 
      id: 2, 
      name: 'Ms. Johnson', 
      subjects: ['English'], 
      classes: ['S1', 'S2', 'S3', 'S4', 'S5'] // Can teach English to all classes
    },
    { 
      id: 3, 
      name: 'Mr. Brown', 
      subjects: ['Physics', 'Science'], 
      classes: ['S1', 'S2', 'S3', 'S4', 'S5'] // Physics for higher classes, Science for S1
    },
    { 
      id: 4, 
      name: 'Mrs. Davis', 
      subjects: ['Chemistry'], 
      classes: ['S2', 'S3', 'S4', 'S5'] // Chemistry not taught in S1
    },
    { 
      id: 5, 
      name: 'Dr. Wilson', 
      subjects: ['Biology'], 
      classes: ['S2'] // Only teaches Biology in S2
    },
    { 
      id: 6, 
      name: 'Ms. Anderson', 
      subjects: ['Social Studies', 'Economics'], 
      classes: ['S1', 'S4'] // Social Studies in S1, Economics in S4
    },
    { 
      id: 7, 
      name: 'Mr. Taylor', 
      subjects: ['Computer Science'], 
      classes: ['S3'] // Only teaches Computer Science in S3
    },
    { 
      id: 8, 
      name: 'Mrs. Lee', 
      subjects: ['Malayalam'], 
      classes: ['S1'] // Local language for S1
    },
    { 
      id: 9, 
      name: 'Dr. Kumar', 
      subjects: ['Business Studies'], 
      classes: ['S5'] // Business Studies only in S5
    }
  ]);

  // Classrooms with divisions
  const [classrooms, setClassrooms] = useState([
    { id: 1, name: 'S1-A', grade: 'S1', division: 'A' },
    { id: 2, name: 'S1-B', grade: 'S1', division: 'B' },
    { id: 3, name: 'S2-A', grade: 'S2', division: 'A' },
    { id: 4, name: 'S2-B', grade: 'S2', division: 'B' },
    { id: 5, name: 'S3-A', grade: 'S3', division: 'A' },
    { id: 6, name: 'S3-B', grade: 'S3', division: 'B' },
    { id: 7, name: 'S4-A', grade: 'S4', division: 'A' },
    { id: 8, name: 'S4-B', grade: 'S4', division: 'B' },
    { id: 9, name: 'S5-A', grade: 'S5', division: 'A' },
    { id: 10, name: 'S5-B', grade: 'S5', division: 'B' }
  ]);

  // Get subjects for a specific class
  const getSubjectsForClass = (grade) => {
    return classSubjects[grade] || [];
  };

  // Schedule state - stores assignments for each classroom
  const [schedules, setSchedules] = useState(() => {
    const initialSchedules = {};
    const initialClassrooms = [
      { id: 1, name: 'S1-A', grade: 'S1', division: 'A' },
      { id: 2, name: 'S1-B', grade: 'S1', division: 'B' },
      { id: 3, name: 'S2-A', grade: 'S2', division: 'A' },
      { id: 4, name: 'S2-B', grade: 'S2', division: 'B' },
      { id: 5, name: 'S3-A', grade: 'S3', division: 'A' },
      { id: 6, name: 'S3-B', grade: 'S3', division: 'B' },
      { id: 7, name: 'S4-A', grade: 'S4', division: 'A' },
      { id: 8, name: 'S4-B', grade: 'S4', division: 'B' },
      { id: 9, name: 'S5-A', grade: 'S5', division: 'A' },
      { id: 10, name: 'S5-B', grade: 'S5', division: 'B' }
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
    if (teacherData.name && teacherData.subjects.length > 0 && teacherData.classes.length > 0) {
      setTeachers(prev => [...prev, {
        id: Date.now(),
        name: teacherData.name,
        subjects: teacherData.subjects,
        classes: teacherData.classes
      }]);
      return true;
    }
    return false;
  };

  // Add new classroom
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

  // Get available teachers for a specific classroom, day and period
  const getAvailableTeachers = (classroomId, dayIndex, periodIndex, selectedSubject = null) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (!classroom) return [];

    return teachers.filter(teacher => {
      // Check if teacher can teach this class
      if (!teacher.classes.includes(classroom.grade)) {
        return false;
      }

      // If subject is selected, check if teacher can teach this subject
      if (selectedSubject && !teacher.subjects.includes(selectedSubject)) {
        return false;
      }

      // Check if teacher is already assigned at this day/period in any classroom
      for (const otherClassroomId of Object.keys(schedules)) {
        if (parseInt(otherClassroomId) === classroomId) {
          continue; // Skip current classroom
        }
        
        const classroomSchedule = schedules[otherClassroomId];
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

  // Get teachers who can teach a specific subject to a specific class
  const getTeachersForSubject = (grade, subject) => {
    return teachers.filter(teacher => 
      teacher.subjects.includes(subject) && teacher.classes.includes(grade)
    );
  };

  // Update schedule assignment
  // Update schedule assignment
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
              grade: classroom.grade,
              division: classroom.division
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

  // Auto-assign teachers with improved algorithm considering class-subject constraints
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