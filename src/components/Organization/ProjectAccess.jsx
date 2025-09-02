import React from 'react';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';

const ProjectAccess = ({ variants }) => {
  return (
    <motion.div variants={variants} className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-2">
        <Key className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold">Project Access</h2>
      </div>
      <p className="text-gray-600 text-sm">
        Project-level OTP access is currently disabled. All users operate with default permissions.
      </p>
    </motion.div>
  );
};

export default ProjectAccess;