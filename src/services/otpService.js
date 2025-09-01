// src/services/otpService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/organisation';

class OTPService {
  // Helper method to check if a value is empty
  static isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  }

  // Generate OTP for teacher organization access
  static async generateOTP(organisationId, teacherId, requestedBy) {
    try {
      if (this.isEmpty(organisationId) || this.isEmpty(teacherId) || this.isEmpty(requestedBy)) {
        throw new Error('Organisation ID, Teacher ID, and Requested By are required');
      }

      const response = await axios.post(`${API_BASE_URL}/${organisationId}/otp/generate`, {
        teacherId,
        requestedBy
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('Error generating OTP:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Validate OTP for organization access
  static async validateOTP(organisationId, teacherId, otp) {
    try {
      if (this.isEmpty(organisationId) || this.isEmpty(teacherId) || this.isEmpty(otp)) {
        throw new Error('Organisation ID, Teacher ID, and OTP are required');
      }

      const response = await axios.post(`${API_BASE_URL}/${organisationId}/otp/validate`, {
        teacherId,
        otp
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('Error validating OTP:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Get OTP status for a teacher
  static async getOTPStatus(organisationId, teacherId) {
    try {
      if (this.isEmpty(organisationId) || this.isEmpty(teacherId)) {
        throw new Error('Organisation ID and Teacher ID are required');
      }

      const response = await axios.get(`${API_BASE_URL}/${organisationId}/otp/status/${teacherId}`, {
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.error('Error getting OTP status:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Update teacher permissions (admin only)
  static async updateTeacherPermissions(organisationId, teacherId, permissions, updatedBy) {
    try {
      if (this.isEmpty(organisationId) || this.isEmpty(teacherId) || this.isEmpty(permissions) || this.isEmpty(updatedBy)) {
        throw new Error('Organisation ID, Teacher ID, Permissions, and Updated By are required');
      }

      const response = await axios.put(`${API_BASE_URL}/${organisationId}/teachers/${teacherId}/permissions`, {
        permissions,
        updatedBy
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('Error updating teacher permissions:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Get all teachers with their permissions in an organization
  static async getTeachersWithPermissions(organisationId) {
    try {
      if (this.isEmpty(organisationId)) {
        throw new Error('Organisation ID is required');
      }

      const response = await axios.get(`${API_BASE_URL}/${organisationId}/teachers/permissions`, {
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.error('Error getting teachers with permissions:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Update organization OTP settings (admin only)
  static async updateOTPSettings(organisationId, otpSettings, updatedBy) {
    try {
      if (this.isEmpty(organisationId) || this.isEmpty(otpSettings) || this.isEmpty(updatedBy)) {
        throw new Error('Organisation ID, OTP Settings, and Updated By are required');
      }

      const response = await axios.put(`${API_BASE_URL}/${organisationId}/otp/settings`, {
        otpSettings,
        updatedBy
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('Error updating OTP settings:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Check if teacher has edit access
  static async checkTeacherEditAccess(organisationId, teacherId) {
    try {
      const status = await this.getOTPStatus(organisationId, teacherId);
      return status.otpStatus?.hasEditAccess || false;
    } catch (error) {
      console.warn('Could not check teacher edit access:', error.message);
      return false;
    }
  }

  // Utility method to format OTP expiration time
  static formatExpirationTime(expiresAt) {
    if (!expiresAt) return 'N/A';
    
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expirationDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds}s`;
    } else {
      return `${diffSeconds}s`;
    }
  }

  // Utility method to check if OTP is expired
  static isOTPExpired(expiresAt) {
    if (!expiresAt) return true;
    return new Date() > new Date(expiresAt);
  }

  // Utility method to check if OTP is valid (not expired and not used)
  static isOTPValid(otpStatus) {
    if (!otpStatus) return false;
    return otpStatus.hasOTP && !otpStatus.isUsed && !otpStatus.isExpired;
  }
}

export default OTPService;
