# Axios Configuration & API Services

## Overview

This directory contains a comprehensive axios configuration and API service layer for the e-commerce application. The setup provides:

- Centralized base URL configuration
- Request/response interceptors
- Authentication handling
- Error handling and logging
- Retry logic for failed Requests
- File upload/download capabilities
- Request queue management

## Files

- `axiosConfig.js` - Main axios configuration with interceptors and utilities
- `../services/apiService.js` - Pre-built API service methods for common operations

## Environment Variables

Create a `.env` file in the frontend root with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# CORS Configuration
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

## Usage

### Basic Usage with API Client

```javascript
import apiClient from '../utils/axiosConfig.js';

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
import { authService, productService } from '../services/apiService.js';

// Authentication
const loginResult = await authService.login({ email, password });
const user = await authService.getCurrentUser();

// Products
const products = await productService.getProducts();
const product = await productService.getProduct('123');
await productService.deleteProduct('123');
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

### Using Retry Logic

```javascript
import apiClient from '../utils/axiosConfig.js';

// Retry failed requests up to 3 times with exponential backoff
const result = await apiClient.withRetry(
  { method: 'get', url: '/unreliable-endpoint' },
  3, // retries
  1000 // initial delay in ms
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

### Direct Axios Instance

```javascript
import { axiosInstance } from '../utils/axiosConfig.js';

// Use the configured axios instance directly
const response = await axiosInstance.get('/custom-endpoint');
```

## Features

### Automatic Authentication

The configuration automatically adds Bearer tokens from localStorage or sessionStorage to requests.

### Error Handling

- **401 Unauthorized**: Automatically clears auth tokens and redirects to login
- **403 Forbidden**: Logs permission warnings
- **5xx Server Errors**: Logs errors and can implement retry logic

### Request/Response Logging

In development mode, all requests and responses are logged to the console with:
- Request method and URL
- Request headers and data
- Response status and duration
- Error details

### Request Queue

Manages concurrent requests to prevent overwhelming the server:

```javascript
import { requestQueue } from '../utils/axiosConfig.js';

const result = await requestQueue.add(async () => {
  return apiClient.get('/heavy-endpoint');
});
```

## Migration from Direct Axios

To migrate existing code from direct axios usage:

### Before
```javascript
import axios from 'axios';

const response = await axios.get('http://localhost:3000/api/products');
const data = response.data;
```

### After
```javascript
import apiClient from '../utils/axiosConfig.js';

const data = await apiClient.get('/products');
```

Or using the service layer:
```javascript
import { productService } from '../services/apiService.js';

const data = await productService.getProducts();
```

## Best Practices

1. **Use API Services**: Prefer the pre-built service methods over direct API client calls
2. **Environment Variables**: Always use environment variables for configuration
3. **Error Handling**: Let the interceptors handle common errors, add specific handling only when needed
4. **Cancel Tokens**: Use cancel tokens for long-running requests that users might want to cancel
5. **Progress Tracking**: Implement progress tracking for file uploads
6. **Retry Logic**: Use retry logic for non-critical requests that might fail due to network issues

## Troubleshooting

### CORS Issues
CORS (Cross-Origin Resource Sharing) errors are common when the frontend and backend are on different ports/domains.

**Quick Fix:**
1. Set `VITE_WITH_CREDENTIALS=false` in your `.env` file
2. Ensure your backend has CORS enabled for your frontend domain

**Backend CORS Configuration (Express.js example):**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Only if VITE_WITH_CREDENTIALS=true
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Debugging CORS:**
- Check the browser console for detailed CORS error messages
- Look for the `🚫 [CORS Error]` logs from the axios configuration
- Verify the request URL in the logs matches your backend

**Common CORS Issues:**
- Backend not configured for CORS
- `withCredentials: true` without proper server configuration
- Mismatched URLs (localhost vs 127.0.0.1 vs [::1])

### Authentication Issues
Check that your backend expects the `Authorization: Bearer <token>` header format.

### Base URL Issues
Verify the `VITE_API_BASE_URL` environment variable is set correctly.

### Network Timeouts
Adjust the `VITE_API_TIMEOUT` environment variable if requests are timing out.