const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    youtubeId: { type: String, required: true }, // e.g., "kKKM8Y-u7ds"
    imgId: { type: String, required: true },
    description: { type: String },
    university: { type: String, required: true },    // e.g., "Nagpur"
    branch: { type: String },
    semester: { type: String, required: true }, // e.g., "10"
    subject: { type: String, required: true },  // e.g., "EMW, Embedded System"
    unit: { type: String },
    isExamOriented: { type: String, default: "No", required: true},
    topic: { type: String },                    // e.g., "Refraction"
    
    // Voting System
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // We can calculate the "rank" based on (upvotes.length - downvotes.length)
    
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

videoSchema.index({ university: 1, branch: 1, semester: 1, subject: 1, unit: 1, upvotes: -1 });

module.exports = mongoose.model('Video', videoSchema);