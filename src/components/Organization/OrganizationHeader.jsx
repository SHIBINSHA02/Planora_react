// src/components/Organization/OrganizationHeader.jsx
import React from 'react';
import { Building2 } from 'lucide-react';

const OrganizationHeader = ({ navigate }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Organization Management</h1>
          </div>
          <button
            onClick={() => navigate('home')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Home
          </button>
        </div>
      </div>
    </header>
  );
};

export default OrganizationHeader;