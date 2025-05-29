const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate role if provided
        const allowedRoles = ['user', 'admin'];
        const userRole = role && allowedRoles.includes(role) ? role : 'user';

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user with specified role
        const user = await User.create({
            name,
            email,
            password,
            role: userRole
        });

        if (user) {
            console.log(`✅ [Auth] New ${userRole} registered: ${email}`);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                refreshToken: generateRefreshToken(user._id)
            });
        }
    } catch (error) {
        console.error('❌ [Auth] Registration error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            refreshToken: generateRefreshToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public (since we're just invalidating tokens)
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Log the logout attempt
        console.log('🔐 [Auth] Logout request received');

        // In a production application, you would:
        // 1. Add the refresh token to a blacklist/revoked tokens database
        // 2. Optionally invalidate all sessions for the user
        // 3. Clear any server-side session data

        // For now, we'll just acknowledge the logout
        // The client-side will handle clearing the tokens from storage

        if (refreshToken) {
            console.log('🔐 [Auth] Refresh token provided for logout');
            // TODO: Add refresh token to blacklist in database
            // await RefreshToken.create({ token: refreshToken, revokedAt: new Date() });
        }

        res.json({
            message: 'Logout successful',
            success: true
        });

        console.log('✅ [Auth] Logout completed successfully');
    } catch (error) {
        console.error('❌ [Auth] Logout error:', error);
        res.status(500).json({
            message: 'Logout failed',
            error: error.message
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        // Here you would typically verify the refresh token
        // For now, we'll implement a basic version
        // In a production app, you'd want to store refresh tokens in the database
        // and verify them properly

        // For this example, we'll just generate new tokens
        // You should implement proper refresh token validation
        res.json({
            message: 'Token refreshed successfully',
            token: generateToken('user_id'), // You'd get the actual user ID from the refresh token
            refreshToken: generateRefreshToken('user_id')
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    resetPassword,
    getMe,
    refreshToken
};