import React, { useState, useEffect } from 'react';
import { Building2, Users, Settings, Shield, Key, Plus, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrganization } from '../../contexts/OrganizationContext';

const OrganizationManagement = ({ navigate }) => {
  const { 
    organizations, 
    createOrganization, 
    loadOrganizations, 
    switchOrganization,
    loading,
    error 
  } = useOrganization();
  
  const [currentView, setCurrentView] = useState('create');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [projectAccess, setProjectAccess] = useState(false);



  const [newOrganization, setNewOrganization] = useState({
    name: '',
    admin: '',
    periodCount: 8,
    totalDays: 5,
    scheduleRows: 7,
    scheduleColumns: 8
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!newOrganization.name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    
    if (!newOrganization.admin.trim()) {
      newErrors.admin = 'Admin name is required';
    }
    
    if (newOrganization.periodCount < 1 || newOrganization.periodCount > 12) {
      newErrors.periodCount = 'Period count must be between 1 and 12';
    }
    
    if (newOrganization.totalDays < 1 || newOrganization.totalDays > 7) {
      newErrors.totalDays = 'Total days must be between 1 and 7';
    }
    
    if (newOrganization.scheduleRows < 1 || newOrganization.scheduleRows > 20) {
      newErrors.scheduleRows = 'Schedule rows must be between 1 and 20';
    }
    
    if (newOrganization.scheduleColumns < 1 || newOrganization.scheduleColumns > 20) {
      newErrors.scheduleColumns = 'Schedule columns must be between 1 and 20';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setNewOrganization(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCreateOrganization = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      const newOrg = await createOrganization(newOrganization);
      
      setNewOrganization({
        name: '',
        admin: '',
        periodCount: 8,
        totalDays: 5,
        scheduleRows: 7,
        scheduleColumns: 8
      });
      
      // Navigate to dashboard
      navigate('dashboard');
      
    } catch (error) {
      console.error('Error creating organization:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = () => {
    // Simulate OTP validation
    if (otp === '123456') {
      setProjectAccess(true);
      setShowOTPForm(false);
      setOtp('');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const toggleUserAccess = (orgId, userId, newAccess) => {
    // This would typically make an API call to update user access
    console.log(`Toggle user ${userId} access to ${newAccess} in org ${orgId}`);
  };

  const removeUser = (orgId, userId) => {
    // This would typically make an API call to remove user
    console.log(`Remove user ${userId} from org ${orgId}`);
  };

  const selectOrganization = (org) => {
    setSelectedOrg(org);
    switchOrganization(org.id);
    navigate('dashboard');
  };

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
      {/* Header */}
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
        {/* Demo Mode Notice */}
        <motion.div 
          variants={itemVariants}
          className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded relative mb-6"
        >
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

        {/* Error Message */}
        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <motion.div 
            variants={itemVariants}
            className="text-gray-600 text-center mb-6"
          >
            Loading...
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'create', label: 'Create Organization', icon: Plus },
                { id: 'manage', label: 'Manage Organizations', icon: Settings },
                { id: 'access', label: 'Project Access', icon: Key }
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
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Create Organization View */}
        {currentView === 'create' && (
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Plus className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Create New Organization</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={newOrganization.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={newOrganization.admin}
                  onChange={(e) => handleInputChange('admin', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.admin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin name"
                />
                {errors.admin && <p className="text-red-500 text-xs mt-1">{errors.admin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newOrganization.periodCount}
                  onChange={(e) => handleInputChange('periodCount', parseInt(e.target.value) || 1)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.periodCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.periodCount && <p className="text-red-500 text-xs mt-1">{errors.periodCount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={newOrganization.totalDays}
                  onChange={(e) => handleInputChange('totalDays', parseInt(e.target.value) || 1)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.totalDays ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.totalDays && <p className="text-red-500 text-xs mt-1">{errors.totalDays}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Rows
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newOrganization.scheduleRows}
                  onChange={(e) => handleInputChange('scheduleRows', parseInt(e.target.value) || 1)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.scheduleRows ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.scheduleRows && <p className="text-red-500 text-xs mt-1">{errors.scheduleRows}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Columns
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newOrganization.scheduleColumns}
                  onChange={(e) => handleInputChange('scheduleColumns', parseInt(e.target.value) || 1)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.scheduleColumns ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.scheduleColumns && <p className="text-red-500 text-xs mt-1">{errors.scheduleColumns}</p>}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCreateOrganization}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create Organization</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Manage Organizations View */}
        {currentView === 'manage' && (
          <motion.div variants={itemVariants} className="space-y-6">
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

            {/* Organization Details for Selected Organization */}
            {selectedOrg && (
              <div className="bg-white rounded-lg shadow-sm p-6">
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
                      onClick={() => selectOrganization(selectedOrg)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Enter Organization
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      Edit Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Project Access View */}
        {currentView === 'access' && (
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Key className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Project Access</h2>
            </div>

            {!projectAccess ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                    <Key className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Enter Project Access Code</h3>
                  <p className="text-gray-600 mb-6">
                    Enter the 6-digit OTP to gain access to project editing features.
                  </p>
                </div>

                {!showOTPForm ? (
                  <button
                    onClick={() => setShowOTPForm(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Enter OTP
                  </button>
                ) : (
                  <div className="max-w-md mx-auto">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        6-Digit OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg tracking-widest"
                        placeholder="000000"
                        maxLength="6"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleOTPSubmit}
                        disabled={otp.length !== 6}
                        className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                          otp.length === 6
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Verify OTP
                      </button>
                      <button
                        onClick={() => {
                          setShowOTPForm(false);
                          setOtp('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Demo OTP: 123456
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Access Granted!</h3>
                  <p className="text-gray-600 mb-6">
                    You now have full access to project editing features.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Edit className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Edit Access</h4>
                    <p className="text-sm text-gray-600">Modify schedules and configurations</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Eye className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">View Access</h4>
                    <p className="text-sm text-gray-600">View all project data and reports</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProjectAccess(false);
                    setShowOTPForm(false);
                    setOtp('');
                  }}
                  className="mt-6 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Revoke Access
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OrganizationManagement;
