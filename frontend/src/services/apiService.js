import apiClient from "../utils/axiosConfig.js";

// Authentication Services
export const authService = {
  login: async (credentials) => {
    return await apiClient.post("/auth/login", credentials);
  },

  register: async (userData) => {
    return await apiClient.post("/auth/register", userData);
  },

  logout: async () => {
    return await apiClient.post("/auth/logout");
  },

  refreshToken: async () => {
    return await apiClient.post("/auth/refresh-token");
  },

  getCurrentUser: async () => {
    return await apiClient.get("/auth/me");
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

  searchProducts: async (query, filters = {}) => {
    return await apiClient.get("/products/search", {
      params: { q: query, ...filters },
    });
  },
};

// User Services
export const userService = {
  getProfile: async () => {
    return await apiClient.get("/users/profile");
  },

  updateProfile: async (profileData) => {
    return await apiClient.put("/users/profile", profileData);
  },

  changePassword: async (passwordData) => {
    return await apiClient.put("/users/change-password", passwordData);
  },

  uploadAvatar: async (file, onProgress) => {
    return await apiClient.upload("/users/avatar", file, onProgress);
  },
};

// Order Services
export const orderService = {
  getOrders: async (params = {}) => {
    return await apiClient.get("/orders", { params });
  },

  getOrder: async (id) => {
    return await apiClient.get(`/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return await apiClient.post("/orders", orderData);
  },

  updateOrderStatus: async (id, status) => {
    return await apiClient.patch(`/orders/${id}/status`, { status });
  },

  cancelOrder: async (id) => {
    return await apiClient.post(`/orders/${id}/cancel`);
  },
};

// Cart Services
export const cartService = {
  getCart: async () => {
    return await apiClient.get("/cart");
  },

  addToCart: async (productId, quantity = 1) => {
    return await apiClient.post("/cart/items", { productId, quantity });
  },

  updateCartItem: async (itemId, quantity) => {
    return await apiClient.put(`/cart/items/${itemId}`, { quantity });
  },

  removeFromCart: async (itemId) => {
    return await apiClient.delete(`/cart/items/${itemId}`);
  },

  clearCart: async () => {
    return await apiClient.delete("/cart");
  },
};

// Category Services
export const categoryService = {
  getCategories: async () => {
    return await apiClient.get("/categories");
  },

  getCategory: async (id) => {
    return await apiClient.get(`/categories/${id}`);
  },

  createCategory: async (categoryData) => {
    return await apiClient.post("/categories", categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await apiClient.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await apiClient.delete(`/categories/${id}`);
  },
};

// File Services
export const fileService = {
  uploadImage: async (file, onProgress) => {
    return await apiClient.upload("/files/upload", file, onProgress);
  },

  downloadFile: async (fileId, filename) => {
    return await apiClient.download(`/files/${fileId}`, filename);
  },
};

// Analytics Services
export const analyticsService = {
  getDashboardStats: async () => {
    return await apiClient.get("/analytics/dashboard");
  },

  getSalesReport: async (dateRange) => {
    return await apiClient.get("/analytics/sales", { params: dateRange });
  },

  getProductAnalytics: async (productId) => {
    return await apiClient.get(`/analytics/products/${productId}`);
  },
};

// Export all services as a single object for easier imports
export default {
  auth: authService,
  products: productService,
  users: userService,
  orders: orderService,
  cart: cartService,
  categories: categoryService,
  files: fileService,
  analytics: analyticsService,
};
