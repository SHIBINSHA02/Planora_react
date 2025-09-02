// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/auth';

class AuthService {
  static async register({ username, email, password, firstName, lastName }) {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      email,
      password,
      firstName,
      lastName
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    return response.data;
  }

  static async login({ usernameOrEmail, password }) {
    // Backend expects either username or email in the 'username' field
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username: usernameOrEmail,
      password
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    return response.data;
  }
}

export default AuthService;


