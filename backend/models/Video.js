const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    youtubeId: { type: String, required: true }, // e.g., "kKKM8Y-u7ds"
    imgId: { type: String, required: true },
    description: { type: String },
    university: { type: String, required: true },    // e.g., "Nagpur"
    branch: { type: String },
    semester: { type: Number, required: true }, // e.g., "10"
    subject: { type: String, required: true },  // e.g., "EMW, Embedded System"
    unit: { type: String },
    isExamOriented: { type: Boolean, default: false, required: true},
    topic: { type: String },                    // e.g., "Refraction"
    
    // AI Related Fields
    transcript: { type: String, default: "" },
    summary: { type: String, default: "" },
    
    // AI processing status — tracks whether transcript/quiz generation is done
    aiStatus: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'failed'], 
        default: 'pending' 
    },
  
    // Store the default quiz here to save costs
    questions: [{
        question: String,
        options: [String],
        correctAnswer: String,
        explanation: String
    }],

    vectorEmbedding: { type: [Number], default: [] },

    // Voting System
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Pre-computed vote score for fast sorting (upvotes - downvotes)
    // This avoids calculating array lengths at query time
    voteScore: { type: Number, default: 0 },
    
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// --- INDEXES ---

// Primary query path: the drill-down filter used on the Home page
videoSchema.index({ university: 1, branch: 1, semester: 1, subject: 1, unit: 1, isExamOriented: 1, voteScore: -1 });

// Text index for topic/title search (used by SearchPage)
videoSchema.index({ title: 'text', topic: 'text' });

// --- PRE-SAVE HOOK ---
// Automatically recalculate voteScore before every save so it stays in sync
videoSchema.pre('save', async function() {
    console.log("PRE-SAVE HOOK TRIGGERED");
    
    this.voteScore = (this.upvotes ? this.upvotes.length : 0) - (this.downvotes ? this.downvotes.length : 0);
    console.log("updated voteScore");
    
});

module.exports = mongoose.model('Video', videoSchema);