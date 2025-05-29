const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Profile routes for authenticated users
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes - require both protect and admin middleware
router.route('/')
    .get(protect, admin, getUsers);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

router.route('/:id/role')
    .put(protect, admin, updateUserRole);

module.exports = router;