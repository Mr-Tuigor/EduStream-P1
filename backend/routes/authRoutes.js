const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.put('/profile', protect, updateUserProfile);

module.exports = router;