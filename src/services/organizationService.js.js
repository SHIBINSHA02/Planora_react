// src/services/organizationService.js.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/organisation';

class OrganizationService {
  // Helper method to check if a value is empty (mimicking backend's is-empty)
  static isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  }

  // Helper method to normalize teacher IDs (convert to consistent format - strings)
  static normalizeTeacherIds(teacherIds) {
    if (!Array.isArray(teacherIds)) {
      return typeof teacherIds === 'string' ? teacherIds : String(teacherIds);
    }
    return teacherIds.map(id => typeof id === 'string' ? id : String(id));
  }

  // Create a new classroom within an organization
  static async createClassroom(classroomData) {
    try {
      // Validate classroom data first
      this.validateClassroomData(classroomData);

      // Normalize teacher IDs to ensure consistency (convert to strings)
      const normalizedData = {
        ...classroomData,
        assignedTeacher: this.normalizeTeacherIds([classroomData.assignedTeacher])[0],
        assignedTeachers: this.normalizeTeacherIds(classroomData.assignedTeachers)
      };

      // Test serialization to catch non-serializable values
      let serializedData;
      try {
        serializedData = JSON.stringify(normalizedData);
        console.log('Sending normalized classroomData:', JSON.stringify(normalizedData, null, 2));
      } catch (e) {
        throw new Error(`Invalid classroomData: Unable to serialize to JSON - ${e.message}`);
      }

      const response = await axios.post(API_BASE_URL, normalizedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      return response.data;
    } catch (error) {
      console.error('Error creating classroom:', error);
      if (error.response) {
        // Log the full server response for debugging
        console.error('Server response:', error.response.data);
        console.error('Response status:', error.response.status);
        const contentType = error.response.headers['content-type'];
        if (contentType && !contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data.slice(0, 100));
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        // Extract error message properly from backend response
        const errorMessage = error.response.data?.message || error.response.data?.error || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Check if the backend is running on port 3000.');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Get a classroom by organizationId and classroomId
  static async getClassroom(organizationId, classroomId) {
    try {
      if (this.isEmpty(organizationId) || this.isEmpty(classroomId)) {
        throw new Error('Organization ID and Classroom ID are required');
      }

      const response = await axios.get(`${API_BASE_URL}/${organizationId}/classroom/${classroomId}`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Classroom or Organization not found');
        }
        const contentType = error.response.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data?.slice(0, 100));
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  // Get all classrooms for an organization
  static async getClassrooms(organizationId) {
    try {
      if (this.isEmpty(organizationId)) {
        throw new Error('Organization ID is required');
      }

      const response = await axios.get(`${API_BASE_URL}/${organizationId}/classrooms`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Organization not found');
        }
        const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  // Update an entire classroom
  static async updateClassroom(organizationId, classroomId, updateData) {
    try {
      if (this.isEmpty(organizationId) || this.isEmpty(classroomId)) {
        throw new Error('Organization ID and Classroom ID are required');
      }

      // Validate updateData to ensure required fields are present
      const requiredFields = ['assignedTeacher', 'assignedTeachers', 'assignedSubjects', 'rows', 'columns', 'grid'];
      for (const field of requiredFields) {
        if (this.isEmpty(updateData[field])) {
          throw new Error(`${field} is required and cannot be empty for classroom update`);
        }
      }

      // Normalize teacher IDs
      const normalizedUpdateData = {
        ...updateData,
        assignedTeacher: this.normalizeTeacherIds([updateData.assignedTeacher])[0],
        assignedTeachers: this.normalizeTeacherIds(updateData.assignedTeachers)
      };

      const response = await axios.put(`${API_BASE_URL}/${organizationId}/classroom/${classroomId}`, normalizedUpdateData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error updating classroom:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Classroom or Organization not found');
        }
        const contentType = error.response.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data?.slice(0, 100));
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  // Update a specific grid cell
  static async updateGridCell(organizationId, classroomId, row, col, cellData) {
    try {
      if (this.isEmpty(organizationId) || this.isEmpty(classroomId)) {
        throw new Error('Organization ID and Classroom ID are required');
      }

      if (row < 0 || col < 0) {
        throw new Error('Row and column must be non-negative numbers');
      }

      // Validate cellData
      if (this.isEmpty(cellData) || !Object.prototype.hasOwnProperty.call(cellData, 'teachers') || !Object.prototype.hasOwnProperty.call(cellData, 'subjects')) {
        throw new Error('cellData must have teachers and subjects properties');
      }
      if (!Array.isArray(cellData.teachers) || !Array.isArray(cellData.subjects)) {
        throw new Error('teachers and subjects in cellData must be arrays');
      }

      // Normalize teacher IDs in cell data
      const normalizedCellData = {
        ...cellData,
        teachers: this.normalizeTeacherIds(cellData.teachers)
      };

      const response = await axios.patch(`${API_BASE_URL}/${organizationId}/classroom/${classroomId}/grid/${row}/${col}`, normalizedCellData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error updating grid cell:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Classroom or Organization not found');
        }
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || 'Invalid grid position or data');
        }
        const contentType = error.response.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
          console.error('Non-JSON response:', error.response.data?.slice(0, 100));
          throw new Error(`Server returned non-JSON response (status: ${error.response.status})`);
        }
        throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  // Delete a classroom
  static async deleteClassroom(organizationId, classroomId) {
    try {
      if (this.isEmpty(organizationId) || this.isEmpty(classroomId)) {
        throw new Error('Organization ID and Classroom ID are required');
      }

      const response = await axios.delete(`${API_BASE_URL}/${organizationId}/classroom/${classroomId}`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting classroom:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Classroom or Organization not found');
        }
        throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
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
      if (this.isEmpty(cell) || !Object.prototype.hasOwnProperty.call(cell, 'teachers') || !Object.prototype.hasOwnProperty.call(cell, 'subjects')) {
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
      'organisationId',
      'admin',
      'classroomId',
      'assignedTeacher',
      'assignedTeachers',
      'assignedSubjects',
      'rows',
      'columns',
      'grid'
    ];

    // Check for missing or empty fields
    for (const field of required) {
      if (this.isEmpty(classroomData[field])) {
        throw new Error(`${field} is required and cannot be empty`);
      }
    }

    // Validate assignedTeacher (can be string or number, will be normalized)
    if (this.isEmpty(classroomData.assignedTeacher)) {
      throw new Error('assignedTeacher must be provided');
    }

    // Validate arrays
    if (!Array.isArray(classroomData.assignedTeachers) || classroomData.assignedTeachers.length === 0) {
      throw new Error('assignedTeachers must be a non-empty array');
    }

    if (!Array.isArray(classroomData.assignedSubjects) || classroomData.assignedSubjects.length === 0) {
      throw new Error('assignedSubjects must be a non-empty array');
    }

    // Validate grid dimensions
    if (!Number.isInteger(classroomData.rows) || classroomData.rows <= 0) {
      throw new Error('rows must be a positive integer');
    }
    if (!Number.isInteger(classroomData.columns) || classroomData.columns <= 0) {
      throw new Error('columns must be a positive integer');
    }

    const expectedCells = classroomData.rows * classroomData.columns;
    if (!Array.isArray(classroomData.grid) || classroomData.grid.length !== expectedCells) {
      throw new Error(`Grid must be an array with exactly ${expectedCells} cells (${classroomData.rows} rows × ${classroomData.columns} columns)`);
    }

    // Validate grid data
    this.validateGridData(classroomData.grid);

    return true;
  }

  // Validate teachers exist by checking against the teachers API
  static async validateTeachersExist(teacherIds) {
    try {
      const validTeachers = await this.getValidTeachers();
      const validTeacherIds = validTeachers.map(teacher => String(teacher.id)); // Your backend uses 'id' field
      
      const idsToCheck = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
      const normalizedIds = idsToCheck.map(id => String(id));
      
      const invalidTeachers = normalizedIds.filter(id => !validTeacherIds.includes(id));
      
      if (invalidTeachers.length > 0) {
        throw new Error(`Invalid teacher IDs: ${invalidTeachers.join(', ')}`);
      }
      
      return true;
    } catch (error) {
      console.warn('Could not validate teachers:', error.message);
      // Return true to allow API call - let backend handle validation
      return true;
    }
  }

  // Fetch valid teachers to validate assignedTeacher and assignedTeachers
  static async getValidTeachers() {
    try {
      const response = await axios.get('http://localhost:3000/api/teachers', {
        timeout: 5000
      });
      return response.data || []; // Expecting an array of teacher objects with 'id' field
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw new Error('Failed to fetch valid teachers. Please check if the teachers API is available.');
    }
  }

  // Get a specific teacher by ID
  static async getTeacher(teacherId) {
    try {
      if (this.isEmpty(teacherId)) {
        throw new Error('Teacher ID is required');
      }

      const response = await axios.get(`http://localhost:3000/api/teachers/${teacherId}`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      if (error.response && error.response.status === 404) {
        throw new Error('Teacher not found');
      }
      throw new Error('Failed to fetch teacher details');
    }
  }

  // Create a new teacher
  static async createTeacher(teacherData) {
    try {
      const { id, name, subjects, classes } = teacherData;
      
      if (this.isEmpty(id) || this.isEmpty(name)) {
        throw new Error('Teacher ID and name are required');
      }

      const response = await axios.post('http://localhost:3000/api/teachers', {
        id: String(id), // Ensure ID is string
        name,
        subjects: subjects || [],
        classes: classes || []
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.error('Error creating teacher:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to create teacher');
      }
      throw new Error('Failed to create teacher');
    }
  }

  // Update a teacher
  static async updateTeacher(teacherId, updateData) {
    try {
      if (this.isEmpty(teacherId)) {
        throw new Error('Teacher ID is required');
      }

      const response = await axios.put(`http://localhost:3000/api/teachers/${teacherId}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.error('Error updating teacher:', error);
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Teacher not found');
        }
        throw new Error(error.response.data?.message || 'Failed to update teacher');
      }
      throw new Error('Failed to update teacher');
    }
  }

  // Delete a teacher
  static async deleteTeacher(teacherId) {
    try {
      if (this.isEmpty(teacherId)) {
        throw new Error('Teacher ID is required');
      }

      const response = await axios.delete(`http://localhost:3000/api/teachers/${teacherId}`, {
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.error('Error deleting teacher:', error);
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Teacher not found');
        }
        throw new Error(error.response.data?.message || 'Failed to delete teacher');
      }
      throw new Error('Failed to delete teacher');
    }
  }

  // Helper method to get teacher names from IDs
  static async getTeacherNames(teacherIds) {
    try {
      const teachers = await this.getValidTeachers();
      const idsToFind = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
      const normalizedIds = idsToFind.map(id => String(id));
      
      const teacherNames = {};
      teachers.forEach(teacher => {
        if (normalizedIds.includes(String(teacher.id))) {
          teacherNames[teacher.id] = teacher.name;
        }
      });

      return teacherNames;
    } catch (error) {
      console.error('Error getting teacher names:', error);
      return {};
    }
  }

  // Enhanced method to format classroom data with teacher names
  static async formatClassroomWithTeacherNames(classroom) {
    if (!classroom) return null;

    try {
      const allTeacherIds = [classroom.assignedTeacher, ...classroom.assignedTeachers];
      const teacherNames = await this.getTeacherNames(allTeacherIds);

      return {
        ...classroom,
        assignedTeacherName: teacherNames[classroom.assignedTeacher] || 'Unknown',
        assignedTeachersNames: classroom.assignedTeachers.map(id => teacherNames[id] || 'Unknown'),
        gridSummary: {
          totalCells: classroom.grid?.length || 0,
          filledCells: classroom.grid?.filter(cell => 
            (cell.teachers && cell.teachers.length > 0) || 
            (cell.subjects && cell.subjects.length > 0)
          ).length || 0
        }
      };
    } catch (error) {
      console.error('Error formatting classroom with teacher names:', error);
      return classroom;
    }
  }

  // Utility method to check API health
  static async checkApiHealth() {
    try {
      // Check both organization and teacher APIs
      const [orgHealth, teacherHealth] = await Promise.allSettled([
        axios.get('http://localhost:3000/api/organisation', { timeout: 3000 }),
        axios.get('http://localhost:3000/api/teachers', { timeout: 3000 })
      ]);

      return {
        organisation: orgHealth.status === 'fulfilled',
        teachers: teacherHealth.status === 'fulfilled',
        overall: orgHealth.status === 'fulfilled' && teacherHealth.status === 'fulfilled'
      };
    } catch (error) {
      console.error('API health check failed:', error.message);
      return {
        organisation: false,
        teachers: false,
        overall: false
      };
    }
  }
}

export default OrganizationService;