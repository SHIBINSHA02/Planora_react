// src/components/utils/classroom.js

export const addClassroomUtil = (classrooms, setClassrooms, classSchedules, setclassSchedules, classroomData, teacherSchedules = null, setTeacherSchedules = null) => {
  if (classroomData.name && classroomData.grade && classroomData.division) {
    const newClass = {
      id: Date.now(),
      name: classroomData.name,
      grade: classroomData.grade,
      division: classroomData.division
    };

    // Add to classrooms
    setClassrooms(prev => [...prev, newClass]);

    // Add to class schedules
    setclassSchedules(prev => ({
      ...prev,
      [newClass.id]: Array(5).fill().map(() =>
        Array(6).fill({ teacher: '', subject: '', teacherId: null })
      )
    }));

    return {
      success: true,
      classroom: newClass
    };
  }
  
  return {
    success: false,
    classroom: null
  };
};

// Utility to remove a classroom and clean up all related schedules
export const removeClassroomUtil = (classroomId, classrooms, setClassrooms, classSchedules, setclassSchedules, teacherSchedules, setTeacherSchedules) => {
  // Remove from classrooms
  setClassrooms(prev => prev.filter(classroom => classroom.id !== classroomId));

  // Remove from class schedules
  setclassSchedules(prev => {
    const newSchedules = { ...prev };
    delete newSchedules[classroomId];
    return newSchedules;
  });

  // Clean up teacher schedules - remove assignments to this classroom
  if (teacherSchedules && setTeacherSchedules) {
    setTeacherSchedules(prev => {
      const newTeacherSchedules = { ...prev };
      
      Object.keys(newTeacherSchedules).forEach(teacherId => {
        newTeacherSchedules[teacherId] = newTeacherSchedules[teacherId].map(day =>
          day.map(period =>
            period.classroomId === classroomId
              ? { classroomId: null, subject: null, classroomName: null, grade: null }
              : period
          )
        );
      });
      
      return newTeacherSchedules;
    });
  }

  return true;
};

// Utility to get classroom schedule statistics
export const getClassroomStats = (classroomId, classSchedules, teachers) => {
  if (!classSchedules[classroomId]) return null;

  const schedule = classSchedules[classroomId];
  let totalPeriods = 0;
  let assignedPeriods = 0;
  let uniqueTeachers = new Set();
  let subjectDistribution = {};

  schedule.forEach(day => {
    day.forEach(period => {
      totalPeriods++;
      if (period.teacherId) {
        assignedPeriods++;
        uniqueTeachers.add(period.teacherId);
        
        if (period.subject) {
          subjectDistribution[period.subject] = (subjectDistribution[period.subject] || 0) + 1;
        }
      }
    });
  });

  return {
    totalPeriods,
    assignedPeriods,
    unassignedPeriods: totalPeriods - assignedPeriods,
    fillPercentage: Math.round((assignedPeriods / totalPeriods) * 100),
    uniqueTeachers: uniqueTeachers.size,
    subjectDistribution,
    teacherNames: Array.from(uniqueTeachers).map(id => {
      const teacher = teachers.find(t => t.id === id);
      return teacher ? teacher.name : 'Unknown';
    })
  };
};

// Utility to get all classrooms' statistics
export const getAllClassroomsStats = (classrooms, classSchedules, teachers) => {
  return classrooms.map(classroom => ({
    id: classroom.id,
    name: classroom.name,
    grade: classroom.grade,
    division: classroom.division,
    stats: getClassroomStats(classroom.id, classSchedules, teachers)
  }));
};

// Utility to validate classroom data
export const validateClassroomData = (classroomData, existingClassrooms) => {
  const errors = [];

  if (!classroomData.name || classroomData.name.trim() === '') {
    errors.push('Classroom name is required');
  }

  if (!classroomData.grade || classroomData.grade.trim() === '') {
    errors.push('Grade is required');
  }

  if (!classroomData.division || classroomData.division.trim() === '') {
    errors.push('Division is required');
  }

  // Check for duplicate classroom names
  const duplicateName = existingClassrooms.some(
    classroom => classroom.name.toLowerCase() === classroomData.name.toLowerCase()
  );
  
  if (duplicateName) {
    errors.push('A classroom with this name already exists');
  }

  // Check for duplicate grade-division combination
  const duplicateGradeDivision = existingClassrooms.some(
    classroom => 
      classroom.grade === classroomData.grade && 
      classroom.division.toLowerCase() === classroomData.division.toLowerCase()
  );

  if (duplicateGradeDivision) {
    errors.push('A classroom with this grade and division already exists');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility to copy schedule from one classroom to another
export const copyClassroomSchedule = (sourceClassroomId, targetClassroomId, classSchedules, setclassSchedules, teacherSchedules, setTeacherSchedules, classrooms) => {
  if (!classSchedules[sourceClassroomId] || !classSchedules[targetClassroomId]) {
    return false;
  }

  const sourceSchedule = classSchedules[sourceClassroomId];
  const targetClassroom = classrooms.find(c => c.id === targetClassroomId);
  
  if (!targetClassroom) return false;

  // Copy class schedule
  setclassSchedules(prev => ({
    ...prev,
    [targetClassroomId]: sourceSchedule.map(day =>
      day.map(period => ({ ...period }))
    )
  }));

  // Update teacher schedules
  if (teacherSchedules && setTeacherSchedules) {
    setTeacherSchedules(prev => {
      const newTeacherSchedules = { ...prev };

      // Clear existing assignments for target classroom
      Object.keys(newTeacherSchedules).forEach(teacherId => {
        newTeacherSchedules[teacherId] = newTeacherSchedules[teacherId].map(day =>
          day.map(period =>
            period.classroomId === targetClassroomId
              ? { classroomId: null, subject: null, classroomName: null, grade: null }
              : period
          )
        );
      });

      // Add new assignments
      sourceSchedule.forEach((day, dayIndex) => {
        day.forEach((period, periodIndex) => {
          if (period.teacherId) {
            if (!newTeacherSchedules[period.teacherId]) {
              newTeacherSchedules[period.teacherId] = Array(5).fill().map(() => 
                Array(6).fill({ classroomId: null, subject: null, classroomName: null, grade: null })
              );
            }
            newTeacherSchedules[period.teacherId][dayIndex][periodIndex] = {
              classroomId: targetClassroomId,
              subject: period.subject,
              classroomName: targetClassroom.name,
              grade: targetClassroom.grade
            };
          }
        });
      });

      return newTeacherSchedules;
    });
  }

  return true;
};