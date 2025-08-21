// src/components/ScheduleTable.jsx
"use client"

import React, { useState } from "react"

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
}) => {
  const [isMultiSelect, setIsMultiSelect] = useState(false)
  const [isMultiAssign, setIsMultiAssign] = useState(false)

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
          <select
            value={cell.teacherId || ""}
            onChange={(e) => {
              const newTeacherId = e.target.value
              const newTeacher = allAvailableTeachers.find((t) => t.id === newTeacherId)

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
            }}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Teacher</option>
            {sortedTeachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
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
    <div className="overflow-x-auto shadow-lg rounded-lg">
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
    </div>
  )
}

export default React.memo(ScheduleTable)