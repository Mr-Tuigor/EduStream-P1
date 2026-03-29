const Video = require('../models/Video');
const mongoose = require('mongoose');

// @desc    Get videos based on filters
// @route   GET /api/videos
const getVideos = async (req, res) => {
    try {
        const { university, branch, semester, subject, isExamOriented, unit, search } = req.query;
        
        // Build a query object based on what the user selected
        const query = {};
        if (university) query.university = university;
        if(branch) query.branch = branch;
        if (semester) query.semester = semester;
        if (subject) query.subject = subject;
        if(unit) query.unit = unit;
        if(isExamOriented) query.isExamOriented = isExamOriented;



        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // 'i' means case-insensitive (Gravity = gravity)
                { topic: { $regex: search, $options: 'i' } }
            ];
        }

        // Find videos and sort them by upvotes (highest first)
        const videos = await Video.find(query).sort({ upvotes: -1 });
        
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not fetch videos" });
    }
};


// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    // If ID format is invalid (CastError)
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: "Video not found" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc    Get related videos (Same Class & Subject, excluding current)
// @route   GET /api/videos/related/:id
const getRelatedVideos = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Find the current video to know its Subject/Class
    const currentVideo = await Video.findById(id);
    if (!currentVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // 2. Find matches: Same Class, Same Subject, NOT same ID
    const relatedVideos = await Video.find({
      branch: currentVideo.branch,
      semester: currentVideo.semester,
      subject: currentVideo.subject,
      _id: { $ne: id } // $ne means "Not Equal"
    }).limit(5); // Fetch top 5 suggestions

    res.status(200).json(relatedVideos);
  } catch (error) {
    console.error("Error fetching related videos:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Upvote a video
// @route   POST /api/videos/:id/upvote
const upvoteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        //  const userId = new mongoose.Types.ObjectId(req.body.userId);// Later this will come from the Auth middleware
        const userId = req.user._id;

        if (!video) return res.status(404).json({ message: "Video not found" });

        if (!video.upvotes) video.upvotes = [];
        if (!video.downvotes) video.downvotes = [];

        // 1. Check if already upvoted
        const alreadyUpvoted = video.upvotes.some(id => id.toString() === userId.toString());
        
        if (alreadyUpvoted) {
            // Remove the upvote (Toggle off)
            video.upvotes = video.upvotes.filter(id => id.toString() !== userId.toString());
        } else {
            // Add the upvote
            video.upvotes.push(userId);
            // Ensure it's removed from downvotes if it was there
            video.downvotes = video.downvotes.filter(id => id.toString() !== userId.toString());
        }

        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Downvote a video
// @route   POST /api/videos/:id/downvote
const downvoteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        //const userId = new mongoose.Types.ObjectId(req.body.userId);
        const userId = req.user._id;

        if (!video) return res.status(404).json({ message: "Video not found" });

        const alreadyDownvoted = video.downvotes.some(id => id.toString() === userId.toString());

        if (alreadyDownvoted) {
            video.downvotes = video.downvotes.filter(id => id.toString() !== userId.toString());
        } else {
            video.downvotes.push(userId);
            video.upvotes = video.upvotes.filter(id => id.toString() !== userId.toString());
        }

        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Add a new video
// @route   POST /api/videos
const addVideo = async (req, res) => {
    try {
        const { title, youtubeId, university, branch, semester, subject, unit, topic } = req.body;

        if(!title || !youtubeId || !university || !branch || !semester || !subject || !unit || !topic) {
            return res.status(400).json({ message: "All fields are required",
                requierdFields: {
                    title,
                    youtubeId,
                    university,
                    branch,
                    semester,
                    subject,
                    unit,
                    topic
                }
             });
        }

        
        const imgId = getImgId(youtubeId);
        console.log(imgId);


        const video = new Video({
            title,
            youtubeId,
            imgId,
            university,
            branch,
            semester,
            subject,
            unit,
            topic,
            addedBy: req.user._id // Track who added it
        });

        const createdVideo = await video.save();
        res.status(201).json(createdVideo);

        function getImgId(youtubeId) {
            let i = youtubeId.indexOf('?');
            return youtubeId.slice(0, i);
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to add video" });
    }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (video) {
            await video.deleteOne();
            res.json({ message: 'Video removed' });
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getVideos, getVideoById, getRelatedVideos, upvoteVideo, downvoteVideo, addVideo, deleteVideo };