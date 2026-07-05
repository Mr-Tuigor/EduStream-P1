const jwt = require('jsonwebtoken'); // FIREBASE_REPLACE: Remove later.
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    console.log("inside protect function");
    
    // Check if the 'token' cookie exists
    if (req.cookies.token) {
        try {
            console.log("token found");
            token = req.cookies.token;

            const decoded = jwt.verify(token, 'YOUR_SECRET_KEY_HERE_123'); 

            req.user = await User.findById(decoded.id).select('-password');
            console.log("token verified heading to next function");
            next(); 
            
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
  
    if (req.user && req.user.role === 'admin'){
        next(); 
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};


module.exports = { protect, admin };