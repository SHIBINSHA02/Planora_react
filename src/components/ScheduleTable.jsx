// src/components/ScheduleTable.jsx
"use client"

import React, { useState, useRef, useEffect } from "react"

const ScheduleTable = ({
  scheduleData,
  days,
  periods,
  teachers = [],
  subjects = [],
  onUpdateSchedule,
  getTeachersForTimeSlot,
  getTeacherTimetable, // Add this prop from useScheduleData hook
  type = "classroom",
  classroom,
}) => {
  const [isMultiSelect, setIsMultiSelect] = useState(false)
  const [isMultiAssign, setIsMultiAssign] = useState(false)
  const [hoveredTeacher, setHoveredTeacher] = useState(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })

  // Teacher Schedule Grid Component
  const TeacherScheduleGrid = ({ 
    teacher, 
    position, 
    currentDayIndex, 
    currentPeriodIndex,
    setHoveredTeacher
  }) => {
    
    // Get teacher's timetable using the hook function
    const teacherTimetable = getTeacherTimetable ? getTeacherTimetable(teacher.id) : [];
    
    // Convert timetable to grid format with current slot highlighting
    const scheduleGrid = teacherTimetable.map((daySchedule, dayIndex) => 
      daySchedule.map((periodSlot, periodIndex) => ({
        isBooked: periodSlot !== null,
        isCurrentSlot: dayIndex === currentDayIndex && periodIndex === currentPeriodIndex,
        className: periodSlot?.classroom || null,
        subject: periodSlot?.subject || null,
        grade: periodSlot?.grade || null,
        division: periodSlot?.division || null
      }))
    );
    
    // Count total assignments for this teacher
    const totalAssignments = scheduleGrid.flat().filter(slot => slot.isBooked).length;
    
    // Get current slot status
    const currentSlot = scheduleGrid[currentDayIndex]?.[currentPeriodIndex];
    
    return (
      <div 
        className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-80 pointer-events-auto"
        style={{
          left: Math.min(position.x + 10, window.innerWidth - 320),
          top: Math.max(position.y - 50, 10),
          maxHeight: '400px',
          overflowY: 'auto'
        }}
        onMouseEnter={() => {
          // Keep the grid visible when hovering over it
        }}
        onMouseLeave={() => {
          if (setHoveredTeacher) {
            setHoveredTeacher(null);
          }
        }}
      >
        <div className="mb-2">
          <h4 className="font-semibold text-sm text-gray-800">{teacher.name}'s Weekly Schedule</h4>
          <p className="text-xs text-gray-600">
            Subjects: {teacher.subjects?.length > 0 ? teacher.subjects.join(', ') : 'All subjects'}
          </p>
          <p className="text-xs text-gray-600">
            Classes: {teacher.classes?.length > 0 ? teacher.classes.join(', ') : 'All classes'}
          </p>
          <p className="text-xs text-blue-600">
            Current slot: {days[currentDayIndex]} - {periods[currentPeriodIndex]}
            {currentSlot?.isBooked && (
              <span className="ml-1 text-red-600">
                (Teaching {currentSlot.className} - {currentSlot.subject})
              </span>
            )}
          </p>
          <p className="text-xs text-red-600">
            Total occupied slots: {totalAssignments}/30
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 text-xs min-w-fit">
            {/* Header */}
            <div className="font-semibold text-gray-700 text-center py-1 sticky left-0 bg-white min-w-16">
              Day/Period
            </div>
            {periods.map((period, idx) => (
              <div key={idx} className="font-semibold text-gray-700 text-center p-1 bg-gray-50 rounded min-w-12">
                P{idx + 1}
              </div>
            ))}
            
            {/* Schedule Grid */}
            {days.map((day, dayIndex) => (
              <React.Fragment key={dayIndex}>
                <div className="font-semibold text-gray-700 text-center p-1 bg-gray-100 rounded sticky left-0 min-w-16">
                  {day.slice(0, 3)}
                </div>
                {periods.map((_, periodIndex) => {
                  const slot = scheduleGrid[dayIndex]?.[periodIndex] || { isBooked: false, isCurrentSlot: dayIndex === currentDayIndex && periodIndex === currentPeriodIndex };
                  return (
                    <div
                      key={`${dayIndex}-${periodIndex}`}
                      className={`
                        h-12 min-w-12 rounded border text-center flex flex-col items-center justify-center cursor-help relative transition-all duration-200 hover:scale-105
                        ${slot.isCurrentSlot 
                          ? 'bg-blue-500 text-white border-blue-600 shadow-lg ring-2 ring-blue-300' 
                          : slot.isBooked 
                            ? 'bg-red-500 text-white border-red-600 shadow-sm hover:bg-red-600' 
                            : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                        }
                      `}
                      title={
                        slot.isCurrentSlot
                          ? `Current slot: ${days[dayIndex]} ${periods[periodIndex]}${slot.isBooked ? ` - Teaching: ${slot.className} - ${slot.subject}` : ' - Available'}`
                          : slot.isBooked 
                            ? `Teaching: ${slot.className} - ${slot.subject} (${slot.grade}-${slot.division})` 
                            : `Available: ${days[dayIndex]} ${periods[periodIndex]}`
                      }
                    >
                      <div className="text-xs font-semibold">
                        {slot.isCurrentSlot ? '●' : slot.isBooked ? '✕' : '✓'}
                      </div>
                      {slot.isBooked && (
                        <div className="text-xs mt-0.5 opacity-90 leading-tight">
                          <div>{slot.grade}-{slot.division}</div>
                        </div>
                      )}
                      {slot.isCurrentSlot && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-3 text-xs border-t pt-2 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Teaching</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded relative">
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="text-gray-600">Current slot</span>
          </div>
        </div>
        
        {/* Show detailed schedule if teacher has assignments */}
        {totalAssignments > 0 && (
          <div className="mt-3 border-t pt-2">
            <h5 className="font-semibold text-xs text-gray-700 mb-2">Current Assignments:</h5>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {scheduleGrid.flat()
                .filter(slot => slot.isBooked)
                .map((slot, index) => {
                  const dayIndex = Math.floor(index / periods.length);
                  const periodIndex = index % periods.length;
                  return (
                    <div key={index} className="text-xs bg-gray-50 p-1 rounded">
                      <div className="font-medium text-gray-800">
                        {slot.className} - {slot.subject}
                      </div>
                      <div className="text-gray-600">
                        {days[dayIndex]} • {periods[periodIndex]}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        {/* Show workload analysis */}
        <div className="mt-3 border-t pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Workload:</span>
            <span className={`font-semibold ${
              totalAssignments > 20 ? 'text-red-600' : 
              totalAssignments > 15 ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {((totalAssignments / 30) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                totalAssignments > 20 ? 'bg-red-500' : 
                totalAssignments > 15 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${(totalAssignments / 30) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // Custom Dropdown Component
  const CustomTeacherDropdown = ({ value, onChange, teachers, rowIndex, colIndex }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const hoverTimeoutRef = useRef(null)
    const hideTimeoutRef = useRef(null)

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false)
          setHoveredTeacher(null)
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
          }
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }
      }
    }, [])

    const selectedTeacher = teachers.find(t => t.id == value)

    const handleTeacherHover = (teacher, event) => {
      // Only show grid if dropdown is open and stable
      if (!isOpen) return
      
      // Clear any existing timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      
      // Add a longer delay before showing the grid
      hoverTimeoutRef.current = setTimeout(() => {
        // Double check dropdown is still open
        if (isOpen) {
          const rect = event.target.getBoundingClientRect()
          setHoveredTeacher({ ...teacher, currentDayIndex: rowIndex, currentPeriodIndex: colIndex })
          setHoverPosition({ x: rect.right, y: rect.top })
        }
      }, 800) // Increased to 800ms for more intentional hovering
    }

    const handleTeacherLeave = () => {
      // Clear hover timeout immediately
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      
      // Hide the grid quickly when leaving
      hideTimeoutRef.current = setTimeout(() => {
        setHoveredTeacher(null)
      }, 150)
    }

    const handleSelect = (teacherId) => {
      // Clear all timeouts immediately
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      
      // Hide grid and close dropdown immediately
      setHoveredTeacher(null)
      setIsOpen(false)
      onChange(teacherId)
    }

    const handleDropdownToggle = (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      // If closing, clear everything
      if (isOpen) {
        setHoveredTeacher(null)
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }
      }
      
      setIsOpen(!isOpen)
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus issues
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-left flex justify-between items-center"
        >
          <span className="truncate">
            {selectedTeacher ? selectedTeacher.name : 'Select Teacher'}
          </span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
            <div
              className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSelect('')
              }}
            >
              Select Teacher
            </div>
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="px-2 py-1 text-xs hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 relative"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSelect(teacher.id)
                }}
                onMouseEnter={(e) => {
                  // Only trigger hover if mouse stays for a while
                  setTimeout(() => handleTeacherHover(teacher, e), 100)
                }}
                onMouseLeave={handleTeacherLeave}
              >
                <div className="font-medium">{teacher.name}</div>
                <div className="text-gray-500 text-xs">
                  {teacher.subjects?.join(', ') || 'All subjects'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderClassroomCell = (cell, rowIndex, colIndex) => {
    // Always show all available teachers (no subject-based filtering for teacher dropdown)
    const allAvailableTeachers = getTeachersForTimeSlot
      ? getTeachersForTimeSlot(rowIndex, colIndex, classroom?.grade)
      : teachers

    const availableTeachers = allAvailableTeachers

    const availableSubjects = cell.teacherId
      ? subjects.filter((subject) => {
          const teacher = allAvailableTeachers.find((t) => t.id === cell.teacherId)
          return !teacher?.subjects || teacher.subjects.length === 0 || teacher.subjects.includes(subject)
        })
      : subjects

    const sortedTeachers = [...availableTeachers].sort((a, b) => a.name.localeCompare(b.name))
    const sortedSubjects = [...availableSubjects].sort((a, b) => a.localeCompare(b))

    const handleClear = () => {
      onUpdateSchedule(rowIndex, colIndex, "", "")
    }

    const handleTeacherChange = (newTeacherId) => {
      const newTeacher = allAvailableTeachers.find((t) => t.id == newTeacherId)
      let subject = cell.subject

      if (newTeacherId) {
        if (subject) {
          const canTeach =
            !newTeacher?.subjects ||
            newTeacher.subjects.length === 0 ||
            newTeacher.subjects.includes(subject)

          if (!canTeach) {
            subject = ""
          }
        }
      } else {
        subject = cell.subject || ""
      }

      onUpdateSchedule(rowIndex, colIndex, newTeacherId, subject)
    }

    return (
      <div className="space-y-1">
        {(cell.teacherId || cell.subject) && (
          <button
            onClick={handleClear}
            className="w-full px-2 py-1 text-xs bg-red-100 text-red-600 border border-red-200 rounded hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            Clear
          </button>
        )}

        <div className="flex items-center space-x-2">
          {isMultiSelect && <span className="text-green-500 text-lg">+</span>}
          <CustomTeacherDropdown
            value={cell.teacherId || ""}
            onChange={handleTeacherChange}
            teachers={sortedTeachers}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />
          {isMultiSelect && <span className="text-red-500 text-lg">−</span>}
        </div>

        <div className="flex items-center space-x-2">
          {isMultiAssign && <span className="text-green-500 text-lg">+</span>}
          <select
            value={cell.subject || ""}
            onChange={(e) => {
              const newSubject = e.target.value
              const currentTeacher = allAvailableTeachers.find((t) => t.id === cell.teacherId)

              let teacherId = cell.teacherId

              if (newSubject) {
                const canTeach =
                  !currentTeacher?.subjects ||
                  currentTeacher.subjects.length === 0 ||
                  currentTeacher.subjects.includes(newSubject)

                if (!canTeach) {
                  teacherId = ""
                }
              } else {
                teacherId = cell.teacherId || ""
              }

              onUpdateSchedule(rowIndex, colIndex, teacherId, newSubject)
            }}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            {sortedSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {isMultiAssign && <span className="text-red-500 text-lg">−</span>}
        </div>

        {getTeachersForTimeSlot && (
          <div className="text-xs text-gray-500">
            {availableTeachers.length} teacher
            {availableTeachers.length !== 1 ? "s" : ""} available
            {availableSubjects.length !== subjects.length && (
              <span>
                {" "}
                • {availableSubjects.length} subject{availableSubjects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderTeacherCell = (cell) => {
    if (cell) {
      return (
        <div className="bg-blue-100 p-2 rounded text-xs">
          <div className="font-semibold text-blue-800">{cell.classroom}</div>
          <div className="text-blue-600">{cell.subject}</div>
          <div className="text-blue-500">{cell.grade}</div>
        </div>
      )
    }
    return <div className="text-gray-400 text-xs">Free</div>
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg relative">
      {type === "classroom" && (
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setIsMultiSelect(!isMultiSelect)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              isMultiSelect
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            {isMultiSelect ? "Disable Multi-Select" : "Enable Multi-Select"}
          </button>
          <button
            onClick={() => setIsMultiAssign(!isMultiAssign)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              isMultiAssign
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            {isMultiAssign ? "Disable Multi-Assign" : "Enable Multi-Assign"}
          </button>
        </div>
      )}
      
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Day / Period</th>
            {periods.map((period, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700">
                {period}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData &&
            scheduleData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 bg-gray-100">
                  {days[rowIndex]}
                </td>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="border border-gray-300 p-2 text-center">
                    {type === "classroom" ? renderClassroomCell(cell, rowIndex, colIndex) : renderTeacherCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Teacher Schedule Grid Overlay */}
      {hoveredTeacher && (
        <TeacherScheduleGrid
          teacher={hoveredTeacher}
          position={hoverPosition}
          currentDayIndex={hoveredTeacher.currentDayIndex}
          currentPeriodIndex={hoveredTeacher.currentPeriodIndex}
          setHoveredTeacher={setHoveredTeacher}
        />
      )}
    </div>
  )
}

export default React.memo(ScheduleTable)