// src/components/Organization/OrganizationDetails.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

const OrganizationDetails = ({ selectedOrg, navigate, variants }) => {
  const { switchOrganization } = useOrganization();

  const selectOrganization = () => {
    switchOrganization(selectedOrg.id);
    navigate('dashboard');
  };

  return (
    <motion.div variants={variants} className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Building2 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold">Organization Details - {selectedOrg.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {selectedOrg.name}</p>
            <p><span className="font-medium">Admin:</span> {selectedOrg.admin}</p>
            <p><span className="font-medium">Created:</span> {new Date(selectedOrg.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Schedule Configuration</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Periods per day:</span> {selectedOrg.periodCount}</p>
            <p><span className="font-medium">Working days:</span> {selectedOrg.totalDays}</p>
            <p><span className="font-medium">Grid size:</span> {selectedOrg.scheduleRows} × {selectedOrg.scheduleColumns}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="flex space-x-3">
          <button
            onClick={selectOrganization}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Enter Organization
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Edit Settings
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizationDetails;