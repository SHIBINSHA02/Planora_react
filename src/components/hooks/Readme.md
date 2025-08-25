<!-- src/components/hooks/Readme.md -->
Detailed Guide to the useScheduleData React Hook
This document provides a comprehensive breakdown of the useScheduleData custom React hook. This hook is a central hub for managing all state and business logic required for a school's scheduling application. By encapsulating all the data and functions, it simplifies the process of building your application's user interface.

Key Features
Centralized State Management: All core data—teachers, classrooms, and the intricate weekly schedules—are managed within this single hook. This keeps your application's data flow predictable and easy to debug.

Dynamic Scheduling Operations: The hook provides a full suite of functions for CRUD (Create, Read, Update, Delete) operations. You can add new teachers and classrooms, manually assign or remove teachers from periods, and even clear the entire schedule at once.

Intelligent Availability & Qualification Checks: Functions are included to find available teachers for a specific time slot, filtering them based on their subject qualifications and the grade level of the classroom. This prevents common scheduling errors.

Automatic Assignment: A powerful autoAssignTeachers() function attempts to fill the schedule for you. It intelligently picks a qualified and available teacher for each empty period, saving a significant amount of manual effort.

Conflict Detection: A critical feature for any scheduling system, the hook includes a function to scan the entire schedule and identify any conflicts, such as a teacher being double-booked for the same time slot.

Data Export: You can easily export a snapshot of all the schedule data—including any detected conflicts—into a JSON file, which is perfect for backups or sharing.

How to Use the Hook
Using the useScheduleData hook is straightforward. You import it like any other React hook and call it inside a functional component. You then use ES6 object destructuring to pull out the specific state variables and functions you need.

import React from 'react';
import { useScheduleData } from './components/hooks/useScheduleData';

const MySchedulerComponent = () => {
  // Destructure the state variables and functions you need.
  // The hook handles all the state updates and logic behind the scenes.
  const {
    teachers,
    classrooms,
    schedules,
    addTeacher,
    addClassroom,
    updateSchedule,
    autoAssignTeachers,
    getScheduleConflicts,
    exportData
  } = useScheduleData();

  // You can now build your UI and event handlers using these values.
  // For example, an input form to add a new teacher:
  const handleAddTeacher = (teacherData) => {
    addTeacher(teacherData);
  };

  // A button to run the auto-assignment logic:
  const handleAutoAssign = () => {
    autoAssignTeachers();
  };

  return (
    <div>
      <h1>School Scheduler Dashboard</h1>
      <button onClick={handleAutoAssign}>Auto Assign Schedule</button>
      <button onClick={exportData}>Export Data as JSON</button>
      {/* Your UI components for displaying teachers, classrooms, and schedules would go here */}
    </div>
  );
};

export default MySchedulerComponent;


Comprehensive Function and State Reference
State Variables
teachers: An array of teacher objects. Each object typically contains id, name, subjects (an array of strings), and classes (an array of grades).

classrooms: An array of classroom objects. Each object typically contains id, name, grade, and division.

schedules: This is the central data structure. It's an object where each key corresponds to a classroomId. The value for each key is a 2D array representing a weekly timetable (5 days x 6 periods). Each nested object holds the teacher, subject, and teacherId for that specific time slot.

Scheduling & Administration Functions
addTeacher(teacherData):

What it does: Adds a new teacher object to the teachers state.

Arguments: teacherData (an object with the new teacher's details).

Returns: The ID of the newly added teacher.

addClassroom(classroomData):

What it does: Adds a new classroom to the classrooms state and creates a brand new, empty 5x6 schedule for it within the schedules state.

Arguments: classroomData (an object with the new classroom's details).

Returns: The ID of the newly added classroom.

updateSchedule(classroomId, dayIndex, periodIndex, teacherId, subject):

What it does: Updates a single period in a specific classroom's schedule. It first checks if the assigned teacher is qualified for the subject and class grade.

Arguments: classroomId (number), dayIndex (number), periodIndex (number), teacherId (number or null to clear), subject (string or null).

Returns: true if the update was successful, false otherwise.

clearAllSchedules():

What it does: Resets the entire schedule for every classroom, effectively wiping all assigned teachers and subjects.

Arguments: None.

Returns: Nothing.

autoAssignTeachers():

What it does: Iterates through every empty slot in all schedules and attempts to fill it with a randomly selected, qualified, and available teacher.

Arguments: None.

Returns: Nothing.

Data Retrieval & Validation Functions
getTeacherTimetable(teacherId):

What it does: Constructs a weekly timetable specifically for one teacher by scanning all classroom schedules.

Arguments: teacherId (number).

Returns: A 2D array representing the teacher's weekly schedule.

getSubjectsForClass(grade):

What it does: Retrieves the list of subjects that are taught for a specific grade level from the static data.

Arguments: grade (string).

Returns: An array of strings representing the subjects.

getTeachersForSubject(grade, subject):

What it does: Filters the list of all teachers to find those who are qualified to teach a given subject to a specific grade.

Arguments: grade (string), subject (string).

Returns: An array of qualified teacher objects.

getAvailableTeachers(classroomId, dayIndex, periodIndex, subject):

What it does: Returns a list of teachers who can teach the subject and are not already assigned to another class at the same time.

Arguments: classroomId (number), dayIndex (number), periodIndex (number), subject (string).

Returns: An array of available teacher objects.

getScheduleConflicts():

What it does: Scans the entire schedules state for any instances where a single teacher is double-booked.

Arguments: None.

Returns: An array of conflict objects, each detailing the conflict type, teacher, and conflicting classrooms.

exportData():

What it does: Packages all the data (teachers, classrooms, schedules, and conflicts) into a single JSON object and prompts the user to download it as a file.

Arguments: None.

Returns: Nothing.