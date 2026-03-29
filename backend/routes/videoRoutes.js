const express = require('express');
const router = express.Router();
const { 
    getVideos, upvoteVideo, downvoteVideo,
    addVideo, deleteVideo, getVideoById,
    getRelatedVideos
} = require('../controllers/videoController');
const { protect, admin } = require('../middlewares/authMiddleware');


router.get('/', getVideos);
router.get('/:id', getVideoById);
router.get('/related/:id', getRelatedVideos);

router.post('/:id/upvote', protect, upvoteVideo);
router.post('/:id/downvote', protect, downvoteVideo);

router.post('/', protect, admin, addVideo);
router.delete('/:id', protect, admin, deleteVideo);

module.exports = router;