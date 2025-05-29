import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/apiService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    loading: true
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const users = await userService.getAllUsers();
      const adminUsers = users.filter(user => user.role === 'admin').length;
      const regularUsers = users.filter(user => user.role === 'user').length;
      
      setStats({
        totalUsers: users.length,
        adminUsers,
        regularUsers,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-0">Admin Dashboard</h1>
                <p className="text-muted mb-0">Welcome to the administration panel</p>
              </div>
              <div>
                <span className="badge bg-danger fs-6">Admin Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Total Users</h5>
                    <h2 className="mb-0">
                      {stats.loading ? (
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                      ) : (
                        stats.totalUsers
                      )}
                    </h2>
                  </div>
                  <div className="fs-1 opacity-50">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-danger text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Admin Users</h5>
                    <h2 className="mb-0">
                      {stats.loading ? (
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                      ) : (
                        stats.adminUsers
                      )}
                    </h2>
                  </div>
                  <div className="fs-1 opacity-50">
                    <i className="bi bi-shield-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Regular Users</h5>
                    <h2 className="mb-0">
                      {stats.loading ? (
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                      ) : (
                        stats.regularUsers
                      )}
                    </h2>
                  </div>
                  <div className="fs-1 opacity-50">
                    <i className="bi bi-person"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Admin Tools</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-4 mb-3">
                    <Link 
                      to="/admin/users" 
                      className="text-decoration-none"
                    >
                      <div className="card border-primary h-100 admin-tool-card">
                        <div className="card-body text-center">
                          <div className="mb-3">
                            <i className="bi bi-people fs-1 text-primary"></i>
                          </div>
                          <h5 className="card-title">User Management</h5>
                          <p className="card-text text-muted">
                            Manage user accounts, roles, and permissions
                          </p>
                          <div className="mt-auto">
                            <span className="btn btn-primary btn-sm">
                              Manage Users <i className="bi bi-arrow-right ms-1"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="card border-info h-100 admin-tool-card">
                      <div className="card-body text-center">
                        <div className="mb-3">
                          <i className="bi bi-box-seam fs-1 text-info"></i>
                        </div>
                        <h5 className="card-title">Product Management</h5>
                        <p className="card-text text-muted">
                          Add, edit, and organize product catalog
                        </p>
                        <div className="mt-auto">
                          <span className="btn btn-info btn-sm">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="card border-warning h-100 admin-tool-card">
                      <div className="card-body text-center">
                        <div className="mb-3">
                          <i className="bi bi-graph-up fs-1 text-warning"></i>
                        </div>
                        <h5 className="card-title">Analytics</h5>
                        <p className="card-text text-muted">
                          View reports and system analytics
                        </p>
                        <div className="mt-auto">
                          <span className="btn btn-warning btn-sm">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-tool-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          cursor: pointer;
        }
        
        .admin-tool-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard; 