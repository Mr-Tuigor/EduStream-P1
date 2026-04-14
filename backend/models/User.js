const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // We store these so the user doesn't have to select them every time
    university: { type: String, default: "Nagpur" }, 
    branch: { type: String, default: "ETC" },
    semester: { type: String, default: "" }, 
    role: { type: String, default: "student" }, // To identify you as the curator

    // --- Quiz History ---
    // Stores past quiz results so the chatbot can track progress and recommend improvements.
    //
    // SCALABILITY NOTE:
    // Currently stored inside the User document for simplicity and fast reads (no joins/lookups needed).
    // However, if the app scales to thousands of users taking dozens of quizzes, this array will grow
    // and bloat the User document, slowing down all User queries (login, profile, etc.).
    //
    // For better scalability, move quiz history to a SEPARATE COLLECTION:
    //
    //   const QuizSession = new Schema({
    //       userId: { type: ObjectId, ref: 'User', index: true },
    //       subject: String,
    //       unit: String,
    //       difficulty: String,
    //       score: Number,
    //       totalQuestions: Number,
    //       questions: [{ question, selectedAnswer, correctAnswer, isCorrect }],
    //       weakTopics: [String],        // Topics where user got questions wrong
    //       recommendedVideoIds: [ObjectId],
    //       completedAt: { type: Date, default: Date.now }
    //   });
    //
    // Benefits of separate collection:
    //   1. User document stays small & fast for auth/profile queries
    //   2. Can query quiz history independently (e.g., "all quizzes for subject X")
    //   3. Can paginate history easily (skip/limit) instead of loading entire array
    //   4. Can add indexes on quiz fields (subject, score, date) for analytics
    //   5. Can run aggregation pipelines (avg score per subject, progress over time)
    //   6. Each quiz session can store full question details without bloating User
    //   7. Easier to implement leaderboards and class-wide analytics
    //
    quizHistory: [{
        subject: { type: String },
        unit: { type: String },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
        score: { type: Number },
        totalQuestions: { type: Number },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Explicit index removed, unique: true handles it
module.exports = mongoose.model('User', userSchema);