// src/components/Organization/OTPManagement.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Clock, User, Settings, Key, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrganization } from '../../contexts/OrganizationContext';
import OTPService from '../../services/otpService';

const OTPManagement = ({ variants }) => {
  const { currentOrganization } = useOrganization();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [otpStatus, setOtpStatus] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    if (currentOrganization) {
      loadTeachersWithPermissions();
    }
  }, [currentOrganization]);

  const loadTeachersWithPermissions = async () => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      setError(null);
      const data = await OTPService.getTeachersWithPermissions(currentOrganization.id);
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setError('Failed to load teachers. Using demo data.');
      // Fallback to demo data
      setTeachers([
        {
          id: '1',
          name: 'John Doe',
          permissions: { view: true, edit: true, delete: false, manageTeachers: false, manageClassrooms: false },
          isActive: true,
          hasEditAccess: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          permissions: { view: true, edit: false, delete: false, manageTeachers: false, manageClassrooms: false },
          isActive: true,
          hasEditAccess: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOTP = async (teacher) => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const result = await OTPService.generateOTP(
        currentOrganization.id,
        teacher.id,
        'admin@example.com' // In real app, this would be the current user
      );
      
      setSuccessMessage(`OTP generated for ${teacher.name}: ${result.otpExpiresIn} minutes expiration`);
      setSelectedTeacher(teacher);
      
      // Load updated OTP status
      await loadOTPStatus(teacher.id);
      
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError(`Failed to generate OTP: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadOTPStatus = async (teacherId) => {
    if (!currentOrganization) return;

    try {
      const status = await OTPService.getOTPStatus(currentOrganization.id, teacherId);
      setOtpStatus(status.otpStatus);
    } catch (error) {
      console.error('Error loading OTP status:', error);
      setError(`Failed to load OTP status: ${error.message}`);
    }
  };

  const handleValidateOTP = async () => {
    if (!currentOrganization || !selectedTeacher || !otpCode) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const result = await OTPService.validateOTP(
        currentOrganization.id,
        selectedTeacher.id,
        otpCode
      );
      
      setValidationResult(result);
      setSuccessMessage(`OTP validated successfully for ${selectedTeacher.name}`);
      setOtpCode('');
      
      // Load updated OTP status
      await loadOTPStatus(selectedTeacher.id);
      
    } catch (error) {
      console.error('Error validating OTP:', error);
      setError(`Failed to validate OTP: ${error.message}`);
      setValidationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async (teacher, newPermissions) => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      setError(null);
      
      await OTPService.updateTeacherPermissions(
        currentOrganization.id,
        teacher.id,
        newPermissions,
        'admin@example.com' // In real app, this would be the current user
      );
      
      setSuccessMessage(`Permissions updated for ${teacher.name}`);
      
      // Reload teachers
      await loadTeachersWithPermissions();
      
    } catch (error) {
      console.error('Error updating permissions:', error);
      setError(`Failed to update permissions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionIcon = (permission) => {
    switch (permission) {
      case 'view': return <User className="h-4 w-4" />;
      case 'edit': return <Key className="h-4 w-4" />;
      case 'delete': return <XCircle className="h-4 w-4" />;
      case 'manageTeachers': return <User className="h-4 w-4" />;
      case 'manageClassrooms': return <Settings className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getOTPStatusIcon = (status) => {
    if (!status) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    
    if (status.isExpired) return <XCircle className="h-4 w-4 text-red-500" />;
    if (status.isUsed) return <CheckCircle className="h-4 w-4 text-yellow-500" />;
    if (status.hasOTP) return <Clock className="h-4 w-4 text-green-500" />;
    
    return <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  const getOTPStatusText = (status) => {
    if (!status) return 'No OTP';
    
    if (status.isExpired) return 'Expired';
    if (status.isUsed) return 'Used';
    if (status.hasOTP) return `Valid (${OTPService.formatExpirationTime(status.expiresAt)})`;
    
    return 'No OTP';
  };

  if (!currentOrganization) {
    return (
      <motion.div variants={variants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">OTP Management</h3>
          <p className="text-gray-600">Please select an organization to manage OTP access.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={variants} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-800">OTP Access Management</h3>
        </div>
        <p className="text-gray-600">
          Manage teacher access permissions and OTP generation for {currentOrganization.name}
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <motion.div 
          variants={variants}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
        >
          <CheckCircle className="h-5 w-5 inline mr-2" />
          {successMessage}
        </motion.div>
      )}

      {error && (
        <motion.div 
          variants={variants}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          <AlertCircle className="h-5 w-5 inline mr-2" />
          {error}
        </motion.div>
      )}

      {/* Teachers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800">Teachers with Permissions</h4>
          <p className="text-gray-600 text-sm">Manage teacher access and generate OTPs</p>
        </div>

        {loading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        )}

        {!loading && (
          <div className="divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-lg font-medium text-gray-800">{teacher.name}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        teacher.hasEditAccess 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {teacher.hasEditAccess ? 'Edit Access' : 'View Only'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        {getOTPStatusIcon(teacher.otpStatus)}
                        <span>{getOTPStatusText(teacher.otpStatus)}</span>
                      </div>
                      <span>ID: {teacher.id}</span>
                    </div>

                    {/* Permissions */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(teacher.permissions).map(([permission, hasPermission]) => (
                        <div
                          key={permission}
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                            hasPermission 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {getPermissionIcon(permission)}
                          <span className="capitalize">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {teacher.hasEditAccess && (
                      <button
                        onClick={() => handleGenerateOTP(teacher)}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50"
                      >
                        Generate OTP
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        loadOTPStatus(teacher.id);
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OTP Validation Section */}
      {selectedTeacher && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            OTP Validation for {selectedTeacher.name}
          </h4>
          
          {otpStatus && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {getOTPStatusIcon(otpStatus)}
                <span className="font-medium">Status: {getOTPStatusText(otpStatus)}</span>
              </div>
              {otpStatus.expiresAt && (
                <p className="text-sm text-gray-600">
                  Expires: {new Date(otpStatus.expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              maxLength="6"
            />
            <button
              onClick={handleValidateOTP}
              disabled={loading || !otpCode}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Validate OTP
            </button>
          </div>

          {validationResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">OTP Validated Successfully</span>
              </div>
              <p className="text-sm text-green-700">
                Access granted for {validationResult.teacherName} at {new Date(validationResult.validatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OTPManagement;
