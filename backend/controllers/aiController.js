const { GoogleGenerativeAI } = require("@google/generative-ai");
const Video = require("../models/Video");
const User = require("../models/User");

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI("AIzaSyCZibCRgR7Rlf5gj4KEdeN94Xkifx4bbBY");

// -------------------------------------------------------------- For Quizes ----------------------------------------------------------------------------------
exports.generateDynamicQuiz = async (req, res) => {
  try {
    const { videoIds, questionCount, difficulty } = req.body;

    // 1. Fetch all selected videos/units
    const videos = await Video.find({ _id: { $in: videoIds } });
    
    // 2. Combine all transcripts into one context
    const combinedContext = videos.map(v => `Unit: ${v.unit}\nContent: ${v.transcript}`).join("\n\n");

    // 3. Setup the AI Model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const difficultyGuide = difficulty === 'easy' 
      ? 'basic recall and definition questions' 
      : difficulty === 'hard' 
        ? 'advanced application and analysis questions requiring deep understanding'
        : 'moderate understanding and application questions';

    const prompt = `
      You are an academic assistant. Based on the following video transcripts, 
      generate exactly ${questionCount} multiple-choice questions.
      Difficulty level: ${difficulty || 'medium'} — focus on ${difficultyGuide}.
      
      Context:
      ${combinedContext}

      Return the response ONLY as a JSON array in this format:
      [
        {
          "question": "text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "the exact string of the correct option",
          "explanation": "why this is correct"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up any markdown the AI might accidentally add
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const quizData = JSON.parse(text);

    res.status(200).json({ success: true, quiz: quizData });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
};

exports.chatWithAI = async (req, res) => {
  const { message, history, transcriptContext } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Initialize chat with history and a system instruction
    const chat = model.startChat({
      history: history, // Array of { role: "user" / "model", parts: [{ text: "..." }] }
      generationConfig: { maxOutputTokens: 500 },
    });

    // We send the transcript context as a hidden prefix if it's the start of the chat
    const fullMessage = history.length === 0 
      ? `Context from video: ${transcriptContext}\n\nUser Question: ${message}`
      : message;

    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    
    res.json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: "Chat failed" });
  }
};

// ----------------------------------------------------------------For Long Answers---------------------------------------------------------------------------
exports.gradeLongAnswer = async (req, res) => {
  try {
    const { videoId, question, userAnswer } = req.body;

    if (!videoId || !question || !userAnswer) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 1. Fetch the video to get the "Source of Truth" (the transcript)
    const video = await Video.findById(videoId);
    if (!video || !video.transcript) {
      return res.status(404).json({ error: "Video or transcript not found." });
    }

    // 2. Initialize the AI Model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. The Prompt Engineer (Crucial for accurate grading)
    const prompt = `
      You are an expert university professor grading a student's answer.
      
      Source Material (Transcript, the words on the transcipt can have grammatical error so please):
      """${video.transcript}"""
      
      The Question Asked: "${question}"
      
      The Student's Answer: "${userAnswer}"

      Task: 
      1. Grade the student's answer strictly based on the provided Source Material.
      2. Give a score out of 10.
      3. Provide constructive feedback.
      4. List any key concepts from the transcript that the student missed.

      You MUST respond ONLY with a valid JSON object in this exact format:
      {
        "score": number,
        "outOf": 10,
        "feedback": "string explaining why they got this score",
        "missedConcepts": ["array", "of", "strings"]
      }
    `;

    // 4. Call the AI
    const result = await model.generateContent(prompt);
    let rawText = await result.response.text();

    // 5. Clean up the response (in case the AI wraps it in markdown)
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 6. Parse and Send
    const gradingReport = JSON.parse(rawText);

    // 7. Find recommended videos for missed concepts
    let recommendedVideos = [];
    if (gradingReport.missedConcepts && gradingReport.missedConcepts.length > 0) {
      const searchTerms = gradingReport.missedConcepts.join(' ');
      recommendedVideos = await Video.find({
        subject: video.subject,
        $or: [
          { title: { $regex: searchTerms.split(' ')[0], $options: 'i' } },
          { topic: { $regex: searchTerms.split(' ')[0], $options: 'i' } }
        ],
        _id: { $ne: videoId }
      })
      .select('-transcript -vectorEmbedding -questions')
      .limit(3);
    }

    res.status(200).json({ success: true, gradingReport, recommendedVideos });

  } catch (error) {
    console.error("[Grading Error]:", error);
    res.status(500).json({ error: "Failed to grade the answer." });
  }
};


// ================================================================
// ==================== CHATBOT ENDPOINTS =========================
// ================================================================

// @desc    Start a quiz session from the chatbot
// @route   POST /api/ai/chatbot/start-quiz
// @access  Protected
exports.chatbotStartQuiz = async (req, res) => {
  try {
    const { subject, unit, difficulty, questionCount } = req.body;

    if (!subject || !questionCount) {
      return res.status(400).json({ error: "Subject and questionCount are required." });
    }

    // 1. Find videos matching the user's selection
    const query = { subject };
    if (unit) query.unit = unit;

    const videos = await Video.find(query).select('transcript unit topic title');
    
    // Filter to only videos that have transcripts
    const videosWithTranscripts = videos.filter(v => v.transcript && v.transcript.length > 50);

    if (videosWithTranscripts.length === 0) {
      return res.status(404).json({ 
        error: "No videos with AI-processed transcripts found for this selection. Try a different subject/unit." 
      });
    }

    // 2. Combine transcripts as context
    const combinedContext = videosWithTranscripts
      .map(v => `Topic: ${v.topic}\nUnit: ${v.unit}\nContent: ${v.transcript}`)
      .join("\n\n---\n\n");

    // 3. Generate quiz
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const difficultyGuide = difficulty === 'easy' 
      ? 'basic recall and definition questions suitable for beginners' 
      : difficulty === 'hard' 
        ? 'advanced application, analysis, and critical thinking questions'
        : 'moderate understanding and application questions';

    const prompt = `
      You are an academic quiz master for university students.
      Based on the following video transcripts, generate exactly ${questionCount} multiple-choice questions.
      
      Difficulty: ${difficulty || 'medium'} — focus on ${difficultyGuide}.
      Subject: ${subject}
      ${unit ? `Unit: ${unit}` : ''}

      Source Material:
      ${combinedContext}

      IMPORTANT: Return ONLY a valid JSON array. No markdown formatting.
      Format:
      [
        {
          "question": "clear question text",
          "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
          "correctAnswer": "the exact string of the correct option from the options array",
          "explanation": "detailed explanation of why this is correct and why others are wrong",
          "topic": "the topic this question relates to"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text();
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const quizQuestions = JSON.parse(rawText);

    // 4. Return the full quiz (frontend will display one at a time)
    res.status(200).json({
      success: true,
      quiz: quizQuestions,
      metadata: {
        subject,
        unit: unit || 'All Units',
        difficulty: difficulty || 'medium',
        totalQuestions: quizQuestions.length,
        sourceVideoCount: videosWithTranscripts.length
      }
    });

  } catch (error) {
    console.error("[Chatbot Quiz Error]:", error);
    res.status(500).json({ error: "Failed to generate quiz. Please try again." });
  }
};


// @desc    Save quiz results and get recommendations
// @route   POST /api/ai/chatbot/quiz-results
// @access  Protected
exports.chatbotQuizResults = async (req, res) => {
  try {
    const { subject, unit, difficulty, score, totalQuestions, wrongTopics } = req.body;
    const userId = req.user._id;

    // 1. Save quiz history to user profile
    await User.findByIdAndUpdate(userId, {
      $push: {
        quizHistory: {
          subject,
          unit: unit || 'All Units',
          difficulty: difficulty || 'medium',
          score,
          totalQuestions,
          date: new Date()
        }
      }
    });

    // 2. Find recommended videos for topics they got wrong
    let recommendedVideos = [];
    if (wrongTopics && wrongTopics.length > 0) {
      // Build OR query for each wrong topic
      const topicQueries = wrongTopics.map(topic => ({
        $or: [
          { topic: { $regex: topic, $options: 'i' } },
          { title: { $regex: topic, $options: 'i' } }
        ]
      }));

      recommendedVideos = await Video.find({
        subject,
        $or: topicQueries.flatMap(q => q.$or)
      })
      .select('-transcript -vectorEmbedding -questions')
      .sort({ voteScore: -1 })
      .limit(5);
    }

    // 3. Generate encouraging message based on score
    const percentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    if (percentage >= 90) message = '🏆 Outstanding! You have excellent command over this material!';
    else if (percentage >= 70) message = '👏 Great job! A few more topics to review and you\'ll ace it!';
    else if (percentage >= 50) message = '📚 Good effort! Review the recommended videos to strengthen weak areas.';
    else message = '💪 Keep practicing! Watch the recommended videos and try again.';

    res.status(200).json({
      success: true,
      message,
      percentage,
      recommendedVideos
    });

  } catch (error) {
    console.error("[Quiz Results Error]:", error);
    res.status(500).json({ error: "Failed to save quiz results." });
  }
};


// @desc    Generate a long-answer question from the chatbot
// @route   POST /api/ai/chatbot/generate-long-question
// @access  Protected
exports.chatbotGenerateLongQuestion = async (req, res) => {
  try {
    const { subject, unit } = req.body;

    if (!subject) {
      return res.status(400).json({ error: "Subject is required." });
    }

    // 1. Find videos matching selection
    const query = { subject };
    if (unit) query.unit = unit;

    const videos = await Video.find(query).select('transcript unit topic title _id');
    const videosWithTranscripts = videos.filter(v => v.transcript && v.transcript.length > 50);

    if (videosWithTranscripts.length === 0) {
      return res.status(404).json({ 
        error: "No videos with transcripts found for this selection." 
      });
    }

    // 2. Pick a random video as the basis for the question
    const randomVideo = videosWithTranscripts[Math.floor(Math.random() * videosWithTranscripts.length)];

    // 3. Generate a long-answer question
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a university professor creating an exam question.
      
      Based on this video transcript about "${randomVideo.topic}" in ${subject}:
      """${randomVideo.transcript}"""

      Generate ONE long-answer question that tests deep understanding of the material.
      The question should be the type asked in university exams (5-10 marks).

      Return ONLY a valid JSON object:
      {
        "question": "the question text",
        "expectedPoints": ["key point 1 that should be in the answer", "key point 2", "key point 3"],
        "topic": "${randomVideo.topic}"
      }
    `;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text();
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const questionData = JSON.parse(rawText);

    res.status(200).json({
      success: true,
      ...questionData,
      videoId: randomVideo._id,  // Needed later for grading against the transcript
      videoTitle: randomVideo.title
    });

  } catch (error) {
    console.error("[Long Question Error]:", error);
    res.status(500).json({ error: "Failed to generate question." });
  }
};