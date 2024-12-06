// utils/sendOtp.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendOtp = async (userEmail) => {
    try {
        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP expiration time (e.g., 10 minutes)
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Find the user and update the OTP and expiration
        const user = await User.findOneAndUpdate(
            { email: userEmail },
            { otp, otpExpiry },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        // Log to verify that OTP and expiry are set correctly
        console.log(`User updated with OTP: ${user.otp} and Expiry: ${user.otpExpiry}`);

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log('OTP sent to email:', userEmail);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

module.exports = sendOtp;
