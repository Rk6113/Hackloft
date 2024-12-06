// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs')
const sendOtp = require('../utils/sendOtp');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/auth/signup
// @desc Register a new user

// Corrected signup route in auth.js
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password }); // Pass password as plain text

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during sign-up:', error.message);
        res.status(500).send('Server error');
    }
});


// Request OTP
router.post('/request-otp', [
    check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        await sendOtp(email);
        res.json({ msg: 'OTP sent to email' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Login with OTP and Password
router.post('/login-with-otp', [
    // check('email', 'Please include a valid email').isEmail(),
    // check('password', 'Password is required').exists(),
    // check('otp', 'OTP is required').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, otp } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Debugging: Log OTP details for validation
        console.log('Stored OTP:', user.otp, 'Provided OTP:', otp);
        console.log('Stored OTP Expiry:', user.otpExpiry, 'Current Time:', new Date());

        // Check if the OTP matches and is not expired
        if (user.otp.toString() !== otp.toString() || new Date() > user.otpExpiry) {
            console.log('OTP validation failed due to mismatch or expiration');
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        // Clear the OTP after successful login
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Return JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send user data along with token
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                points: user.points, // Include additional user fields as needed
            },
        });
        
    return res;
    } catch (error) {
        console.error('Error during login with OTP:', error.message);
        res.status(500).send('Server error');
    }
});


// @route PUT /api/auth/update-profile
// @desc Update user profile (name and email only)
// @access Private
router.put('/update-profile', authMiddleware, async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        res.json({ msg: 'Profile updated successfully', user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});
router.post('/updatePoints', async (req, res) => {
    const { userId, points } = req.body;
  
    // Authentication and authorization checks should be done here
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'No authorization token provided' });
    }
  
    try {
      // Find the user by ID and update their points
      const user = await User.findOneAndUpdate(
        { _id: userId }, // Filter
        { $set: { points: points } }, // Update
        { new: true } // Options: return the updated document
      );
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      res.send({ message: 'Points updated successfully!', user });
    } catch (error) {
      console.error('Failed to update points:', error);
      res.status(500).send({ message: 'Failed to update points due to an internal error' });
    }
  });

  // Assuming you already have the Express app and User model set up
router.get('/leaderboard', async (req, res) => {
    try {
      const users = await User.find({}).sort({ points: -1 }).limit(10); // Fetch top 10 users
      
      res.send(users);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      res.status(500).send({ message: 'Failed to fetch leaderboard due to an internal error' });
    }
  });
  

module.exports = router;
