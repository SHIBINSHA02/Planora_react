// src/components/Router.jsx
import React, { useState } from 'react';

const Router = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('home');
  
  const navigate = (route) => {
    setCurrentRoute(route);
  };

  return (
    <div className="router-context">
      {React.Children.map(children, child =>
        React.cloneElement(child, { currentRoute, navigate })
      )}
    </div>
  );
};

export default Router;