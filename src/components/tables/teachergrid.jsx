// src/components/tables/teachergrid.jsx
import React, { useMemo, useCallback } from 'react';

/**
 * Enhanced function to get teacher availability grid with proper live data extraction
 */
const getTeacherAvailabilityGrid = (
  teacherId,
  currentDayIndex,
  currentPeriodIndex,
  days,
  periods,
  schedules,
  classrooms
) => {
  // Initialize grid with default availability
  const grid = Array(days.length).fill().map(() => 
    Array(periods.length).fill().map(() => ({
      isBooked: false,
      className: null,
      subject: null,
      isCurrentSlot: false,
    }))
  );

  // Ensure teacherId is a number for consistent comparison
  const targetTeacherId = parseInt(teacherId);
  
  // Validate inputs
  if (!targetTeacherId || isNaN(targetTeacherId) || !schedules || !Array.isArray(days) || !Array.isArray(periods)) {
    console.warn('Invalid inputs for teacher availability grid');
    return grid;
  }

  // Process each time slot across all days and periods
  for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    for (let periodIndex = 0; periodIndex < periods.length; periodIndex++) {
      let isBooked = false;
      let assignedClassroom = null;
      let assignedSubject = null;

      // Check all classroom schedules for this time slot
      Object.entries(schedules).forEach(([classroomId, classroomSchedule]) => {
        try {
          // Handle different schedule data structures
          let daySchedule = null;
          
          if (Array.isArray(classroomSchedule)) {
            // Direct array format: schedules[classroomId][dayIndex][periodIndex]
            daySchedule = classroomSchedule[dayIndex];
          } else if (classroomSchedule && typeof classroomSchedule === 'object') {
            // Object format with day keys
            const dayKey = days[dayIndex];
            daySchedule = classroomSchedule[dayKey] || classroomSchedule[dayKey.toLowerCase()];
          }

          if (daySchedule && Array.isArray(daySchedule)) {
            const periodData = daySchedule[periodIndex];
            
            if (periodData) {
              // Handle different property naming conventions
              let periodTeacherId = null;
              if (periodData.teacherId !== undefined) {
                periodTeacherId = periodData.teacherId;
              } else if (periodData.teacher_id !== undefined) {
                periodTeacherId = periodData.teacher_id;
              } else if (periodData.teacher !== undefined) {
                periodTeacherId = typeof periodData.teacher === 'object' 
                  ? periodData.teacher.id 
                  : periodData.teacher;
              }

              // Convert to number for comparison
              const periodTeacherIdNum = parseInt(periodTeacherId);

              // Check if this teacher is assigned to this slot
              if (periodTeacherIdNum === targetTeacherId && !isNaN(periodTeacherIdNum)) {
                isBooked = true;
                
                // Find classroom name
                const classroom = classrooms?.find(c => parseInt(c.id) === parseInt(classroomId));
                assignedClassroom = classroom?.name || classroom?.className || `Classroom ${classroomId}`;
                
                // Get subject
                assignedSubject = periodData.subject || periodData.subjectName || 'Unknown Subject';
              }
            }
          }
        } catch (error) {
          console.warn(`Error processing schedule for classroom ${classroomId}:`, error);
        }
      });

      // Set grid data for this slot
      grid[dayIndex][periodIndex] = {
        isBooked,
        className: assignedClassroom,
        subject: assignedSubject,
        isCurrentSlot: dayIndex === currentDayIndex && periodIndex === currentPeriodIndex,
      };
    }
  }

  return grid;
};

