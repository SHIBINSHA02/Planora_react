// src/components/utils/classroom.js
export const addClassroomUtil = (classrooms, setClassrooms, schedules, setSchedules, classroomData) => {
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