// src/components/ClassroomScheduleView.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ScheduleTable from './ScheduleTable';

const ClassroomScheduleView = ({
  classrooms,
  teachers,
  schedules,
  selectedClassroom,
  setSelectedClassroom,
  getAvailableTeachers,
  getTeachersForSubject,
  getSubjectsForClass,
  getTeachersForTimeSlot,  // New function from hook
  getSubjectsForTeacher,   // New function from hook
  isTeacherAvailable,
  updateSchedule,
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

  // Get current classroom details
  const getCurrentClassroom = () => {
    if (!selectedClassroom) return null;
    return classrooms.find(c => c.id === parseInt(selectedClassroom));
  };

  // Get subjects available for the selected classroom
  const getAvailableSubjects = () => {
    const classroom = getCurrentClassroom();
    if (!classroom) return [];
    return getSubjectsForClass(classroom.grade);
  };

  // Wrapper function for ScheduleTable - passes the correct parameters
  const getTeachersForTimeSlotWrapper = (dayIndex, periodIndex, grade, selectedSubject = null) => {
    // Use the new function from the hook
    return getTeachersForTimeSlot(dayIndex, periodIndex, grade, selectedSubject);
  };

  // Wrapper function for getting subjects for teacher
  const getSubjectsForTeacherWrapper = (teacherId, grade, dayIndex = null, periodIndex = null) => {
    return getSubjectsForTeacher(teacherId, grade, dayIndex, periodIndex);
  };

  // Function to get teachers who can teach a specific subject to current classroom
  const getTeachersForCurrentClassSubject = (subject) => {
    const classroom = getCurrentClassroom();
    if (!classroom) return [];
    
    return getTeachersForSubject(classroom.grade, subject);
  };

  // Function to validate teacher assignment
  const validateTeacherAssignment = (dayIndex, periodIndex, teacherId, subject) => {
    if (!selectedClassroom || !teacherId) return true;
    
    const classroom = getCurrentClassroom();
    const teacher = teachers.find(t => t.id === parseInt(teacherId));
    
    if (!teacher || !classroom) return false;
    
    // Check if teacher can teach this subject
    if (subject && !teacher.subjects.includes(subject)) return false;
    
    // Check if teacher can teach this class
    if (!teacher.classes.includes(classroom.grade)) return false;
    
    // Check if teacher is available at this time
    return isTeacherAvailable(parseInt(teacherId), dayIndex, periodIndex, parseInt(selectedClassroom));
  };

  // Enhanced update schedule with validation
  const handleUpdateSchedule = (dayIndex, periodIndex, teacherId, subject) => {
    const classroom = getCurrentClassroom();
    
    if (!classroom) {
      console.error('No classroom selected');
      return false;
    }

    // Validate the assignment
    if (teacherId && subject && !validateTeacherAssignment(dayIndex, periodIndex, teacherId, subject)) {
      console.warn('Invalid teacher assignment');
      return false;
    }

    // Check if subject is valid for this class
    if (subject) {
      const validSubjects = getSubjectsForClass(classroom.grade);
      if (!validSubjects.includes(subject)) {
        console.warn(`Subject ${subject} is not valid for class ${classroom.grade}`);
        return false;
      }
    }

    return updateSchedule(parseInt(selectedClassroom), dayIndex, periodIndex, teacherId, subject);
  };

  // Get classroom statistics
  const getClassroomStats = () => {
    const classroom = getCurrentClassroom();
    if (!classroom || !schedules[selectedClassroom]) return null;

    const schedule = schedules[selectedClassroom];
    let totalSlots = 0;
    let filledSlots = 0;
    let subjectCount = {};
    let teacherCount = {};

    schedule.forEach(day => {
      day.forEach(period => {
        totalSlots++;
        if (period.teacherId) {
          filledSlots++;
          subjectCount[period.subject] = (subjectCount[period.subject] || 0) + 1;
          teacherCount[period.teacher] = (teacherCount[period.teacher] || 0) + 1;
        }
      });
    });

    return {
      totalSlots,
      filledSlots,
      completionPercentage: Math.round((filledSlots / totalSlots) * 100),
      subjectCount,
      teacherCount
    };
  };

  const currentClassroom = getCurrentClassroom();
  const availableSubjects = getAvailableSubjects();
  const stats = getClassroomStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
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
          
          {currentClassroom && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentClassroom.name}</span>
              <span className="mx-2">•</span>
              <span>Grade: {currentClassroom.grade}</span>
              <span className="mx-2">•</span>
              <span>Division: {currentClassroom.division}</span>
            </div>
          )}
        </div>

        {stats && (
          <div className="text-sm text-gray-600">
            Schedule Completion: 
            <span className={`ml-1 font-medium ${
              stats.completionPercentage >= 80 ? 'text-green-600' : 
              stats.completionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {stats.completionPercentage}%
            </span>
            <span className="ml-1">({stats.filledSlots}/{stats.totalSlots})</span>
          </div>
        )}
      </div>

      {selectedClassroom && schedules[selectedClassroom] && (
        <div className="space-y-4">
          {/* Class Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subjects Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Subjects for {currentClassroom?.grade}
              </h3>
              <div className="flex flex-wrap gap-1">
                {availableSubjects.map(subject => (
                  <span 
                    key={subject}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Teachers Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                Available Teachers
              </h3>
              <div className="text-xs text-green-600">
                {teachers.filter(t => t.classes.includes(currentClassroom?.grade)).length} teachers 
                can teach this class
              </div>
              {stats && Object.keys(stats.teacherCount).length > 0 && (
                <div className="mt-2 text-xs text-green-700">
                  Currently assigned: {Object.keys(stats.teacherCount).join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Scheduling Rules</h3>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Only teachers qualified for this class and subject are shown</li>
              <li>• Teachers cannot be assigned to multiple classes at the same time</li>
              <li>• Subjects are limited to the curriculum for {currentClassroom?.grade}</li>
              <li>• Selecting a teacher will filter subjects to what they can teach</li>
              <li>• Selecting a subject will filter teachers to those qualified</li>
            </ul>
          </div>

          <ScheduleTable
            scheduleData={schedules[selectedClassroom]}
            days={days}
            periods={periods}
            teachers={teachers}
            subjects={availableSubjects}
            onUpdateSchedule={handleUpdateSchedule}
            getTeachersForTimeSlot={getTeachersForTimeSlotWrapper}
            getSubjectsForTeacher={getSubjectsForTeacherWrapper}
            type="classroom"
            classroom={currentClassroom} // Pass full classroom object
          />

          {/* Schedule Statistics */}
          {stats && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Schedule Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject Distribution */}
                {Object.keys(stats.subjectCount).length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Subject Distribution</h4>
                    <div className="space-y-1">
                      {Object.entries(stats.subjectCount).map(([subject, count]) => (
                        <div key={subject} className="flex justify-between text-xs">
                          <span className="text-gray-600">{subject}</span>
                          <span className="font-medium">{count} periods</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teacher Workload */}
                {Object.keys(stats.teacherCount).length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Teacher Workload</h4>
                    <div className="space-y-1">
                      {Object.entries(stats.teacherCount).map(([teacher, count]) => (
                        <div key={teacher} className="flex justify-between text-xs">
                          <span className="text-gray-600">{teacher}</span>
                          <span className="font-medium">{count} periods</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
            <p className="text-xs mt-2 text-gray-400">
              Each classroom has specific subjects and qualified teachers based on the grade level.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

ClassroomScheduleView.propTypes = {
  classrooms: PropTypes.array.isRequired,
  teachers: PropTypes.array.isRequired,
  schedules: PropTypes.object.isRequired,
  selectedClassroom: PropTypes.string.isRequired,
  setSelectedClassroom: PropTypes.func.isRequired,
  updateSchedule: PropTypes.func.isRequired,
  getAvailableTeachers: PropTypes.func.isRequired,
  getTeachersForSubject: PropTypes.func.isRequired,
  getSubjectsForClass: PropTypes.func.isRequired,
  getTeachersForTimeSlot: PropTypes.func.isRequired,  // Added
  getSubjectsForTeacher: PropTypes.func.isRequired,   // Added
  isTeacherAvailable: PropTypes.func.isRequired,
};

export default ClassroomScheduleView;