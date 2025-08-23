// src/components/utils/exportUtils.js
// src/components/hooks/utils/exportUtils.js
export const exportData = (teachers, classrooms, classSubjects, schedules, conflicts) => {
  const exportPayload = { teachers, classrooms, classSubjects, schedules, conflicts };
  const dataStr = JSON.stringify(exportPayload, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'teacher_schedules.json';
  link.click();
};
