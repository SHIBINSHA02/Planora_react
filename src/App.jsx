// src/App.jsx
import React from 'react';
import { AuthProvider, useAuth } from './components/Auth/Auth';
import Router from './components/Router';
import Homepage from './components/Home/Home';
import LoginPage from './components/Auth/login';
import SignupPage from './components/Auth/signup';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherScheduleSystem from './components/TeacherScheduleSystem';
import './App.css';

// App Content Component that handles routing
const AppContent = ({ currentRoute, navigate }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Handle route protection - redirect to login if accessing dashboard without auth
  if (currentRoute === 'dashboard' && !user) {
    navigate('login');
    return null;
  }

  // Redirect authenticated users from login/signup to dashboard
  if ((currentRoute === 'login' || currentRoute === 'signup') && user) {
    navigate('dashboard');
    return null;
  }

  switch (currentRoute) {
    case 'login':
      return <LoginPage navigate={navigate} />;
    case 'signup':
      return <SignupPage navigate={navigate} />;
    case 'dashboard':
      return (
        <ProtectedRoute currentRoute={currentRoute} navigate={navigate}>
          <TeacherScheduleSystem navigate={navigate} />
        </ProtectedRoute>
      );
    case 'home':
    default:
      return <Homepage navigate={navigate} />;
  }
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;