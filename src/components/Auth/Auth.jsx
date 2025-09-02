// src/components/Auth/Auth.jsx
// src/components/Auth/Auth.js
// src/auth.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import AuthService from '../../services/authService';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(savedUser);
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const { user: userResponse } = await AuthService.login({ usernameOrEmail, password });
    setUser(userResponse);
    localStorage.setItem('user', JSON.stringify(userResponse));
    return userResponse;
  };

  const signup = async ({ username, email, password, firstName, lastName }) => {
    const { user: registeredUser } = await AuthService.register({ username, email, password, firstName, lastName });
    setUser(registeredUser);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    return registeredUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};