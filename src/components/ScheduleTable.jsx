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
  getSubjectsForTeacher,
  type = 'classroom',
  classroom
}) => {
  const renderClassroomCell = (cell, rowIndex, colIndex) => {
    console.log('Rendering cell:', { cell, rowIndex, colIndex, classroom }); // Debug log

    // Ensure cell is an object with default values
    const safeCell = cell || { teacher: '', subject: '', teacherId: null };

    // Recompute available teachers based on subject + grade + current time slot
    let availableTeachers = [];
    
    if (getTeachersForTimeSlot && classroom?.grade) {
      availableTeachers = getTeachersForTimeSlot(rowIndex, colIndex, classroom.grade, safeCell.subject);
    } else if (classroom?.grade) {
      // Fallback filtering if getTeachersForTimeSlot is not available
      availableTeachers = teachers.filter(teacher => 
        teacher.classes && teacher.classes.includes(classroom.grade)
      );
    } else {
      availableTeachers = teachers;
    }

    console.log('Available teachers:', availableTeachers); // Debug log

    // Get available subjects based on selected teacher and grade
    let availableSubjects = [];
    
    if (safeCell.teacherId && getSubjectsForTeacher && classroom?.grade) {
      availableSubjects = getSubjectsForTeacher(safeCell.teacherId, classroom.grade, rowIndex, colIndex);
    } else {
      availableSubjects = subjects;
    }

    console.log('Available subjects:', availableSubjects); // Debug log

    const handleTeacherChange = (teacherId) => {
      console.log('Teacher change:', teacherId); // Debug log
      
      // When teacher changes, keep subject if it's valid for the new teacher
      let newSubject = safeCell.subject || '';
      
      if (teacherId && getSubjectsForTeacher && classroom?.grade) {
        const teacherSubjects = getSubjectsForTeacher(teacherId, classroom.grade, rowIndex, colIndex);
        // Reset subject if current subject is not available for the new teacher
        if (newSubject && !teacherSubjects.includes(newSubject)) {
          newSubject = '';
        }
      }
      
      onUpdateSchedule(rowIndex, colIndex, teacherId, newSubject);
    };

    const handleSubjectChange = (newSubject) => {
      console.log('Subject change:', newSubject); // Debug log
      
      // When subject changes, reset teacher if current teacher can't teach this subject
      let teacherId = safeCell.teacherId || '';
      
      if (newSubject && getTeachersForTimeSlot && classroom?.grade) {
        const subjectTeachers = getTeachersForTimeSlot(rowIndex, colIndex, classroom.grade, newSubject);
        const currentTeacherCanTeach = teacherId && subjectTeachers.some(t => t.id == teacherId);
        
        // Reset teacher if current teacher can't teach the new subject
        if (!currentTeacherCanTeach) {
          teacherId = '';
        }
      }
      
      onUpdateSchedule(rowIndex, colIndex, teacherId, newSubject);
    };

    return (
      <div className="space-y-1">
        {/* Teacher dropdown */}
        <select
          value={safeCell.teacherId || ''}
          onChange={(e) => handleTeacherChange(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={!availableTeachers || availableTeachers.length === 0}
        >
          <option value="">Select Teacher</option>
          {availableTeachers && Array.isArray(availableTeachers) && availableTeachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>

        {/* Subject dropdown */}
        <select
          value={safeCell.subject || ''}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={!availableSubjects || availableSubjects.length === 0}
        >
          <option value="">Select Subject</option>
          {availableSubjects && Array.isArray(availableSubjects) && availableSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        {/* Availability info */}
        <div className="text-xs text-gray-500 space-y-0.5">
          {getTeachersForTimeSlot && availableTeachers && Array.isArray(availableTeachers) && (
            <div>
              {availableTeachers.length} teacher
              {availableTeachers.length !== 1 ? 's' : ''} available
            </div>
          )}
          {getSubjectsForTeacher && safeCell.teacherId && availableSubjects && Array.isArray(availableSubjects) && (
            <div>
              {availableSubjects.length} subject
              {availableSubjects.length !== 1 ? 's' : ''} available
            </div>
          )}
          {(!availableTeachers || !Array.isArray(availableTeachers) || availableTeachers.length === 0) && (
            <div className="text-red-500">No teachers available</div>
          )}
          {(!availableSubjects || !Array.isArray(availableSubjects) || availableSubjects.length === 0) && safeCell.teacherId && (
            <div className="text-red-500">No subjects available</div>
          )}
        </div>
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