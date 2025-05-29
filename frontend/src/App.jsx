import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Shop from './pages/Shop.jsx';
import './App.css';
import Products from './pages/Products.jsx';

// Example components (you may need to create these)
const Dashboard = () => <div className="container mt-4"><h1>Dashboard</h1></div>;
const Profile = () => <div className="container mt-4"><h1>Profile</h1></div>;
const Unauthorized = () => (
  <div className="container mt-4">
    <div className="alert alert-danger">
      <h4>Access Denied</h4>
      <p>You don't have permission to access this resource.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Navbar - will only show when authenticated and not on login/register */}
          <Navbar />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Shop route - accessible to all authenticated users */}
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin-only route example */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Management - Admin Only */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <div className="container mt-4">
                  <div className="alert alert-warning">
                    <h4>Page Not Found</h4>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;