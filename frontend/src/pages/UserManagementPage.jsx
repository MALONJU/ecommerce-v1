import React from 'react';
import UserManagement from '../components/UserManagement';

const UserManagementPage = () => {
  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div>
                <h1 className="h3 mb-0">Admin Panel</h1>
                <p className="text-muted mb-0">Manage users and their permissions</p>
              </div>
              <div className="text-end">
                <span className="badge bg-danger fs-6">Admin Only</span>
              </div>
            </div>
          </div>
        </div>
        
        <UserManagement />
      </div>
    </div>
  );
};

export default UserManagementPage; 