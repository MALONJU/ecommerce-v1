import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  requiredRole = null,
  fallbackComponent = null
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('🛡️ [ProtectedRoute] Route check:', {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      requiredRole
    });
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    if (import.meta.env.DEV) {
      console.log('⏳ [ProtectedRoute] Showing loading state...');
    }

    return (
      fallbackComponent || (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (import.meta.env.DEV) {
      console.log('🔒 [ProtectedRoute] Redirecting to login, saving current location:', location.pathname);
    }

    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRole && user) {
    const userRoles = user.roles || user.role || [];
    const hasRequiredRole = Array.isArray(userRoles)
      ? userRoles.includes(requiredRole)
      : userRoles === requiredRole;

    if (!hasRequiredRole) {
      if (import.meta.env.DEV) {
        console.log('🚫 [ProtectedRoute] Access denied - insufficient role:', {
          required: requiredRole,
          userRoles,
          hasRequiredRole
        });
      }

      // Redirect to unauthorized page or home
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated (and has required role if specified)
  if (import.meta.env.DEV) {
    console.log('✅ [ProtectedRoute] Access granted for:', location.pathname);
  }

  return children;
};

export default ProtectedRoute;