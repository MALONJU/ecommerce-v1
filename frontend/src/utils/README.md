# Axios Configuration & API Services

## Overview

This directory contains a comprehensive axios configuration and API service layer for the e-commerce application. The setup provides:

- Centralized base URL configuration
- Request/response interceptors with automatic token refresh
- Standardized authentication token management
- Enhanced error handling and logging
- Retry logic for failed requests
- File upload/download capabilities
- Request queue management
- Race condition protection for token refresh

## Files

- `axiosConfig.js` - Main axios configuration with interceptors and token management utilities
- `../services/apiService.js` - Pre-built API service methods for common operations

## Environment Variables

Create a `.env` file in the frontend root with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# CORS Configuration (set to false if experiencing CORS issues)
VITE_WITH_CREDENTIALS=false

# Application Environment
VITE_APP_ENV=development

# Optional: Enable/disable request logging
VITE_ENABLE_API_LOGGING=true
```

**Important CORS Notes:**
- Set `VITE_WITH_CREDENTIALS=true` only if your backend supports credentials and has proper CORS headers
- If you're getting CORS errors, try setting `VITE_WITH_CREDENTIALS=false` first
- Ensure your backend API has the correct CORS configuration for your frontend domain

## 🔐 Authentication & Token Management

### Token Storage Strategy

The system uses **standardized token storage keys** across the application:

- `authToken` - Access token (JWT)
- `refreshToken` - Refresh token for automatic token renewal
- `userData` - User profile data

Tokens are stored in either `localStorage` (persistent) or `sessionStorage` (session-only) based on the "Remember Me" preference.

### Automatic Token Refresh

The axios response interceptor automatically handles token refresh when:

1. **401 Unauthorized** response is received
2. A valid refresh token exists
3. Request hasn't been retried already

**Flow:**
```
API Request → 401 Response → Check Refresh Token → Refresh Access Token → Retry Original Request
```

**Race Condition Protection:**
- Multiple concurrent requests triggering 401 are queued
- Only one refresh request is made at a time
- Queued requests are resolved with the new token

### Token Manager API

```javascript
import { tokenManager } from '../utils/axiosConfig.js';

// Check if user is authenticated
const isAuth = tokenManager.getAccessToken() && !tokenManager.isTokenExpired(token);

// Get tokens
const accessToken = tokenManager.getAccessToken();
const refreshToken = tokenManager.getRefreshToken();

// Set tokens (rememberMe determines storage location)
tokenManager.setTokens(accessToken, refreshToken, rememberMe);

// Store user data
tokenManager.setUserData(userData, rememberMe);

// Get user data
const userData = tokenManager.getUserData();

// Clear all authentication data
tokenManager.clearTokens();

// Check if token is expired
const isExpired = tokenManager.isTokenExpired(token);
```

## Usage

### Authentication Services

```javascript
import { authService } from '../services/apiService.js';

// Login with remember me option
const response = await authService.login(
  { email: 'user@example.com', password: 'password' },
  true // rememberMe - stores tokens in localStorage instead of sessionStorage
);

// Register with remember me option
const response = await authService.register(
  { name: 'John Doe', email: 'user@example.com', password: 'password' },
  false // rememberMe = false - stores in sessionStorage
);

// Check authentication status (no API call)
const isAuthenticated = authService.isAuthenticated();

// Get current user data from storage (no API call)
const userData = authService.getCurrentUserData();

// Validate token without API call
const isValid = authService.validateToken();

// Logout (clears tokens and calls logout endpoint)
await authService.logout();
```

### API Client Usage

```javascript
import apiClient from '../utils/axiosConfig.js';

// All requests automatically include Bearer token if available
// and handle token refresh on 401 responses

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', userData);

// PUT request
const updatedUser = await apiClient.put('/users/123', userData);

// DELETE request
await apiClient.delete('/users/123');
```

### Using Pre-built Services

```javascript
import { productService, userService, orderService } from '../services/apiService.js';

// Products
const products = await productService.getProducts();
const product = await productService.getProduct('123');
await productService.createProduct(productData);
await productService.updateProduct('123', productData);
await productService.deleteProduct('123');

// User profile
const profile = await userService.getProfile();
await userService.updateProfile(profileData);

// Orders
const orders = await orderService.getOrders();
await orderService.createOrder(orderData);
```

### File Upload with Progress

```javascript
import { fileService } from '../services/apiService.js';

const handleFileUpload = async (file) => {
  const onProgress = (progress) => {
    console.log(`Upload progress: ${progress}%`);
  };

  const result = await fileService.uploadImage(file, onProgress);
  return result;
};
```

### Error Handling

The axios interceptor enhances errors with additional properties:

```javascript
try {
  const response = await apiClient.get('/protected-endpoint');
} catch (error) {
  // Enhanced error properties
  console.log(error.isAuthError);      // true for 401 errors
  console.log(error.isForbiddenError); // true for 403 errors
  console.log(error.isServerError);    // true for 5xx errors
  console.log(error.isCorsError);      // true for CORS issues
  console.log(error.status);           // HTTP status code
  console.log(error.data);             // Response data
  console.log(error.message);          // Error message
  console.log(error.timestamp);        // Error timestamp
}
```

### Request Retry with Exponential Backoff

```javascript
import apiClient from '../utils/axiosConfig.js';

// Retry failed requests (excludes auth errors)
const result = await apiClient.withRetry(
  { method: 'get', url: '/unreliable-endpoint' },
  3,     // retries
  1000   // initial delay in ms
);
```

### Cancel Requests

```javascript
import { cancelToken } from '../utils/axiosConfig.js';

const source = cancelToken.create();

