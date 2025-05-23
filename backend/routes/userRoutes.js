const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

// Admin routes
router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:id/role')
    .put(updateUserRole);

module.exports = router;