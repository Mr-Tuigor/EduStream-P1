const Video = require('../models/Video');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini — use environment variable only (no hardcoded keys)
const genAI = new GoogleGenerativeAI("AIzaSyCZibCRgR7Rlf5gj4KEdeN94Xkifx4bbBY");



// @desc    Get videos based on filters
// @route   GET /api/videos
const getVideos = async (req, res) => {
    try {
        const { university, branch, semester, subject, isExamOriented, unit, search } = req.query;

        // Build a query object based on what the user selected
        const query = {};
        if (university) query.university = university;
        if (branch) query.branch = branch;
        if (semester) query.semester = parseInt(semester);
        if (subject) query.subject = subject;
        if (unit) query.unit = unit;
        // Only add isExamOriented if it was actually provided in the query
        if (isExamOriented !== undefined && isExamOriented !== '') {
            query.isExamOriented = isExamOriented === 'true';
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // 'i' means case-insensitive (Gravity = gravity)
                { topic: { $regex: search, $options: 'i' } }
            ];
        }

        // Find videos, exclude heavy fields, sort by computed voteScore (fastest)
        const videos = await Video.find(query)
            .select('-transcript -vectorEmbedding -questions')
            .sort({ voteScore: -1 });

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
        })
            .select('-transcript -vectorEmbedding -questions')
            .limit(5); // Fetch top 5 suggestions

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
        // voteScore is auto-recalculated in the pre-save hook
        await video.save();
        res.status(200).json(video);

    } catch (error) {
        console.error("Error upvoting video:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Downvote a video
// @route   POST /api/videos/:id/downvote
const downvoteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        const userId = req.user._id;

        if (!video) return res.status(404).json({ message: "Video not found" });

        const alreadyDownvoted = video.downvotes.some(id => id.toString() === userId.toString());

        if (alreadyDownvoted) {
            video.downvotes = video.downvotes.filter(id => id.toString() !== userId.toString());
        } else {
            video.downvotes.push(userId);
            video.upvotes = video.upvotes.filter(id => id.toString() !== userId.toString());
        }

        // voteScore is auto-recalculated in the pre-save hook
        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- THE UNBLOCKABLE ANDROID SCRAPER ---
async function fetchYouTubeTranscript(videoId) {
    try {
        const response = await axios.post(
            'https://www.youtube.com/youtubei/v1/player',
            {
                context: {
                    client: {
                        clientName: "ANDROID",
                        clientVersion: "20.10.38"
                    }
                },
                videoId: videoId
            },
            {
                headers: {
                    'User-Agent': 'com.google.android.youtube/20.10.38 (Linux; U; Android 14)',
                    'Content-Type': 'application/json'
                }
            }
        );

        const tracks = response.data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

        if (!tracks || tracks.length === 0) {
            return null;
        }

        const track = tracks.find(t => t.languageCode.includes('en')) || tracks[0];
        const { data: xml } = await axios.get(track.baseUrl);

        return xml
            .replace(/<[^>]+>/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, ' ')
            .trim();
    } catch (error) {
        console.error("Android Scraper Error:", error.message);
        return null;
    }
}

// @desc    Add a new video
// @route   POST /api/videos
const addVideo = async (req, res) => {
    try {
        const { title, youtubeId, university, branch, semester, subject, unit, topic } = req.body;

        if (!title || !youtubeId || !university || !branch || !semester || !subject || !unit || !topic) {
            return res.status(400).json({
                message: "All fields are required",
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

        // 1. Send the success response IMMEDIATELY so the frontend is fast
        res.status(201).json(createdVideo);

        // 2. Kick off AI pipeline in the background (non-blocking)
        processAIFeatures(createdVideo);

        function getImgId(youtubeId) {
            let i = youtubeId.indexOf('?');
            return youtubeId.slice(0, i);
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to add video" });
    }
};

// --- Helper Functions ---
function getImgId(youtubeId) {
    let i = youtubeId.indexOf('?');
    if (i === -1) {
        return youtubeId;
    }
    return i !== -1 ? youtubeId.slice(0, i) : youtubeId;
}


// --- THE BACKGROUND AI PIPELINE ---
const processAIFeatures = async (videoDoc) => {
    try {
        console.log(`\n--- [AI-Processing Started] ---`);
        console.log(`Title: ${videoDoc.title}`);

        const cleanId = getImgId(videoDoc.youtubeId);
        if (!cleanId || cleanId.length !== 11) {
            console.log(`❌ [AI-Processing Aborted] Invalid YouTube ID: "${videoDoc.youtubeId}"`);
            return;
        }

        // Update status to processing
        await Video.findByIdAndUpdate(videoDoc._id, { aiStatus: 'processing' });

        // STEP 1: Fetch Transcript
        console.log(`Downloading transcript...`);
        const transcriptText = await fetchYouTubeTranscript(cleanId);

        if (!transcriptText) {
            console.log(`❌ [AI-Processing Aborted] Video has no captions available.`);
            await Video.findByIdAndUpdate(videoDoc._id, { aiStatus: 'failed' });
            return;
        }
        console.log(`✅ Transcript downloaded! (${transcriptText.length} chars)`);

        // STEP 2: Generate Vector Embedding
        console.log(`Generating Vector Embeddings...`);
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2-preview" });
        const textToEmbed = `Title: ${videoDoc.title}\nSubject: ${videoDoc.subject}\nTopic: ${videoDoc.topic}\nContent: ${transcriptText}`;
        const embedResult = await embeddingModel.embedContent(textToEmbed);
        const vectorArray = embedResult.embedding.values;
        console.log(`✅ Embeddings generated!`);

        // STEP 3: Generate Default Quiz
        console.log(`Generating AI Quiz...`);
        const quizModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Based on the following transcript, generate 5 multiple-choice questions. 
            Return ONLY a valid JSON array. Do not include markdown formatting like \`\`\`json.
            Format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "...", "explanation": "..."}]
            
            Transcript: ${transcriptText}
        `;
        const quizResult = await quizModel.generateContent(prompt);
        let rawText = quizResult.response.text();
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const quizData = JSON.parse(rawText);
        console.log(`✅ Quiz generated!`);

        // STEP 4: Save to Database
        videoDoc.transcript = transcriptText;
        videoDoc.vectorEmbedding = vectorArray;
        videoDoc.questions = quizData;
        videoDoc.aiStatus = 'completed'; // Let the frontend know it's ready!

        await videoDoc.save();
        console.log(`\n🎉 [AI-Processing] ALL DONE for: ${videoDoc.title}\n`);

    } catch (error) {
        console.error(`\n❌ [AI-Processing Failed Safely]`);
        console.error(`Error Message: ${error.message}`);
        await Video.findByIdAndUpdate(videoDoc._id, { aiStatus: 'failed' });
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