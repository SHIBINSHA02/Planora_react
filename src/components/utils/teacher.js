// src/components/utils/teacher.js

export const addTeacherUtil = (teachers, setTeachers, teacherData) => {
  if (teacherData.name && teacherData.subjects.length > 0 && teacherData.classes.length > 0) {
    const newTeacher = {
      id: Date.now(),
      name: teacherData.name,
      subjects: teacherData.subjects,
      classes: teacherData.classes
    };

    setTeachers(prev => [...prev, newTeacher]);
    
    // Return success status and the new teacher for integration with teacherSchedules
    return {
      success: true,
      teacher: newTeacher
    };
  }
  return {
    success: false,
    teacher: null
  };
};

export const getAvailableTeachersUtil = (teachers, classrooms, schedules, classroomId, dayIndex, periodIndex, selectedSubject = null, teacherSchedules = null) => {
  const classroom = classrooms.find(c => c.id === classroomId);
  if (!classroom) return [];

  return teachers.filter(teacher => {
    // Check if teacher can teach this grade
    if (!teacher.classes.includes(classroom.grade)) return false;
    
    // Check if teacher can teach this subject (if subject is specified)
    if (selectedSubject && !teacher.subjects.includes(selectedSubject)) return false;

    // Check teacher availability using teacherSchedules if available (more efficient)
    if (teacherSchedules && teacherSchedules[teacher.id]) {
      const assignment = teacherSchedules[teacher.id][dayIndex][periodIndex];
      if (assignment && assignment.classroomId && assignment.classroomId !== classroomId) {
        return false;
      }
    } else {
      // Fallback to original method if teacherSchedules not provided
      for (const otherClassroomId of Object.keys(schedules)) {
        if (parseInt(otherClassroomId) === classroomId) continue;
        const classroomSchedule = schedules[otherClassroomId];
        if (classroomSchedule[dayIndex] && classroomSchedule[dayIndex][periodIndex]) {
          const period = classroomSchedule[dayIndex][periodIndex];
          if (period.teacherId === teacher.id) return false;
        }
      }
    }
    
    return true;
  });
};

export const getTeachersForSubjectUtil = (teachers, grade, subject) => {
  return teachers.filter(teacher => 
    teacher.subjects.includes(subject) && teacher.classes.includes(grade)
  );
};

// New utility function to check if a teacher exists in teacherSchedules
export const ensureTeacherInSchedules = (teacherId, teacherSchedules, setTeacherSchedules) => {
  if (!teacherSchedules[teacherId]) {
    setTeacherSchedules(prev => ({
      ...prev,
      [teacherId]: Array(5).fill().map(() => 
        Array(6).fill({ classroomId: null, subject: null, classroomName: null, grade: null })
      )
    }));
  }
};

// Utility to get teacher's current assignments for a specific day
export const getTeacherDaySchedule = (teacherId, dayIndex, teacherSchedules) => {
  if (!teacherSchedules[teacherId]) return [];
  
  return teacherSchedules[teacherId][dayIndex]
    .map((period, periodIndex) => ({
      periodIndex,
      ...period
    }))
    .filter(period => period.classroomId);
};

// Utility to count teacher's workload
export const getTeacherWorkload = (teacherId, teacherSchedules) => {
  if (!teacherSchedules[teacherId]) return 0;
  
  let totalPeriods = 0;
  teacherSchedules[teacherId].forEach(day => {
    day.forEach(period => {
      if (period.classroomId) totalPeriods++;
    });
  });
  
  return totalPeriods;
};

// Utility to get all teachers' workload summary
export const getWorkloadSummary = (teachers, teacherSchedules) => {
  return teachers.map(teacher => ({
    id: teacher.id,
    name: teacher.name,
    workload: getTeacherWorkload(teacher.id, teacherSchedules),
    subjects: teacher.subjects,
    classes: teacher.classes
  })).sort((a, b) => b.workload - a.workload);
};