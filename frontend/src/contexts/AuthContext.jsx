import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService.js';
import { tokenManager } from '../utils/axiosConfig.js';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if user is authenticated based on token validity
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Get user data from storage
          const userData = authService.getCurrentUserData();
          setUser(userData);

          // Optionally fetch fresh user data from server
          // This is useful to ensure user data is up-to-date
          authService.getCurrentUser()
            .then(response => {
              setUser(response.user || response);
              // Update stored user data
              const rememberMe = !!localStorage.getItem('authToken');
              tokenManager.setUserData(response.user || response, rememberMe);
            })
            .catch(error => {
              console.warn('Failed to fetch current user:', error);
              // If fetching user fails, we might want to logout
              if (error.isAuthError) {
                logout();
              }
            });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials, rememberMe);

      if (response.token) {
        setIsAuthenticated(true);
        setUser(response.user || response);
        return response;
      }

      throw new Error('Login failed - no token received');
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData, rememberMe);

      if (response.token) {
        setIsAuthenticated(true);
        setUser(response.user || response);
        return response;
      }

      throw new Error('Registration failed - no token received');
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Even if logout API fails, we should clear local state
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);

    // Update stored user data
    const rememberMe = !!localStorage.getItem('authToken');
    tokenManager.setUserData(userData, rememberMe);
  };

  const refreshAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      // Fetch fresh user data
      const response = await authService.getCurrentUser();
      setUser(response.user || response);

      // Update stored user data
      const rememberMe = !!localStorage.getItem('authToken');
      tokenManager.setUserData(response.user || response, rememberMe);

      return true;
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      if (error.isAuthError) {
        setIsAuthenticated(false);
        setUser(null);
      }
      return false;
    }
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    register,
    logout,
    updateUser,
    refreshAuth,

    // Utilities
    isTokenValid: () => authService.validateToken(),
    getUserData: () => authService.getCurrentUserData(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;