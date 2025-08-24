import React from 'react';


const getTeacherAvailabilityGrid = (
  teacherId,
  currentDayIndex,
  currentPeriodIndex,
  days,
  periods,
  schedules,
  classrooms
) => {
  const grid = Array(days.length).fill().map(() => Array(periods.length).fill(false));

  // Convert teacherId to number for comparison if it's a string
  const targetTeacherId = typeof teacherId === 'string' ? parseInt(teacherId) : teacherId;

  // Check availability for each time slot across all classrooms
  for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    for (let periodIndex = 0; periodIndex < periods.length; periodIndex++) {
      let isAvailable = true;
      let assignedToClassroom = null;
      let assignedSubject = null;

      // Check all classrooms for this specific time slot
      Object.keys(schedules).forEach(classroomId => {
        const classroomSchedule = schedules[classroomId];
        if (classroomSchedule && Array.isArray(classroomSchedule)) {
          const daySchedule = classroomSchedule[dayIndex];
          if (Array.isArray(daySchedule)) {
            const period = daySchedule[periodIndex];
            if (period) {
              const periodTeacherId = period?.teacherId || period?.teacher_id || null;
              const periodTeacherIdNum = typeof periodTeacherId === 'string' ? parseInt(periodTeacherId) : periodTeacherId;

              if (periodTeacherIdNum === targetTeacherId && periodTeacherIdNum !== null && !isNaN(periodTeacherIdNum)) {
                isAvailable = false;
                assignedToClassroom = classrooms.find(c => c.id === parseInt(classroomId))?.name || `Classroom ${classroomId}`;
                assignedSubject = period.subject || 'Unknown Subject';
              }
            }
          }
        }
      });

      grid[dayIndex][periodIndex] = {
        isBooked: !isAvailable,
        className: assignedToClassroom,
        subject: assignedSubject,
        isCurrentSlot: dayIndex === currentDayIndex && periodIndex === currentPeriodIndex,
      };
    }
  }

  return grid;
};

export const TeacherScheduleGrid = ({
  teacher,
  position,
  currentDayIndex,
  currentPeriodIndex,
  setHoveredTeacher,
  days,
  periods,
  schedules,
  classrooms,
  teachers
}) => {
  // ✅ Pass props into helper
  const scheduleGrid = getTeacherAvailabilityGrid(
    teacher.id,
    currentDayIndex,
    currentPeriodIndex,
    days,
    periods,
    schedules,
    classrooms
  );

  const totalAssignments = scheduleGrid.flat().filter(slot => slot.isBooked).length;

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-80 pointer-events-none"
      style={{
        left: Math.min(position.x + 10, window.innerWidth - 320),
        top: Math.max(position.y - 50, 10),
        maxHeight: '400px',
        overflowY: 'auto'
      }}
      onMouseLeave={() => setHoveredTeacher(null)}
    >
      
        <div className="mb-2">
          <h4 className="font-semibold text-sm text-gray-800">{teacher.name}'s Weekly Availability</h4>
          <p className="text-xs text-gray-600">
            Subjects: {teacher.subjects?.join(', ') || 'All subjects'}
          </p>
          <p className="text-xs text-blue-600">
            Current slot: {days[currentDayIndex]} - Period {currentPeriodIndex + 1}
          </p>
          <p className="text-xs text-red-600">
            Total occupied slots: {totalAssignments}
          </p>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs">
          {/* Header */}
          <div className="font-semibold text-gray-700 text-center py-1">Day/Period</div>
          {periods.map((period, idx) => (
            <div key={idx} className="font-semibold text-gray-700 text-center p-1 bg-gray-50 rounded">
              P{idx + 1}
            </div>
          ))}
          
          {/* Schedule Grid */}
          {days.map((day, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <div className="font-semibold text-gray-700 text-center p-1 bg-gray-100 rounded">
                {day.slice(0, 3)}
              </div>
              {periods.map((_, periodIndex) => {
                const slot = scheduleGrid[dayIndex][periodIndex]
                return (
                  <div
                    key={`${dayIndex}-${periodIndex}`}
                    className={`
                      h-8 w-8 rounded border text-center flex items-center justify-center cursor-help relative
                      ${slot.isCurrentSlot 
                        ? 'bg-blue-500 text-white border-blue-600 shadow-lg ring-2 ring-blue-300' 
                        : slot.isBooked 
                          ? 'bg-red-500 text-white border-red-600 shadow-sm' 
                          : 'bg-green-100 text-green-800 border-green-300'
                      }
                    `}
                    title={
                      slot.isCurrentSlot
                        ? `Current slot: ${days[dayIndex]} Period ${periodIndex + 1}${slot.isBooked ? ` - Busy: ${slot.className} - ${slot.subject}` : ' - Available'}`
                        : slot.isBooked 
                          ? `Busy: ${slot.className} - ${slot.subject}` 
                          : 'Available'
                    }
                  >
                    {slot.isCurrentSlot ? '●' : slot.isBooked ? '✕' : '✓'}
                    {slot.isCurrentSlot && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                    )}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-3 flex items-center gap-3 text-xs border-t pt-2 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded relative">
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="text-gray-600">Current slot</span>
          </div>
        </div>
      </div>
    )
  }