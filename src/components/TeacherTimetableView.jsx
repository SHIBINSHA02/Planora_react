// src/components/TeacherTimetableView.jsx
import React from 'react';
import ScheduleTable from './ScheduleTable';

const TeacherTimetableView = ({
  teachers,
  selectedTeacher,
  setSelectedTeacher,
  getTeacherTimetable,
  subjects = [],
  schedules = {},
  classrooms = []
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

  const teacherTimetable = selectedTeacher ? getTeacherTimetable(parseInt(selectedTeacher)) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <select
          value={selectedTeacher || ''}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Teacher</option>
          {(Array.isArray(teachers) ? teachers : []).map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeacher && teacherTimetable && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {(Array.isArray(teachers) ? teachers : []).find(t => t.id == selectedTeacher)?.name}'s Timetable
          </h2>
          <ScheduleTable
            scheduleData={teacherTimetable}
            days={days}
            periods={periods}
            teachers={Array.isArray(teachers) ? teachers : []}
            subjects={subjects}
            onUpdateSchedule={() => {}} // Read-only for teacher view
            getTeacherTimetable={getTeacherTimetable}
            type="teacher"
            schedules={schedules}
            classrooms={classrooms}
          />
        </div>
      )}

      {selectedTeacher && !teacherTimetable && (
        <div className="text-center text-gray-500 py-8">
          No timetable data found for the selected teacher.
        </div>
      )}

      {!selectedTeacher && (
        <div className="text-center text-gray-500 py-8">
          Please select a teacher to view their timetable.
        </div>
      )}
    </div>
  );
};

export default TeacherTimetableView;
