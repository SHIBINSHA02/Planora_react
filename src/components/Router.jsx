// src/components/Router.jsx
import React, { useState, useEffect } from 'react';

const Router = ({ children }) => {
  // Initialize route from URL or default to 'home'
  const getInitialRoute = () => {
    const path = window.location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  
  const navigate = (route) => {
    setCurrentRoute(route);
    
    // Update browser URL based on route
    let path = '/';
    switch (route) {
      case 'dashboard':
        path = '/dashboard';
        break;
      case 'login':
        path = '/login';
        break;
      case 'signup':
        path = '/signup';
        break;
      case 'home':
      default:
        path = '/';
        break;
    }
    
    // Update browser URL without page reload
    window.history.pushState({ route }, '', path);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const route = event.state?.route || getInitialRoute();
      setCurrentRoute(route);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state
    window.history.replaceState({ route: currentRoute }, '', 
      currentRoute === 'home' ? '/' : `/${currentRoute}`
    );

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentRoute]);

  return (
    <div className="router-context">
      {React.Children.map(children, child =>
        React.cloneElement(child, { currentRoute, navigate })
      )}
    </div>
  );
};

export default Router;