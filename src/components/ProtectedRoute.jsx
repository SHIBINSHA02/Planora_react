// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from './Auth/Auth';
import LoginPage from './Auth/login';

const ProtectedRoute = ({ children, currentRoute, navigate }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage currentRoute={currentRoute} navigate={navigate} />;
  }

  return children;
};

export default ProtectedRoute;