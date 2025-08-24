// src/components/utils/teacher.js
export const addTeacherUtil = (teachers, setTeachers, teacherData) => {
  if (teacherData.name && teacherData.subjects.length > 0 && teacherData.classes.length > 0) {
    setTeachers(prev => [
      ...prev,
      {
        id: Date.now(),
        name: teacherData.name,
        subjects: teacherData.subjects,
        classes: teacherData.classes
      }
    ]);
    return true;
  }
  return false;
};

export const getAvailableTeachersUtil = (teachers, classrooms, schedules, classroomId, dayIndex, periodIndex, selectedSubject = null) => {
  const classroom = classrooms.find(c => c.id === classroomId);
  if (!classroom) return [];

  return teachers.filter(teacher => {
    if (!teacher.classes.includes(classroom.grade)) return false;
    if (selectedSubject && !teacher.subjects.includes(selectedSubject)) return false;

    for (const otherClassroomId of Object.keys(schedules)) {
      if (parseInt(otherClassroomId) === classroomId) continue;
      const classroomSchedule = schedules[otherClassroomId];
      if (classroomSchedule[dayIndex] && classroomSchedule[dayIndex][periodIndex]) {
        const period = classroomSchedule[dayIndex][periodIndex];
        if (period.teacherId === teacher.id) return false;
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
