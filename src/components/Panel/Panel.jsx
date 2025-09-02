// src/components/Panel/Panel.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/Auth';
import { useOrganization } from '../../contexts/OrganizationContext';
import TeacherService from '../../services/teacherService';

const Panel = ({ navigate }) => {
  const { user } = useAuth();
  const { organizations, currentOrganization, loadOrganizations, switchOrganization } = useOrganization();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await loadOrganizations();
        if (user?.id || user?.teacherId) {
          const teacherId = user.teacherId || user.id;
          const t = await TeacherService.getTeacherById(teacherId);
          setTeacher(t);
        }
      } catch (e) {
        setError(e.message || 'Failed to load panel');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, loadOrganizations]);

  const handleSelectOrganization = (organisationId) => {
    switchOrganization(organisationId);
    navigate('dashboard');
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
              <p className="text-gray-600">No teacher profile found.</p>
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
              {(organizations || []).map((org) => (
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
              {(!organizations || organizations.length === 0) && (
                <p className="text-gray-600 text-sm">No organizations found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;


