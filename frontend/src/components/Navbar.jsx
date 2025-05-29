import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Don't show navbar on login/register pages or if not authenticated
  const hideNavbarRoutes = ['/login', '/register'];
  if (!isAuthenticated || hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user role for display
  const getUserRole = () => {
    if (!user) return '';

    const roles = user.roles || user.role || [];
    if (Array.isArray(roles)) {
      return roles.length > 0 ? roles.join(', ') : 'User';
    }
    return roles || 'User';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.firstName || user.username || 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <i className="bi bi-shop me-2"></i>
          E-Commerce
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left side navigation */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={isActiveRoute('/dashboard')} to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActiveRoute('/shop')} to="/shop">
                <i className="bi bi-shop me-1"></i>
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActiveRoute('/products')} to="/products">
                <i className="bi bi-box-seam me-1"></i>
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActiveRoute('/profile')} to="/profile">
                <i className="bi bi-person me-1"></i>
                Profile
              </Link>
            </li>

            {/* Admin link - only show if user has admin role */}
            {getUserRole().toLowerCase().includes('admin') && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-gear me-1"></i>
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/users">
                      <i className="bi bi-people me-2"></i>
                      User Management
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Right side - User info and logout */}
          <ul className="navbar-nav">
            {/* User info dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center">
                  {/* User avatar with initials */}
                  <div className="user-avatar rounded-circle d-flex align-items-center justify-content-center me-2"
                       style={{ width: '32px', height: '32px' }}>
                    {getUserInitials()}
                  </div>

                  {/* User info - hidden on mobile */}
                  <div className="d-none d-md-block text-start">
                    <div className="fw-semibold" style={{ fontSize: '0.9rem', lineHeight: '1.1' }}>
                      {getUserDisplayName()}
                    </div>
                    <div className="text-light opacity-75" style={{ fontSize: '0.75rem', lineHeight: '1.1' }}>
                      {getUserRole()}
                    </div>
                  </div>

                  {/* Mobile - show only name */}
                  <div className="d-block d-md-none">
                    <span className="fw-semibold">{getUserDisplayName()}</span>
                  </div>
                </div>
              </a>

              {/* Dropdown menu */}
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <div className="dropdown-header">
                    <div className="fw-semibold">{getUserDisplayName()}</div>
                    <small className="text-muted">{getUserRole()}</small>
                    {user?.email && <small className="text-muted d-block">{user.email}</small>}
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); /* Add settings modal */ }}>
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger d-flex align-items-center"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </>
                    )}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;