// Make request with cancel token
const response = await apiClient.get('/users', {
  cancelToken: source.token
});

// Cancel the request
source.cancel('Request cancelled by user');
```

## 🚨 Breaking Changes from Previous Version

### Token Storage Keys

**OLD** (Inconsistent):
```javascript
localStorage.setItem('token', accessToken);     // LoginForm
localStorage.setItem('authToken', accessToken); // axiosConfig
```

**NEW** (Standardized):
```javascript
// Always use tokenManager
tokenManager.setTokens(accessToken, refreshToken, rememberMe);
```

### API Service Usage

**OLD** (Direct axios):
```javascript
import axios from 'axios';
const response = await axios.post('http://localhost:3000/api/auth/login', data);
```

**NEW** (Use authService):
```javascript
import { authService } from '../services/apiService.js';
const response = await authService.login(data, rememberMe);
```

### Error Handling

**OLD**:
```javascript
error.response?.data?.message
```

**NEW**:
```javascript
error.message || error.data?.message
```

## Migration Guide

### 1. Update Login/Register Components

```javascript
// OLD
const response = await axios.post('/auth/login', credentials);
localStorage.setItem('token', response.data.token);

// NEW
const response = await authService.login(credentials, rememberMe);
// Tokens are automatically stored
```

### 2. Update Product/API Components

```javascript
// OLD
import axios from 'axios';
await axios.post('http://localhost:3000/api/products', data);

// NEW
import { productService } from '../services/apiService.js';
await productService.createProduct(data);
```

### 3. Update Authentication Checks

```javascript
// OLD
const token = localStorage.getItem('token');
const isAuth = !!token;

// NEW
import { authService } from '../services/apiService.js';
const isAuth = authService.isAuthenticated();
```

## 🔧 Advanced Features

### Request Queue Management

```javascript
import { requestQueue } from '../utils/axiosConfig.js';

// Queue requests to prevent overwhelming the server
const result = await requestQueue.add(async () => {
  return apiClient.get('/heavy-endpoint');
});
```

### Token Expiration Checking

```javascript
import { tokenManager } from '../utils/axiosConfig.js';

const token = tokenManager.getAccessToken();
if (token && tokenManager.isTokenExpired(token)) {
  // Token is expired, user needs to login
  window.location.href = '/login';
}
```

### Manual Token Refresh

```javascript
import { authService } from '../services/apiService.js';

try {
  const response = await authService.refreshToken();
  // New tokens are automatically stored
} catch (error) {
  // Refresh failed, redirect to login
  window.location.href = '/login';
}
```

## 🛠️ Troubleshooting

### CORS Issues

**Symptoms:**
- Network errors in browser console
- `🚫 [CORS Error]` logs from axios configuration

**Solutions:**
1. Set `VITE_WITH_CREDENTIALS=false` in `.env`
2. Verify backend CORS configuration:

```javascript
// Express.js CORS setup
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Only if VITE_WITH_CREDENTIALS=true
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Token Refresh Issues

**Symptoms:**
- `❌ [Token Refresh] Failed to refresh token` logs
- Infinite login redirects

**Debugging:**
1. Check backend refresh token endpoint format
2. Verify refresh token is stored correctly
3. Check backend expects `{ refreshToken: "..." }` format

**Backend Refresh Endpoint Should Accept:**
```javascript
// Expected request body
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Expected response
{
  "token": "newAccessToken",
  "refreshToken": "newRefreshToken" // optional
}
```

### Authentication State Issues

**Symptoms:**
- User appears logged out after page refresh
- Tokens not being sent with requests

**Solutions:**
1. Check token storage keys consistency
2. Verify `rememberMe` parameter usage
3. Clear browser storage and test fresh login

### Development Debugging

Enable detailed logging by checking these logs in browser console:

- `🚀 [API Request]` - Outgoing requests (Authorization header redacted)
- `✅ [API Response]` - Successful responses with timing
- `❌ [API Error]` - Failed requests with error details
- `🔄 [Token Refresh]` - Token refresh attempts
- `⏳ [Retry]` - Request retry attempts

## 🏆 Best Practices

1. **Always use authService** for authentication operations
2. **Use tokenManager** for all token operations
3. **Implement rememberMe** functionality in login forms
4. **Handle errors gracefully** using the enhanced error properties
5. **Use service methods** instead of direct API client calls when available
6. **Clear tokens on logout** using `authService.logout()`
7. **Check authentication state** using `authService.isAuthenticated()`
8. **Avoid storing sensitive data** in localStorage for security

## 📚 API Reference

### tokenManager Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getAccessToken()` | - | `string \| null` | Get current access token |
| `getRefreshToken()` | - | `string \| null` | Get current refresh token |
| `setTokens(accessToken, refreshToken, rememberMe)` | `string, string, boolean` | `void` | Store tokens |
| `setUserData(userData, rememberMe)` | `object, boolean` | `void` | Store user data |
| `getUserData()` | - | `object \| null` | Get stored user data |
| `clearTokens()` | - | `void` | Clear all auth data |
| `isTokenExpired(token)` | `string` | `boolean` | Check if token is expired |

### authService Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `login(credentials, rememberMe)` | `object, boolean` | `Promise<object>` | Login user |
| `register(userData, rememberMe)` | `object, boolean` | `Promise<object>` | Register user |
| `logout()` | - | `Promise<void>` | Logout user |
| `refreshToken(token)` | `string?` | `Promise<object>` | Refresh access token |
| `getCurrentUser()` | - | `Promise<object>` | Get user from API |
| `isAuthenticated()` | - | `boolean` | Check auth status |
| `getCurrentUserData()` | - | `object \| null` | Get user from storage |
| `validateToken()` | - | `boolean` | Validate token expiry |