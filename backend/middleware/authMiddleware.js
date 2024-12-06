// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token (split 'Bearer <token>')
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

        // Attach user information to req.user directly
        req.user = decoded.user;
        return next(); // Ensure only one call to next()
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
