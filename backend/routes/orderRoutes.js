const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getOrderHistory,
    addHistoryComment
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Protected user routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/history', protect, getOrderHistory);
router.delete('/:id', protect, cancelOrder);

// Protected admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/history', protect, admin, addHistoryComment);

module.exports = router; 