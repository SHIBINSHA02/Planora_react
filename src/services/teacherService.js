// src/services/teacherService.js

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL =  'http://localhost:5000/api/teachers';
class TeacherService {
  // Get all teachers (you'll need to add GET / route to your backend)
  static async getAllTeachers() {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  }

  // Get teacher by ID (uses your existing GET /:id route)
  static async getTeacherById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Teacher not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw error;
    }
  }

  // Create a new teacher (uses your existing POST / route)
  static async createTeacher(teacherData) {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  }

  // Update teacher by ID (uses your existing PUT /:id route)
  static async updateTeacher(id, teacherData) {
    try {
      // Remove id from the data since it's in the URL
      const { id: _, ...updateData } = teacherData;
      
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error('Teacher not found');
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  }

  // Delete teacher by ID (uses your existing DELETE /:id route)
  static async deleteTeacher(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Teacher not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  }
}

export default TeacherService;