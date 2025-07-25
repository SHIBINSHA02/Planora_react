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
  updateSchedule,
  getAvailableTeachers,
  isTeacherAvailable
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

  // Function to get available teachers for a specific time slot
  const getTeachersForTimeSlot = (dayIndex, periodIndex) => {
    if (!selectedClassroom) return teachers;
    
    return getAvailableTeachers(dayIndex, periodIndex, parseInt(selectedClassroom));
  };

  // Function to validate teacher assignment
  const validateTeacherAssignment = (dayIndex, periodIndex, teacherId) => {
    if (!selectedClassroom || !teacherId) return true;
    
    return isTeacherAvailable(parseInt(teacherId), dayIndex, periodIndex, parseInt(selectedClassroom));
  };

  // Enhanced update schedule with validation
  const handleUpdateSchedule = (dayIndex, periodIndex, teacherId, subject) => {
    // If clearing the assignment (empty teacherId), allow it
    if (!teacherId) {
      updateSchedule(parseInt(selectedClassroom), dayIndex, periodIndex, teacherId, subject);
      return;
    }

    // Validate teacher availability
    if (validateTeacherAssignment(dayIndex, periodIndex, teacherId)) {
      updateSchedule(parseInt(selectedClassroom), dayIndex, periodIndex, teacherId, subject);
    } else {
      // Show alert or handle conflict
      alert('This teacher is already assigned to another class at this time slot!');
    }
  };

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
        
        {selectedClassroom && (
          <div className="text-sm text-gray-600">
            Showing schedule for {classrooms.find(c => c.id === parseInt(selectedClassroom))?.name}
          </div>
        )}
      </div>

      {selectedClassroom && schedules[selectedClassroom] && (
        <div className="space-y-4">
          {/* Legend/Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Schedule Information</h3>
            <p className="text-xs text-blue-600">
              Only available teachers are shown in the dropdown for each time slot to prevent scheduling conflicts.
            </p>
          </div>

          <ScheduleTable
            scheduleData={schedules[selectedClassroom]}
            days={days}
            periods={periods}
            teachers={teachers}
            subjects={subjects}
            onUpdateSchedule={handleUpdateSchedule}
            getTeachersForTimeSlot={getTeachersForTimeSlot}
            validateTeacherAssignment={validateTeacherAssignment}
            type="classroom"
          />
        </div>
      )}

      {selectedClassroom && !schedules[selectedClassroom] && (
        <div className="text-center py-8 text-gray-500">
          <p>No schedule data found for this classroom.</p>
        </div>
      )}

      {!selectedClassroom && (
        <div className="text-center py-12 text-gray-500">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium mb-2">Select a Classroom</h3>
            <p className="text-sm">
              Choose a classroom from the dropdown above to view and edit its schedule.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomScheduleView;