// src/components/Organization/OrganizationManagement.jsx
import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrganization } from '../../contexts/OrganizationContext';
import CreateOrganizationForm from './CreateOrganizationForm';
import OrganizationList from './OrganizationList';
import OrganizationDetails from './OrganizationDetails';
import ProjectAccess from './ProjectAccess';
// Removed OTPManagement per backend cleanup

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

        {/* OTP management removed */}

        {currentView === 'access' && (
          <ProjectAccess variants={itemVariants} />
        )}
      </motion.div>
    </div>
  );
};

export default OrganizationManagement;