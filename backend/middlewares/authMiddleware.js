const jwt = require('jsonwebtoken'); // FIREBASE_REPLACE: Remove later.
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if the 'token' cookie exists
    if (req.cookies.token) {
        try {
            token = req.cookies.token;

            const decoded = jwt.verify(token, 'YOUR_SECRET_KEY_HERE_123'); 

            req.user = await User.findById(decoded.id).select('-password');

            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    let {rolee} = req.body;
    if ((req.user && req.user.role === 'admin')|| rolee === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};


module.exports = { protect, admin };