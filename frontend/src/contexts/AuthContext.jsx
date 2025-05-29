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

        if (import.meta.env.DEV) {
          console.log('🔐 [Auth Init] Authentication status:', authenticated);
        }

        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Get user data from storage
          const userData = authService.getCurrentUserData();
          setUser(userData);

          if (import.meta.env.DEV) {
            console.log('👤 [Auth Init] User data from storage:', userData);
          }

          // Optionally fetch fresh user data from server
          // This is useful to ensure user data is up-to-date
          authService.getCurrentUser()
            .then(response => {
              const freshUserData = response.user || response;
              setUser(freshUserData);

              // Update stored user data
              const rememberMe = !!localStorage.getItem('authToken');
              tokenManager.setUserData(freshUserData, rememberMe);

              if (import.meta.env.DEV) {
                console.log('👤 [Auth Init] Fresh user data from server:', freshUserData);
              }
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

      if (import.meta.env.DEV) {
        console.log('🔐 [Auth Login] Attempting login...');
      }

      const response = await authService.login(credentials, rememberMe);

      if (response.token) {
        const userData = response.user || response;

        setIsAuthenticated(true);
        setUser(userData);

        if (import.meta.env.DEV) {
          console.log('✅ [Auth Login] Login successful:', { user: userData, hasToken: !!response.token });
        }

        return response;
      }

      throw new Error('Login failed - no token received');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ [Auth Login] Login failed:', error);
      }

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

      if (import.meta.env.DEV) {
        console.log('🔐 [Auth Register] Attempting registration...');
      }

      const response = await authService.register(userData, rememberMe);

      if (response.token) {
        const newUserData = response.user || response;

        setIsAuthenticated(true);
        setUser(newUserData);

        if (import.meta.env.DEV) {
          console.log('✅ [Auth Register] Registration successful:', { user: newUserData, hasToken: !!response.token });
        }

        return response;
      }

      throw new Error('Registration failed - no token received');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ [Auth Register] Registration failed:', error);
      }

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

      if (import.meta.env.DEV) {
        console.log('🔐 [Auth Logout] Attempting logout...');
      }

      await authService.logout();

      if (import.meta.env.DEV) {
        console.log('✅ [Auth Logout] Logout successful');
      }
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

    if (import.meta.env.DEV) {
      console.log('👤 [Auth Update] User data updated:', userData);
    }
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
      const freshUserData = response.user || response;
      setUser(freshUserData);

      // Update stored user data
      const rememberMe = !!localStorage.getItem('authToken');
      tokenManager.setUserData(freshUserData, rememberMe);

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