/**
 * Enhanced Teacher Schedule Grid component with memoization for performance
 */
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
  // Memoize the schedule grid calculation to prevent unnecessary recalculations
  const scheduleGrid = useMemo(() => {
    if (!teacher?.id || !schedules) return [];
    
    return getTeacherAvailabilityGrid(
      teacher.id,
      currentDayIndex,
      currentPeriodIndex,
      days,
      periods,
      schedules,
      classrooms
    );
  }, [
    teacher?.id,
    currentDayIndex,
    currentPeriodIndex,
    days,
    periods,
    schedules,
    classrooms
  ]);

  // Calculate total assignments with memoization
  const totalAssignments = useMemo(() => {
    return scheduleGrid.flat().filter(slot => slot.isBooked).length;
  }, [scheduleGrid]);

  // Handle mouse leave with useCallback to prevent unnecessary re-renders
  const handleMouseLeave = useCallback(() => {
    setHoveredTeacher(null);
  }, [setHoveredTeacher]);

  // Calculate position to ensure tooltip stays within viewport
  const tooltipStyle = useMemo(() => ({
    left: Math.min(position.x + 10, window.innerWidth - 350),
    top: Math.max(position.y - 50, 10),
    maxHeight: '450px',
    overflowY: 'auto'
  }), [position.x, position.y]);

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 min-w-80 pointer-events-auto"
      style={tooltipStyle}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header Information */}
      <div className="mb-3 border-b pb-2">
        <h4 className="font-semibold text-base text-gray-800 mb-1">
          {teacher.name}'s Weekly Schedule
        </h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p>Subjects: {teacher.subjects?.join(', ') || 'All subjects'}</p>
          <p className="text-blue-600 font-medium">
            Current: {days[currentDayIndex]} - Period {currentPeriodIndex + 1}
          </p>
          <p className="text-red-600 font-medium">
            Occupied slots: {totalAssignments}/{days.length * periods.length}
          </p>
        </div>
      </div>
      
      {/* Schedule Grid */}
      <div className="grid gap-1 text-xs" style={{ gridTemplateColumns: `80px repeat(${periods.length}, 32px)` }}>
        {/* Header Row */}
        <div className="font-semibold text-gray-700 text-center py-2">Day/Period</div>
        {periods.map((period, idx) => (
          <div key={idx} className="font-semibold text-gray-700 text-center p-2 bg-gray-50 rounded text-xs">
            P{idx + 1}
          </div>
        ))}
        
        {/* Schedule Rows */}
        {days.map((day, dayIndex) => (
          <React.Fragment key={dayIndex}>
            <div className="font-semibold text-gray-700 text-center p-2 bg-gray-100 rounded text-xs flex items-center justify-center">
              {day.slice(0, 3)}
            </div>
            {periods.map((_, periodIndex) => {
              const slot = scheduleGrid[dayIndex]?.[periodIndex] || { 
                isBooked: false, 
                isCurrentSlot: false,
                className: null,
                subject: null 
              };
              
              return (
                <div
                  key={`${dayIndex}-${periodIndex}`}
                  className={`
                    h-8 w-8 rounded border text-center flex items-center justify-center cursor-help relative transition-all duration-200
                    ${slot.isCurrentSlot 
                      ? 'bg-blue-500 text-white border-blue-600 shadow-lg ring-2 ring-blue-300 scale-110' 
                      : slot.isBooked 
                        ? 'bg-red-500 text-white border-red-600 shadow-sm hover:bg-red-600' 
                        : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                    }
                  `}
                  title={
                    slot.isCurrentSlot
                      ? `Current slot: ${days[dayIndex]} Period ${periodIndex + 1}${slot.isBooked ? ` - Assigned: ${slot.className} (${slot.subject})` : ' - Available'}`
                      : slot.isBooked 
                        ? `Assigned: ${slot.className} - ${slot.subject}` 
                        : `Available: ${days[dayIndex]} Period ${periodIndex + 1}`
                  }
                >
                  {slot.isCurrentSlot ? '●' : slot.isBooked ? '✕' : '✓'}
                  {slot.isCurrentSlot && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded relative">
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="text-gray-600">Current slot</span>
          </div>
        </div>
        
        {/* Workload indicator */}
        <div className="mt-2 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">Weekly workload:</span>
            <span className={`font-medium ${
              totalAssignments > (days.length * periods.length * 0.8) ? 'text-red-600' :
              totalAssignments > (days.length * periods.length * 0.6) ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {Math.round((totalAssignments / (days.length * periods.length)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                totalAssignments > (days.length * periods.length * 0.8) ? 'bg-red-500' :
                totalAssignments > (days.length * periods.length * 0.6) ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${(totalAssignments / (days.length * periods.length)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherScheduleGrid;