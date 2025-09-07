// src/services/teacherService.js

// Base API now aligned to Express app
const API_BASE_URL =  'http://localhost:3000/api/organisation';
class TeacherService {
  // Get all teachers (you'll need to add GET / route to your backend)
  static async getAllTeachers(organisationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${organisationId}/teachers`);
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
  static async getTeacherById(organisationId, id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${organisationId}/teachers/${id}`);
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
  static async createTeacher(organisationId, teacherData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${organisationId}/teachers`, {
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
  static async updateTeacher(organisationId, id, teacherData) {
    try {
      // Remove id from the data since it's in the URL
      const { id: _, ...updateData } = teacherData;
      
      const response = await fetch(`${API_BASE_URL}/${organisationId}/teachers/${id}`, {
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
  static async deleteTeacher(organisationId, id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${organisationId}/teachers/${id}`, {
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

  // Get a teacher's computed schedule within an organisation
  static async getTeacherSchedule(organisationId, id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${organisationId}/teachers/${id}/schedule`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Schedule not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teacher schedule:', error);
      throw error;
    }
  }
}

export default TeacherService;