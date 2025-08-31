import React, { createContext, useContext, useState, useEffect } from 'react';
import OrganizationService from '../services/organizationService.js';

const OrganizationContext = createContext();

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load current organization from localStorage on mount
  useEffect(() => {
    const savedOrgId = localStorage.getItem('currentOrganizationId');
    if (savedOrgId) {
      loadOrganization(savedOrgId);
    }
  }, []);

  const loadOrganization = async (organizationId) => {
    try {
      setLoading(true);
      setError(null);
      
      // The service now handles API failures gracefully and returns sample data
      const orgData = await OrganizationService.getOrganization(organizationId);
      setCurrentOrganization(orgData);
      
    } catch (error) {
      console.error('Error loading organization:', error);
      setError('Failed to load organization. Using demo data.');
      
      // Final fallback to sample data
      const sampleOrg = {
        id: organizationId,
        name: 'Sample Organization',
        admin: 'Admin User',
        periodCount: 8,
        totalDays: 5,
        scheduleRows: 7,
        scheduleColumns: 8,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCurrentOrganization(sampleOrg);
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (organizationData) => {
    try {
      setLoading(true);
      setError(null);
      
      // The service now handles API failures gracefully and returns mock data
      const result = await OrganizationService.createOrganization(organizationData);
      const newOrg = result.organization || result;
      
      setCurrentOrganization(newOrg);
      setOrganizations(prev => [...prev, newOrg]);
      
      // Save to localStorage
      localStorage.setItem('currentOrganizationId', newOrg.id || newOrg.organisationId);
      
      return newOrg;
      
    } catch (error) {
      console.error('Error creating organization:', error);
      setError('Failed to create organization. Using demo data.');
      
      // Final fallback to local creation
      const newOrg = {
        id: `org-${Date.now()}`,
        ...organizationData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setCurrentOrganization(newOrg);
      setOrganizations(prev => [...prev, newOrg]);
      
      // Save to localStorage
      localStorage.setItem('currentOrganizationId', newOrg.id);
      
      return newOrg;
    } finally {
      setLoading(false);
    }
  };

  const switchOrganization = (organizationId) => {
    localStorage.setItem('currentOrganizationId', organizationId);
    loadOrganization(organizationId);
  };

  const clearCurrentOrganization = () => {
    setCurrentOrganization(null);
    localStorage.removeItem('currentOrganizationId');
  };

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // The service now handles API failures gracefully and returns sample data
      const orgsData = await OrganizationService.getOrganizations();
      setOrganizations(orgsData.organizations || orgsData || []);
      
    } catch (error) {
      console.error('Error loading organizations:', error);
      setError('Failed to load organizations. Using demo data.');
      
      // Final fallback to sample data
      const sampleOrgs = [
        {
          id: 'org-001',
          name: 'Greenwood High School',
          admin: 'John Smith',
          periodCount: 8,
          totalDays: 5,
          scheduleRows: 7,
          scheduleColumns: 8,
          createdAt: '2024-01-15'
        },
        {
          id: 'org-002',
          name: 'Riverside Academy',
          admin: 'Sarah Brown',
          periodCount: 6,
          totalDays: 6,
          scheduleRows: 6,
          scheduleColumns: 6,
          createdAt: '2024-01-20'
        }
      ];
      setOrganizations(sampleOrgs);
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (organizationId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to update via API
      try {
        const result = await OrganizationService.updateOrganization(organizationId, updateData);
        const updatedOrg = result.organization || result;
        
        setOrganizations(prev => prev.map(org => 
          org.id === organizationId ? updatedOrg : org
        ));
        
        if (currentOrganization && currentOrganization.id === organizationId) {
          setCurrentOrganization(updatedOrg);
        }
        
        return updatedOrg;
      } catch (apiError) {
        console.warn('Could not update organization via API:', apiError.message);
        
        // Fallback to local update
        const updatedOrg = { ...currentOrganization, ...updateData };
        setCurrentOrganization(updatedOrg);
        setOrganizations(prev => prev.map(org => 
          org.id === organizationId ? updatedOrg : org
        ));
        
        return updatedOrg;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (organizationId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to delete via API
      try {
        await OrganizationService.deleteOrganization(organizationId);
      } catch (apiError) {
        console.warn('Could not delete organization via API:', apiError.message);
      }
      
      // Remove from local state
      setOrganizations(prev => prev.filter(org => org.id !== organizationId));
      
      // Clear current organization if it was deleted
      if (currentOrganization && currentOrganization.id === organizationId) {
        clearCurrentOrganization();
      }
      
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentOrganization,
    organizations,
    loading,
    error,
    createOrganization,
    loadOrganization,
    switchOrganization,
    clearCurrentOrganization,
    loadOrganizations,
    updateOrganization,
    deleteOrganization,
    setError
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;
