// src/components/utils/autoAssign.js
export const autoAssignTeachers = ({ teachers, classrooms, schedules, setSchedules, classSubjects }) => {
  const newSchedules = { ...schedules };

  classrooms.forEach(classroom => {
    const subjects = classSubjects[classroom.grade] || [];
    subjects.forEach((subject, subjectIdx) => {
      const teacher = Object.values(teachers).find(
        t => t.subjects.includes(subject) && t.classes.includes(classroom.grade)
      );
      if (teacher) {
        const dayIndex = subjectIdx % 5;
        const periodIndex = subjectIdx % 6;
        newSchedules[classroom.id][dayIndex][periodIndex] = {
          teacher: teacher.name,
          subject,
          teacherId: teacher.id
        };
      }
    });
  });

  setSchedules(newSchedules);
};
