import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Navbar from './components/Navbar.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import Shop from './pages/Shop.jsx';
import Orders from './pages/Orders.jsx';
import './App.css';
import Products from './pages/Products.jsx';

// Example components (you may need to create these)
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

            {/* Shop route - accessible to all authenticated users */}
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />

            {/* Orders route - accessible to all authenticated users */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Orders />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Products />
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

            {/* Admin Orders Management */}
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOrders />
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
            <Route path="/" element={<Navigate to="/shop" replace />} />

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