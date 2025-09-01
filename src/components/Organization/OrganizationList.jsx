// src/components/Organization/OrganizationList.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

const OrganizationList = ({ organizations, setSelectedOrg, navigate, variants }) => {
  const { switchOrganization } = useOrganization();

  const selectOrganization = (org) => {
    setSelectedOrg(org);
    switchOrganization(org.id);
    navigate('dashboard');
  };

  return (
    <motion.div variants={variants} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Your Organizations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map(org => (
            <div key={org.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{org.name}</h3>
                <button
                  onClick={() => selectOrganization(org)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Enter
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Admin:</span> {org.admin}</p>
                <p><span className="font-medium">Periods:</span> {org.periodCount}</p>
                <p><span className="font-medium">Days:</span> {org.totalDays}</p>
                <p><span className="font-medium">Schedule:</span> {org.scheduleRows}×{org.scheduleColumns}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Organization Info</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><span className="font-medium">Admin:</span> {org.admin}</p>
                  <p><span className="font-medium">Created:</span> {new Date(org.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizationList;