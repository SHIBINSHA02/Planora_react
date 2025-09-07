import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/Auth';
import { useOrganization } from '../../contexts/OrganizationContext';
import TeacherService from '../../services/teacherService';
import UserService from '../../services/userService';
import OrganizationService from '../../services/organizationService';

const Panel = ({ navigate }) => {
  const { user } = useAuth();
  const { organizations, currentOrganization, loadOrganizations, switchOrganization } = useOrganization();
  const [teacher, setTeacher] = useState(null);
  const [orgIdForRequests, setOrgIdForRequests] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orgsForUser, setOrgsForUser] = useState([]);
  const [scheduleSearch, setScheduleSearch] = useState({ organisationId: '', classroomId: '' });
  const [foundClassroom, setFoundClassroom] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await loadOrganizations();

        // Fetch organizations accessible to this user
        if (user?.userId) {
          try {
            const data = await UserService.getUserOrganizations(user.userId);
            setOrgsForUser(data.organizations || []);
          } catch {}
        }

        // Initialize orgIdForRequests from current organization
        if (currentOrganization?.id || currentOrganization?.organisationId) {
          setOrgIdForRequests(currentOrganization.id || currentOrganization.organisationId);
        }

        // If org and teacherId known, fetch teacher
        if (user?.id || user?.teacherId) {
          const teacherId = user.teacherId || user.id;
          const orgId = (currentOrganization?.id || currentOrganization?.organisationId || orgIdForRequests || '').trim();
          if (orgId) {
            const t = await TeacherService.getTeacherById(orgId, teacherId);
            setTeacher(t);
          }
        }
      } catch (e) {
        setError(e.message || 'Failed to load panel');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, loadOrganizations, currentOrganization]);

  const handleSelectOrganization = (organisationId) => {
    setOrgIdForRequests(organisationId || '');
    switchOrganization(organisationId);
    navigate('dashboard');
  };

  const handleCreateTeacher = async () => {
    try {
      setError(null);
      if (!user?.userId) throw new Error('No user ID');
      const payload = {
        teacher: {
          id: Date.now(),
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email,
          email: user.email,
          phone: '',
          bio: '',
          profilePicture: '',
          globalPermissions: { view: true, edit: false }
        }
      };
      const created = await UserService.createTeacherForUser(user.userId, payload);
      setTeacher(created.teacher || created);
    } catch (e) {
      setError(e.message || 'Failed to create teacher profile');
    }
  };

  const handleSearchSchedule = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setFoundClassroom(null);
      const { organisationId, classroomId } = scheduleSearch;
      if (!organisationId || !classroomId) throw new Error('Enter both organisationId and classroomId');
      const cls = await OrganizationService.getClassroom(organisationId, classroomId);
      setFoundClassroom(cls && cls.classroom ? cls.classroom : cls);
    } catch (e) {
      setError(e.message || 'Failed to fetch classroom');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Panel</h1>
          <button
            onClick={() => navigate('organization')}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-white"
          >
            Manage Organizations
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">My Schedule {currentOrganization ? `(Org: ${currentOrganization.name || currentOrganization.id})` : ''}</h2>
            {!teacher ? (
              <div className="text-gray-700">
                <p className="mb-3">No teacher profile linked to your account.</p>
                <button onClick={handleCreateTeacher} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Create Teacher Profile</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day/Period</th>
                      {[...Array(6)].map((_, idx) => (
                        <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P{idx+1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {['Mon','Tue','Wed','Thu','Fri'].map((day, r) => (
                      <tr key={day}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{day}</td>
                        {[...Array(6)].map((_, c) => (
                          <td key={c} className="px-4 py-2 text-sm text-gray-700">-</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Organizations</h2>
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <div className="space-y-3">
              {orgsForUser && orgsForUser.length > 0 && (
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-medium text-gray-900 mb-2">Your Accessible Organizations</p>
                  <div className="space-y-2">
                    {orgsForUser.map((org) => (
                      <div key={org.organisationId} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900">{org.organisationName || org.name || org.organisationId}</p>
                          <p className="text-xs text-gray-500">{org.organisationId}</p>
                        </div>
                        <button onClick={() => handleSelectOrganization(org.organisationId)} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Open</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(Array.isArray(organizations) ? organizations : []).map((org) => (
                <div key={org.id || org.organisationId} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-500">{org.id || org.organisationId}</p>
                  </div>
                  <button
                    onClick={() => handleSelectOrganization(org.id || org.organisationId)}
                    className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Open
                  </button>
                </div>
              ))}
              {(!Array.isArray(organizations) || organizations.length === 0) && (
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-3">No organizations found for your account.</p>
                  <button
                    onClick={() => navigate('organization')}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Organization
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Find Classroom Schedule</h2>
          <form onSubmit={handleSearchSchedule} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Organisation ID (e.g., org-1)"
              value={scheduleSearch.organisationId}
              onChange={(e) => { const v = e.target.value; setScheduleSearch(s => ({ ...s, organisationId: v })); setOrgIdForRequests(v || ''); }}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Classroom ID (e.g., cls-1)"
              value={scheduleSearch.classroomId}
              onChange={(e) => setScheduleSearch(s => ({ ...s, classroomId: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Search</button>
          </form>
          {foundClassroom && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">Classroom: {foundClassroom.classroomName || foundClassroom.classroomId}</p>
              <p className="text-xs text-gray-500 mb-3">ID: {foundClassroom.classroomId}</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day/Period</th>
                      {[...Array(6)].map((_, idx) => (
                        <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P{idx+1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, rowIdx) => (
                      <tr key={day}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{day}</td>
                        {[...Array(6)].map((_, colIdx) => {
                          const cellIdx = rowIdx * 6 + colIdx;
                          const cell = foundClassroom.grid && foundClassroom.grid[cellIdx];
                          return (
                            <td key={colIdx} className="px-4 py-2 text-sm text-gray-700">
                              {cell ? (
                                <>
                                  <div>{Array.isArray(cell.subjects) ? cell.subjects.join(', ') : '-'}</div>
                                  <div className="text-xs text-gray-500">
                                    {Array.isArray(cell.teachers)
                                      ? cell.teachers
                                          .map((t) => (t && typeof t === 'object' ? (t.name || t.email || t.id) : String(t)))
                                          .join(', ')
                                      : '-'}
                                  </div>
                                  {/* <div className="text-[10px] text-gray-400">
                                    {Array.isArray(cell.teachers)
                                      ? (() => {
                                          const classNames = cell.teachers.flatMap((t) => {
                                            const org = t && Array.isArray(t.organizations)
                                              ? t.organizations.find((o) => o && o.organisationId === scheduleSearch.organisationId)
                                              : null;
                                            return org && Array.isArray(org.classes) ? org.classes : [];
                                          });
                                          return classNames.length > 0 ? classNames.join(', ') : '-';
                                        })()
                                      : '-'}
                                  </div> */}
                                </>
                              ) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;