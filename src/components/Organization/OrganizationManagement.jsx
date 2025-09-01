// src/components/Organization/OrganizationManagement.jsx
import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrganization } from '../../contexts/OrganizationContext';
import CreateOrganizationForm from './CreateOrganizationForm';
import OrganizationList from './OrganizationList';
import OrganizationDetails from './OrganizationDetails';
import ProjectAccess from './ProjectAccess';

const OrganizationManagement = ({ navigate }) => {
  const { organizations, loadOrganizations, loading, error } = useOrganization();
  const [currentView, setCurrentView] = useState('create');
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    if (organizations.length === 0) {
      loadOrganizations();
    }
  }, [loadOrganizations, organizations.length]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded relative mb-6">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Demo Mode</p>
              <p className="text-sm">Backend server is not running. Using sample data for demonstration.</p>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          >
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div 
            variants={itemVariants}
            className="text-gray-600 text-center mb-6"
          >
            Loading...
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'create', label: 'Create Organization', icon: 'Plus' },
                { id: 'manage', label: 'Manage Organizations', icon: 'Settings' },
                { id: 'access', label: 'Project Access', icon: 'Key' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    currentView === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {currentView === 'create' && (
          <CreateOrganizationForm navigate={navigate} variants={itemVariants} />
        )}

        {currentView === 'manage' && (
          <>
            <OrganizationList
              organizations={organizations}
              setSelectedOrg={setSelectedOrg}
              navigate={navigate}
              variants={itemVariants}
            />
            {selectedOrg && (
              <OrganizationDetails
                selectedOrg={selectedOrg}
                navigate={navigate}
                variants={itemVariants}
              />
            )}
          </>
        )}

        {currentView === 'access' && (
          <ProjectAccess variants={itemVariants} />
        )}
      </motion.div>
    </div>
  );
};

export default OrganizationManagement;