// src/components/TeacherTimetableView.jsx
// components/TeacherTimetableView.jsx
import React, { useEffect, useState } from 'react';
import ScheduleTable from './ScheduleTable';
import { useOrganization } from '../contexts/OrganizationContext';
import TeacherService from '../services/teacherService';

const TeacherTimetableView = ({
  selectedTeacher,
  setSelectedTeacher,
  getTeacherTimetable // kept for backward compatibility; prefer API schedule
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];
  const { currentOrganization } = useOrganization();
  const [orgTeachers, setOrgTeachers] = useState([]);
  const [apiSchedule, setApiSchedule] = useState(null);

  // Load teachers for current organization
  useEffect(() => {
    const load = async () => {
      const orgId = currentOrganization?.id || currentOrganization?.organisationId;
      if (!orgId) { setOrgTeachers([]); return; }
      try {
        const list = await TeacherService.getAllTeachers(orgId);
        setOrgTeachers(Array.isArray(list) ? list : []);
      } catch (_) {
        setOrgTeachers([]);
      }
    };
    load();
  }, [currentOrganization]);

  // Load selected teacher schedule from API
  useEffect(() => {
    const loadSchedule = async () => {
      const orgId = currentOrganization?.id || currentOrganization?.organisationId;
      if (!orgId || !selectedTeacher) {
        setApiSchedule(null);
        return;
      }
      try {
        const sched = await TeacherService.getTeacherSchedule(orgId, parseInt(selectedTeacher));
        setApiSchedule(sched);
      } catch (_) {
        // Fallback to provided getter if API not available
        setApiSchedule(getTeacherTimetable ? getTeacherTimetable(parseInt(selectedTeacher)) : null);
      }
    };
    loadSchedule();
  }, [currentOrganization, selectedTeacher, getTeacherTimetable]);

  const teacherTimetable = apiSchedule;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Teacher</option>
          {orgTeachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeacher && teacherTimetable && (
        <ScheduleTable
          scheduleData={teacherTimetable}
          days={days}
          periods={periods}
          type="teacher"
        />
      )}
    </div>
  );
};

export default TeacherTimetableView;