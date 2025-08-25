// src/components/tables/teachergrid.jsx
import React, { useMemo, useCallback } from 'react';

/**
 * Enhanced function to get teacher availability grid using teacherSchedules data structure
 */
const getTeacherAvailabilityGrid = (
  teacherId,
  currentDayIndex,
  currentPeriodIndex,
  days,
  periods,
  teacherSchedules
) => {
  // Initialize grid with default availability
  const grid = Array(days.length).fill().map(() => 
    Array(periods.length).fill().map(() => ({
      isBooked: false,
      className: null,
      subject: null,
      grade: null,
      isCurrentSlot: false,
    }))
  );

  // Ensure teacherId is a number for consistent comparison
  const targetTeacherId = parseInt(teacherId);
  
  // Validate inputs
  if (!targetTeacherId || isNaN(targetTeacherId) || !teacherSchedules || !Array.isArray(days) || !Array.isArray(periods)) {
    console.warn('Invalid inputs for teacher availability grid');
    return grid;
  }

  // Get teacher's schedule directly from teacherSchedules
  const teacherSchedule = teacherSchedules[targetTeacherId];
  
  if (!teacherSchedule) {
    console.warn(`No schedule found for teacher ID: ${targetTeacherId}`);
    return grid;
  }

  // Process each time slot using teacher's schedule
  for (let dayIndex = 0; dayIndex < days.length && dayIndex < teacherSchedule.length; dayIndex++) {
    const daySchedule = teacherSchedule[dayIndex];
    
    if (!daySchedule || !Array.isArray(daySchedule)) {
      continue;
    }

    for (let periodIndex = 0; periodIndex < periods.length && periodIndex < daySchedule.length; periodIndex++) {
      const periodData = daySchedule[periodIndex];
      
      // Set grid data for this slot
      grid[dayIndex][periodIndex] = {
        isBooked: !!(periodData && periodData.classroomId),
        className: periodData?.classroomName || null,
        subject: periodData?.subject || null,
        grade: periodData?.grade || null,
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
  teacherSchedules, // Changed from schedules + classrooms to teacherSchedules
  teachers
}) => {
  // Memoize the schedule grid calculation to prevent unnecessary recalculations
  const scheduleGrid = useMemo(() => {
    if (!teacher?.id || !teacherSchedules) return [];
    
    return getTeacherAvailabilityGrid(
      teacher.id,
      currentDayIndex,
      currentPeriodIndex,
      days,
      periods,
      teacherSchedules
    );
  }, [
    teacher?.id,
    currentDayIndex,
    currentPeriodIndex,
    days,
    periods,
    teacherSchedules
  ]);

  // Calculate total assignments with memoization
  const totalAssignments = useMemo(() => {
    return scheduleGrid.flat().filter(slot => slot.isBooked).length;
  }, [scheduleGrid]);

  // Calculate workload statistics
  const workloadStats = useMemo(() => {
    const totalSlots = days.length * periods.length;
    const percentage = Math.round((totalAssignments / totalSlots) * 100);
    const subjectCounts = {};
    const gradeCounts = {};

    scheduleGrid.flat().forEach(slot => {
      if (slot.isBooked) {
        if (slot.subject) {
          subjectCounts[slot.subject] = (subjectCounts[slot.subject] || 0) + 1;
        }
        if (slot.grade) {
          gradeCounts[slot.grade] = (gradeCounts[slot.grade] || 0) + 1;
        }
      }
    });

    return {
      totalSlots,
      percentage,
      subjectCounts,
      gradeCounts,
      mostTaughtSubject: Object.keys(subjectCounts).length > 0 
        ? Object.entries(subjectCounts).sort(([,a], [,b]) => b - a)[0][0]
        : null,
      mostTaughtGrade: Object.keys(gradeCounts).length > 0
        ? Object.entries(gradeCounts).sort(([,a], [,b]) => b - a)[0][0]
        : null
    };
  }, [scheduleGrid, days.length, periods.length, totalAssignments]);

  // Handle mouse leave with useCallback to prevent unnecessary re-renders
  const handleMouseLeave = useCallback(() => {
    setHoveredTeacher(null);
  }, [setHoveredTeacher]);

  // Calculate position to ensure tooltip stays within viewport
  const tooltipStyle = useMemo(() => ({
    left: Math.min(position.x + 10, window.innerWidth - 380),
    top: Math.max(position.y - 50, 10),
    maxHeight: '500px',
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
          <p><strong>Qualified subjects:</strong> {teacher.subjects?.join(', ') || 'All subjects'}</p>
          <p><strong>Can teach grades:</strong> {teacher.classes?.join(', ') || 'All grades'}</p>
          {workloadStats.mostTaughtSubject && (
            <p><strong>Primary subject:</strong> {workloadStats.mostTaughtSubject}</p>
          )}
          {workloadStats.mostTaughtGrade && (
            <p><strong>Primary grade:</strong> {workloadStats.mostTaughtGrade}</p>
          )}
          <p className="text-blue-600 font-medium">
            <strong>Current:</strong> {days[currentDayIndex]} - Period {currentPeriodIndex + 1}
          </p>
          <p className="text-red-600 font-medium">
            <strong>Occupied slots:</strong> {totalAssignments}/{workloadStats.totalSlots} ({workloadStats.percentage}%)
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
                subject: null,
                grade: null 
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
                      ? `Current slot: ${days[dayIndex]} Period ${periodIndex + 1}${
                          slot.isBooked 
                            ? ` - Teaching: ${slot.subject} to Grade ${slot.grade} (${slot.className})` 
                            : ' - Available'
                        }`
                      : slot.isBooked 
                        ? `Teaching: ${slot.subject} - Grade ${slot.grade} (${slot.className})` 
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
      
      {/* Enhanced Statistics Section */}
      <div className="mt-4 pt-3 border-t space-y-3">
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Teaching</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded relative">
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="text-gray-600">Current slot</span>
          </div>
        </div>
        
        {/* Workload indicator */}
        <div className="text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">Weekly workload:</span>
            <span className={`font-medium ${
              workloadStats.percentage > 80 ? 'text-red-600' :
              workloadStats.percentage > 60 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {workloadStats.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                workloadStats.percentage > 80 ? 'bg-red-500' :
                workloadStats.percentage > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${workloadStats.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Subject Distribution */}
        {Object.keys(workloadStats.subjectCounts).length > 0 && (
          <div className="text-xs">
            <p className="text-gray-600 mb-1">Subject distribution:</p>
            <div className="space-y-1">
              {Object.entries(workloadStats.subjectCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([subject, count]) => (
                  <div key={subject} className="flex justify-between items-center">
                    <span className="text-gray-700">{subject}</span>
                    <span className="text-gray-500">{count} periods</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Grade Distribution */}
        {Object.keys(workloadStats.gradeCounts).length > 0 && (
          <div className="text-xs">
            <p className="text-gray-600 mb-1">Grade distribution:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(workloadStats.gradeCounts)
                .sort(([,a], [,b]) => b - a)
                .map(([grade, count]) => (
                  <span key={grade} className="bg-gray-100 px-2 py-1 rounded text-xs">
                    Grade {grade}: {count}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherScheduleGrid;