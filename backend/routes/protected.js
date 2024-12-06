// routes/protected.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user'); // Make sure to import your User model
const router = express.Router();

// @route GET /api/protected
// @desc Get user details
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Fetch user by ID (excluding password)
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
