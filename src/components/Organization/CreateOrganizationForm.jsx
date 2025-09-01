// src/components/Organization/CreateOrganizationForm.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrganization } from '../../contexts/OrganizationContext';

const CreateOrganizationForm = ({ navigate, variants }) => {
  const { createOrganization } = useOrganization();
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!newOrganization.name.trim()) newErrors.name = 'Organization name is required';
    if (!newOrganization.admin.trim()) newErrors.admin = 'Admin name is required';
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
      await createOrganization(newOrganization);
      setNewOrganization({
        name: '',
        admin: '',
        periodCount: 8,
        totalDays: 5,
        scheduleRows: 7,
        scheduleColumns: 8
      });
      navigate('dashboard');
    } catch (error) {
      console.error('Error creating organization:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={variants} className="bg-white rounded-lg shadow-sm p-6">
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
  );
};

export default CreateOrganizationForm;