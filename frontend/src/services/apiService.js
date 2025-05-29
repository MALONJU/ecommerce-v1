import apiClient, { tokenManager } from "../utils/axiosConfig.js";

// Authentication Services
export const authService = {
  login: async (credentials, rememberMe = false) => {
    const response = await apiClient.post("/auth/login", credentials);

    // Store tokens and user data if login successful
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, rememberMe);

      if (response.user) {
        tokenManager.setUserData(response.user, rememberMe);
      }
    }

    return response;
  },

  register: async (userData, rememberMe = false) => {
    const response = await apiClient.post("/auth/register", userData);

    // Store tokens and user data if registration successful
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, rememberMe);

      if (response.user) {
        tokenManager.setUserData(response.user, rememberMe);
      }
    }

    return response;
  },

  logout: async () => {
    try {
      // Call logout endpoint to invalidate refresh token on server
      await apiClient.post("/auth/logout", {
        refreshToken: tokenManager.getRefreshToken(),
      });
    } catch (error) {
      // Even if logout endpoint fails, we should clear local tokens
      console.warn(
        "Logout endpoint failed, clearing local tokens anyway:",
        error
      );
    } finally {
      // Always clear local tokens
      tokenManager.clearTokens();
    }
  },

  refreshToken: async (refreshToken) => {
    // Note: This is primarily used by the axios interceptor
    // Manual refresh token calls should include the refresh token
    const tokenToUse = refreshToken || tokenManager.getRefreshToken();

    if (!tokenToUse) {
      throw new Error("No refresh token available");
    }

    return await apiClient.post("/auth/refresh-token", {
      refreshToken: tokenToUse,
    });
  },

  getCurrentUser: async () => {
    return await apiClient.get("/auth/me");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenManager.getAccessToken();
    return token && !tokenManager.isTokenExpired(token);
  },

  // Get current user data from storage (no API call)
  getCurrentUserData: () => {
    return tokenManager.getUserData();
  },

  // Validate token without making API call
  validateToken: () => {
    const token = tokenManager.getAccessToken();
    if (!token) return false;

    return !tokenManager.isTokenExpired(token);
  },
};

// Product Services
export const productService = {
  getProducts: async (params = {}) => {
    return await apiClient.get("/products", { params });
  },

  getProduct: async (id) => {
    return await apiClient.get(`/products/${id}`);
  },

  createProduct: async (productData) => {
    return await apiClient.post("/products", productData);
  },

  updateProduct: async (id, productData) => {
    return await apiClient.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await apiClient.delete(`/products/${id}`);
  },
};

// User Services
export const userService = {
  // Admin User Management Services
  getAllUsers: async () => {
    return await apiClient.get("/users");
  },

  getUserById: async (id) => {
    return await apiClient.get(`/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return await apiClient.put(`/users/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await apiClient.delete(`/users/${id}`);
  },

  updateUserRole: async (id, role) => {
    return await apiClient.put(`/users/${id}/role`, { role });
  },
};

// Order Services
export const orderService = {
  getOrders: async (params = {}) => {
    return await apiClient.get("/orders", { params });
  },

  getMyOrders: async (params = {}) => {
    return await apiClient.get("/orders/myorders", { params });
  },

  getOrder: async (id) => {
    return await apiClient.get(`/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return await apiClient.post("/orders", orderData);
  },

  updateOrderStatus: async (id, statusData) => {
    return await apiClient.put(`/orders/${id}/status`, statusData);
  },

  cancelOrder: async (id) => {
    return await apiClient.delete(`/orders/${id}`, {
      data: { comment: "Order cancelled by user" },
    });
  },
};

// Export all services as a single object for easier imports
export default {
  auth: authService,
  products: productService,
  users: userService,
  orders: orderService,
};
