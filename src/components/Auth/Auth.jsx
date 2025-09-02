// src/components/Auth/Auth.jsx
// src/components/Auth/Auth.js
// src/auth.js
import React, { useState, useEffect, createContext, useContext } from 'react';

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

  const login = (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo users for testing
        const demoUsers = [
          { id: 1, email: 'teacher@school.com', password: 'password123', name: 'John Doe' },
          { id: 2, email: 'admin@school.com', password: 'admin123', name: 'Jane Smith' }
        ];
        
        const foundUser = demoUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const signup = (userData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          ...userData
        };
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      }, 1000);
    });
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