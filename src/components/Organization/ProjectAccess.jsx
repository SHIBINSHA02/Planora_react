import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, UserCheck, Edit, Eye } from 'lucide-react';

const ProjectAccess = ({ variants }) => {
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [projectAccess, setProjectAccess] = useState(false);

  const handleOTPSubmit = () => {
    if (otp === '123456') {
      setProjectAccess(true);
      setShowOTPForm(false);
      setOtp('');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <motion.div variants={variants} className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Key className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold">Get Project Access</h2>
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
  );
};

export default ProjectAccess;