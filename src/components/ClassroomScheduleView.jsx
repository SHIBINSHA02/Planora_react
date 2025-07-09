// src/components/ClassroomScheduleView.jsx
// components/ClassroomScheduleView.jsx
import React from 'react';
import ScheduleTable from './ScheduleTable';

const ClassroomScheduleView = ({
  classrooms,
  teachers,
  subjects,
  schedules,
  selectedClassroom,
  setSelectedClassroom,
  updateSchedule
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <select
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Classroom</option>
          {classrooms.map(classroom => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name} ({classroom.grade})
            </option>
          ))}
        </select>
      </div>

      {selectedClassroom && schedules[selectedClassroom] && (
        <ScheduleTable
          scheduleData={schedules[selectedClassroom]}
          days={days}
          periods={periods}
          teachers={teachers}
          subjects={subjects}
          onUpdateSchedule={(dayIndex, periodIndex, teacherId, subject) => 
            updateSchedule(parseInt(selectedClassroom), dayIndex, periodIndex, teacherId, subject)
          }
          type="classroom"
        />
      )}
    </div>
  );
};

export default ClassroomScheduleView;