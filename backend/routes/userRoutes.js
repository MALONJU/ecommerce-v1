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

// Apply protect and admin middleware to all routes below this point
router.use(protect, admin);

// Admin routes - all routes below inherit protect + admin middleware
router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:id/role')
    .put(updateUserRole);

module.exports = router;