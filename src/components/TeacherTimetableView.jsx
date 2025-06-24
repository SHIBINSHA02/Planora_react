// src/components/TeacherTimetableView.jsx
// components/TeacherTimetableView.jsx
import React from 'react';
import ScheduleTable from './ScheduleTable';

const TeacherTimetableView = ({
  teachers,
  selectedTeacher,
  setSelectedTeacher,
  getTeacherTimetable
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];
  
  const teacherTimetable = selectedTeacher ? getTeacherTimetable(parseInt(selectedTeacher)) : null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeacher && teacherTimetable && (
        <ScheduleTable
          scheduleData={teacherTimetable}
          days={days}
          periods={periods}
          type="teacher"
        />
      )}
    </div>
  );
};

export default TeacherTimetableView;