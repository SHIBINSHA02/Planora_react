// src/components/ScheduleTable.jsx
import React from 'react';

const ScheduleTable = ({
  scheduleData,
  days,
  periods,
  teachers = [],
  subjects = [],
  onUpdateSchedule,
  getTeachersForTimeSlot,
  type = 'classroom',
  classroom // needed for grade
}) => {
  const renderClassroomCell = (cell, rowIndex, colIndex) => {
    // Recompute available teachers based on subject + grade
    const availableTeachers = getTeachersForTimeSlot
      ? getTeachersForTimeSlot(rowIndex, colIndex, classroom?.grade, cell.subject)
      : teachers;

    return (
      <div className="space-y-1">
        {/* Teacher dropdown */}
        <select
          value={cell.teacherId || ''}
          onChange={(e) => {
            const teacherId = e.target.value;
            onUpdateSchedule(rowIndex, colIndex, teacherId, cell.subject);
          }}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Teacher</option>
          {availableTeachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>

        {/* Subject dropdown */}
        <select
          value={cell.subject || ''}
          onChange={(e) => {
            const newSubject = e.target.value;
            // 🔑 Reset teacher when subject changes, because old teacher may not match new subject
            onUpdateSchedule(rowIndex, colIndex, '', newSubject);
          }}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        {/* Availability info */}
        {getTeachersForTimeSlot && (
          <div className="text-xs text-gray-500">
            {availableTeachers.length} teacher
            {availableTeachers.length !== 1 ? 's' : ''} available
          </div>
        )}
      </div>
    );
  };

  const renderTeacherCell = (cell) => {
    if (cell) {
      return (
        <div className="bg-blue-100 p-2 rounded text-xs">
          <div className="font-semibold text-blue-800">{cell.classroom}</div>
          <div className="text-blue-600">{cell.subject}</div>
          <div className="text-blue-500">{cell.grade}</div>
        </div>
      );
    }
    return <div className="text-gray-400 text-xs">Free</div>;
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              Day / Period
            </th>
            {periods.map((period, index) => (
              <th
                key={index}
                className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700"
              >
                {period}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData &&
            scheduleData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 bg-gray-100">
                  {days[rowIndex]}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="border border-gray-300 p-2 text-center"
                  >
                    {type === 'classroom'
                      ? renderClassroomCell(cell, rowIndex, colIndex)
                      : renderTeacherCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(ScheduleTable);
