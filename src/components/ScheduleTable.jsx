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
  type = "classroom",
  classroom,
  schedules = {}, // Added schedules prop to access all classroom schedules
  classrooms = [], // Added classrooms prop
}) => {
  const [isMultiSelect, setIsMultiSelect] = useState(false)
  const [isMultiAssign, setIsMultiAssign] = useState(false)
  const [hoveredTeacher, setHoveredTeacher] = useState(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [openDropdowns, setOpenDropdowns] = useState({}) // Track which dropdowns are open

  // Get teacher's availability for the current time slot across all periods
  const getTeacherAvailabilityGrid = (teacherId, currentDayIndex, currentPeriodIndex) => {
    const grid = Array(days.length).fill().map(() => Array(periods.length).fill(false))
    
    // Convert teacherId to number for comparison if it's a string
    const targetTeacherId = typeof teacherId === 'string' ? parseInt(teacherId) : teacherId
    
    // Check availability for each time slot across all classrooms
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      for (let periodIndex = 0; periodIndex < periods.length; periodIndex++) {
        let isAvailable = true
        let assignedToClassroom = null
        let assignedSubject = null
        
        // Check all classrooms for this specific time slot
        Object.keys(schedules).forEach(classroomId => {
          const classroomSchedule = schedules[classroomId]
          if (classroomSchedule && Array.isArray(classroomSchedule)) {
            const daySchedule = classroomSchedule[dayIndex]
            if (Array.isArray(daySchedule)) {
              const period = daySchedule[periodIndex]
              if (period) {
                const periodTeacherId = period?.teacherId || period?.teacher_id || null
                const periodTeacherIdNum = typeof periodTeacherId === 'string' ? parseInt(periodTeacherId) : periodTeacherId
                
                if (periodTeacherIdNum === targetTeacherId && periodTeacherIdNum !== null && !isNaN(periodTeacherIdNum)) {
                  isAvailable = false
                  assignedToClassroom = classrooms.find(c => c.id === parseInt(classroomId))?.name || `Classroom ${classroomId}`
                  assignedSubject = period.subject || 'Unknown Subject'
                }
              }
            }
          }
        })
        
        grid[dayIndex][periodIndex] = {
          isBooked: !isAvailable,
          className: assignedToClassroom,
          subject: assignedSubject,
          isCurrentSlot: dayIndex === currentDayIndex && periodIndex === currentPeriodIndex
        }
      }
    }
    
    return grid
  }

  // Teacher Schedule Grid Component
  const TeacherScheduleGrid = ({ teacher, position, currentDayIndex, currentPeriodIndex }) => {
    const scheduleGrid = getTeacherAvailabilityGrid(teacher.id, currentDayIndex, currentPeriodIndex)
    
    // Debug: Count total assignments for this teacher
    const totalAssignments = scheduleGrid.flat().filter(slot => slot.isBooked).length
    
    return (
      <div 
        className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-80 pointer-events-none"
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
          setHoveredTeacher(null)
        }}
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
    const allAvailableTeachers = getTeachersForTimeSlot
      ? getTeachersForTimeSlot(rowIndex, colIndex, classroom?.grade)
      : teachers

    const availableTeachers = cell.subject
      ? allAvailableTeachers.filter(
          (teacher) => !teacher.subjects || teacher.subjects.length === 0 || teacher.subjects.includes(cell.subject),
        )
      : allAvailableTeachers

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
          <div className="flex-1">
            <CustomTeacherDropdown
              value={cell.teacherId || ""}
              onChange={handleTeacherChange}
              teachers={sortedTeachers}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          </div>
          {isMultiSelect && <span className="text-red-500 text-lg">−</span>}
        </div>

        <div className="flex items-center space-x-2">
          {isMultiAssign && <span className="text-green-500 text-lg">+</span>}
          <div className="flex-1">
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
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Select Subject</option>
              {sortedSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
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
        />
      )}
    </div>
  )
}

export default React.memo(ScheduleTable)