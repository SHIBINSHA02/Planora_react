export const getSubjectsForClass = (classSubjects, grade) => classSubjects[grade] || [];

export const getTeachersForSubject = (teachers, grade, subject) => {
  return Object.values(teachers).filter(
    teacher => teacher.subjects.includes(subject) && teacher.classes.includes(grade)
  );
};

export const isTeacherAvailable = (schedules, teacherId, day, period, exclude) => {
  for (let classId in schedules) {
    if (exclude && parseInt(classId) === exclude) continue;
    if (schedules[classId][day][period]?.teacherId === teacherId) return false;
  }
  return true;
};

export const getScheduleConflicts = (schedules, classrooms) => {
  const conflicts = [];
  classrooms.forEach(classroom => {
    schedules[classroom.id].forEach((day, dayIndex) => {
      day.forEach((period, periodIndex) => {
        if (!period.teacherId) return;
        const teacherId = period.teacherId;
        for (let otherClassroom of classrooms) {
          if (otherClassroom.id === classroom.id) continue;
          const otherPeriod = schedules[otherClassroom.id][dayIndex][periodIndex];
          if (otherPeriod.teacherId === teacherId) {
            conflicts.push({
              teacherId,
              teacher: period.teacher,
              dayIndex,
              periodIndex,
              classes: [classroom.name, otherClassroom.name]
            });
          }
        }
      });
    });
  });
  return conflicts;
};
