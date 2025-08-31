import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/organization';

class OrganizationService {
  // Create a new classroom within an organization
  static async createClassroom(classroomData) {
    try {
      console.log('Sending classroomData:', classroomData); // Debug logging
      const response = await axios.post(API_BASE_URL, classroomData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating classroom:', error);
      if (error.response) {
        // Server responded with a status code (e.g., 404, 500)
        const contentType = error.response.headers['content-type'];
        if (contentType && !contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data.slice(0, 100)); // Log first 100 chars
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      } else if (error.request) {
        // No response received (e.g., network error)
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        // Error setting up the request
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Get a classroom by organizationId and classroomId
  static async getClassroom(organizationId, classroomId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${organizationId}/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom:', error);
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Classroom or Organization not found');
        }
        const contentType = error.response.headers['content-type'];
        if (contentType && !contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data.slice(0, 100));
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  // Update an entire classroom
  static async updateClassroom(organizationId, classroomId, updateData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${organizationId}/classroom/${classroomId}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating classroom:', error);
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Classroom or Organization not found');
        }
        const contentType = error.response.headers['content-type'];
        if (contentType && !contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data.slice(0, 100));
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  // Update a specific grid cell
  static async updateGridCell(organizationId, classroomId, row, col, cellData) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${organizationId}/classroom/${classroomId}/grid/${row}/${col}`, cellData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating grid cell:', error);
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Classroom or Organization not found');
        }
        if (error.response.status === 400) {
          throw new Error(error.response.data.message || 'Invalid grid position or data');
        }
        const contentType = error.response.headers['content-type'];
        if (contentType && !contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data.slice(0, 100));
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  // Helper method to validate grid data before sending
  static validateGridData(gridData) {
    if (!Array.isArray(gridData)) {
      throw new Error('Grid data must be an array');
    }

    for (let i = 0; i < gridData.length; i++) {
      const cell = gridData[i];
      if (!Object.prototype.hasOwnProperty.call(cell, 'teachers') || !Object.prototype.hasOwnProperty.call(cell, 'subjects')) {
        throw new Error(`Grid cell at index ${i} must have 'teachers' and 'subjects' properties`);
      }
      if (!Array.isArray(cell.teachers) || !Array.isArray(cell.subjects)) {
        throw new Error(`Grid cell at index ${i}: 'teachers' and 'subjects' must be arrays`);
      }
    }
    return true;
  }

  // Helper method to validate classroom data before creating
  static validateClassroomData(classroomData) {
    const required = [
      'organisationId', 'admin', 'classroomId', 'assignedTeacher', 
      'assignedTeachers', 'assignedSubjects', 'rows', 'columns', 'grid'
    ];

    for (const field of required) {
      if (!Object.prototype.hasOwnProperty.call(classroomData, field) || classroomData[field] === '' || classroomData[field] === null || classroomData[field] === undefined) {
        throw new Error(`${field} is required`);
      }
    }

    // Validate arrays
    if (!Array.isArray(classroomData.assignedTeachers) || classroomData.assignedTeachers.length === 0) {
      throw new Error('assignedTeachers must be a non-empty array');
    }

    if (!Array.isArray(classroomData.assignedSubjects) || classroomData.assignedSubjects.length === 0) {
      throw new Error('assignedSubjects must be a non-empty array');
    }

    if (!Array.isArray(classroomData.grid)) {
      throw new Error('grid must be an array');
    }

    // Validate grid dimensions
    const expectedCells = classroomData.rows * classroomData.columns;
    if (classroomData.grid.length !== expectedCells) {
      throw new Error(`Grid must have exactly ${expectedCells} cells (${classroomData.rows} rows × ${classroomData.columns} columns)`);
    }

    // Validate grid data
    this.validateGridData(classroomData.grid);

    return true;
  }
}

export default OrganizationService;