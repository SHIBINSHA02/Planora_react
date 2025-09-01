// src/App.jsx
import React from 'react';
import { AuthProvider, useAuth } from './components/Auth/Auth';
import { OrganizationProvider, useOrganization } from './contexts/OrganizationContext';
import Router from './components/Router';
import Homepage from './components/Home/Home';
import LoginPage from './components/Auth/login';
import SignupPage from './components/Auth/signup';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherScheduleSystem from './components/TeacherScheduleSystem';
import OrganizationManagement from './components/Organization/OrganizationManagement';
import './App.css';

// App Content Component that handles routing
const AppContent = ({ currentRoute, navigate }) => {
  const { user, loading } = useAuth();
  const { currentOrganization, loading: orgLoading } = useOrganization();

  if (loading || orgLoading) {
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

  // Handle organization requirement for dashboard access
  if (currentRoute === 'dashboard' && user && !currentOrganization) {
    // If user is authenticated but no organization is selected, redirect to organization management
    navigate('organization');
    return null;
  }

  // Redirect authenticated users from login/signup to appropriate page
  if ((currentRoute === 'login' || currentRoute === 'signup') && user) {
    // If user has organization, go to dashboard, otherwise go to organization management
    if (currentOrganization) {
      navigate('dashboard');
    } else {
      navigate('organization');
    }
    return null;
  }

  switch (currentRoute) {
    case 'login':
      return <LoginPage navigate={navigate} />;
    case 'signup':
      return <SignupPage navigate={navigate} />;
    case 'organization':
      return <OrganizationManagement navigate={navigate} />;
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
      <OrganizationProvider>
        <Router>
          <AppContent />
        </Router>
      </OrganizationProvider>
    </AuthProvider>
  );
};

export default App;