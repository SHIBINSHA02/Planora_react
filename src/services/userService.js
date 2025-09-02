// src/services/userService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class UserService {
  static async getUser(userId) {
    const res = await axios.get(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`, { timeout: 10000 });
    return res.data;
  }

  static async getUserOrganizations(userId) {
    const res = await axios.get(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/organizations`, { timeout: 10000 });
    return res.data; // expect { organizations: [...] }
  }

  static async getLinkedTeacher(userId) {
    const res = await axios.get(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/teacher`, { timeout: 10000 });
    return res.data; // teacher or null
  }

  static async createTeacherForUser(userId, teacherPayload) {
    const res = await axios.post(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/create-teacher`, teacherPayload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    });
    return res.data;
  }

  static async linkTeacher(userId, teacherId) {
    const res = await axios.post(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/link-teacher`, { teacherId }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    return res.data;
  }
}

export default UserService;


