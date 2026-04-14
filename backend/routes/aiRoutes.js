const express = require('express');
const router = express.Router();
const {protect}  = require("../middlewares/authMiddleware");
const { 
    generateDynamicQuiz, 
    chatWithAI, 
    gradeLongAnswer,
    chatbotStartQuiz,
    chatbotQuizResults,
    chatbotGenerateLongQuestion
} = require('../controllers/aiController');

// Existing routes
router.post('/chat-with-ai', protect, chatWithAI);
router.post('/quizes', protect, generateDynamicQuiz);     // Fixed: was missing leading '/'
router.post('/grade-answer', protect, gradeLongAnswer);

// Chatbot routes (used by the floating chatbot widget)
router.post('/chatbot/start-quiz', protect, chatbotStartQuiz);
router.post('/chatbot/quiz-results', protect, chatbotQuizResults);
router.post('/chatbot/generate-long-question', protect, chatbotGenerateLongQuestion);

module.exports = router;