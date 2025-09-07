// src/services/userService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Simple in-memory cache and inflight dedupe per session
const userOrgCache = new Map(); // key: userId -> { organizations }
const userOrgInflight = new Map(); // key: userId -> Promise

class UserService {
  static async getUser(userId) {
    const res = await axios.get(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`, { timeout: 10000 });
    return res.data;
  }

  static async getUserOrganizations(userId) {
    if (!userId) throw new Error('userId is required');
    if (userOrgCache.has(userId)) return userOrgCache.get(userId);
    if (userOrgInflight.has(userId)) return await userOrgInflight.get(userId);

    const promise = axios
      .get(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/organizations`, { timeout: 10000 })
      .then((res) => {
        const data = res.data;
        userOrgCache.set(userId, data);
        userOrgInflight.delete(userId);
        return data;
      })
      .catch((err) => {
        userOrgInflight.delete(userId);
        throw err;
      });

    userOrgInflight.set(userId, promise);
    return await promise; // expect { organizations: [...] }
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


