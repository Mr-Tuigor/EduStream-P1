import React, { useState, useEffect, useRef } from 'react';
import { useChatbot } from '../context/ChatbotContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { X, Bot, Send, ChevronLeft, Loader2, BookOpen, BrainCircuit, Trophy, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000/api';

const ChatbotWidget = () => {
  const { user } = useAuth();
  const {
    isOpen, toggleChatbot,
    step, setStep,
    quizConfig, setQuizConfig,
    quizData, setQuizData,
    longAnswerData, setLongAnswerData,
    loading, setLoading,
    resetToHome, nextQuestion, recordAnswer
  } = useChatbot();

  const [universityData, setUniversityData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [longAnswer, setLongAnswer] = useState('');
  const panelRef = useRef(null);

  // Fetch university data for subject/unit options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/university`);
        setUniversityData(data);
      } catch (err) {
        console.error("Failed to fetch university data", err);
      }
    };
    if (isOpen && !universityData) fetchData();
  }, [isOpen]);

  // Get subjects list from university data based on user profile
  const getSubjects = () => {
    if (!universityData || universityData.length === 0) return [];
    const uni = universityData[0]; // Currently only RTMNU
    if (!user) {
      // Default: flatten all subjects
      const allSubjects = [];
      uni.branches?.forEach(br => {
        br.semesters?.forEach(sem => {
          sem.subjects?.forEach(sub => {
            allSubjects.push(sub.subjectName || sub);
          });
        });
      });
      return [...new Set(allSubjects)];
    }
    // Use user's branch and semester
    const branch = uni.branches?.find(b => b.branchName === user.branch);
    if (!branch) return [];
    const semester = branch.semesters?.find(s => s.semester === String(user.semester));
    if (!semester) return [];
    return semester.subjects?.map(s => s.subjectName || s) || [];
  };

  // Get units for a selected subject
  const getUnits = (subjectName) => {
    if (!universityData || universityData.length === 0) return [];
    const uni = universityData[0];
    for (const br of uni.branches || []) {
      for (const sem of br.semesters || []) {
        const subj = sem.subjects?.find(s => (s.subjectName || s) === subjectName);
        if (subj && subj.units) {
          return subj.units;
        }
      }
    }
    // Fallback: default 5 units
    return [1, 2, 3, 4, 5].map(n => ({ unitNumber: `Unit ${n}`, unitName: '' }));
  };

  // Start quiz API call
  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ai/chatbot/start-quiz`, {
        subject: quizConfig.subject,
        unit: quizConfig.unit,
        difficulty: quizConfig.difficulty,
        questionCount: quizConfig.questionCount
      }, { withCredentials: true });

      setQuizData({
        questions: data.quiz,
        currentIndex: 0,
        answers: [],
        metadata: data.metadata
      });
      setStep('quiz-active');
    } catch (err) {
      console.error("Quiz generation failed:", err);
      alert(err.response?.data?.error || "Failed to generate quiz. Try a different subject/unit.");
    }
    setLoading(false);
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null) return; // Already answered
    const currentQ = quizData.questions[quizData.currentIndex];
    const isCorrect = option === currentQ.correctAnswer;
    setSelectedAnswer(option);
    setShowExplanation(true);
    recordAnswer(option, isCorrect);
  };

  // Go to next question or results
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (quizData.currentIndex + 1 >= quizData.questions.length) {
      handleQuizComplete();
    } else {
      nextQuestion();
    }
  };

  // Quiz complete — save results
  const handleQuizComplete = async () => {
    setStep('quiz-results');
    setLoading(true);
    try {
      const score = quizData.answers.filter(a => a.isCorrect).length;
      const wrongTopics = quizData.questions
        .filter((q, i) => quizData.answers[i] && !quizData.answers[i].isCorrect)
        .map(q => q.topic || '');

      const { data } = await axios.post(`${API}/ai/chatbot/quiz-results`, {
        subject: quizConfig.subject,
        unit: quizConfig.unit,
        difficulty: quizConfig.difficulty,
        score,
        totalQuestions: quizData.questions.length,
        wrongTopics: wrongTopics.filter(Boolean)
      }, { withCredentials: true });

      setQuizData(prev => ({
        ...prev,
        resultData: data
      }));
    } catch (err) {
      console.error("Failed to save results:", err);
    }
    setLoading(false);
  };

  // Long answer — generate question
  const handleGenerateLongQuestion = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ai/chatbot/generate-long-question`, {
        subject: quizConfig.subject,
        unit: quizConfig.unit
      }, { withCredentials: true });

      setLongAnswerData({
        question: data.question,
        videoId: data.videoId,
        videoTitle: data.videoTitle,
        topic: data.topic,
        feedback: null,
        recommendedVideos: []
      });
      setStep('long-question');
    } catch (err) {
      console.error("Failed to generate question:", err);
      alert(err.response?.data?.error || "Failed to generate question.");
    }
    setLoading(false);
  };

  // Long answer — submit and grade
  const handleSubmitLongAnswer = async () => {
    if (!longAnswer.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ai/grade-answer`, {
        videoId: longAnswerData.videoId,
        question: longAnswerData.question,
        userAnswer: longAnswer
      }, { withCredentials: true });

      setLongAnswerData(prev => ({
        ...prev,
        feedback: data.gradingReport,
        recommendedVideos: data.recommendedVideos || []
      }));
      setStep('long-feedback');
    } catch (err) {
      console.error("Grading failed:", err);
      alert("Failed to grade your answer. Please try again.");
    }
    setLoading(false);
    setLongAnswer('');
  };

  // Render the current step
  const renderContent = () => {
    switch (step) {

      // ==================== HOME ====================
      case 'home':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--gradient-primary)' }}>
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Study Assistant</h3>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                Test your knowledge with AI-powered quizzes or practice long-answer questions.
              </p>

              {!user ? (
                <div className="glass-card rounded-xl p-4 w-full">
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Please login to use the AI assistant.</p>
                  <Link to="/login" onClick={toggleChatbot} className="btn-primary inline-block text-sm no-underline">
                    Login
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => setStep('quiz-config')}
                    className="glass-card rounded-xl p-4 flex items-center gap-4 text-left cursor-pointer hover:border-indigo-500/40 transition-all group w-full"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--gradient-accent)' }}>
                      <BrainCircuit size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Quiz Mode</h4>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>MCQs with explanations</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setStep('long-config')}
                    className="glass-card rounded-xl p-4 flex items-center gap-4 text-left cursor-pointer hover:border-indigo-500/40 transition-all group w-full"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--gradient-success)' }}>
                      <BookOpen size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Long Answer Mode</h4>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Practice descriptive answers</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      // ==================== QUIZ CONFIG ====================
      case 'quiz-config':
        return (
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Configure Your Quiz</h3>

            {/* Subject Selection */}
            <label className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Subject</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {getSubjects().map(sub => (
                <button
                  key={sub}
                  onClick={() => setQuizConfig(p => ({ ...p, subject: sub, unit: null }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                    ${quizConfig.subject === sub
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Unit Selection */}
            {quizConfig.subject && (
              <>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Unit</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setQuizConfig(p => ({ ...p, unit: null }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                      ${!quizConfig.unit
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                    All Units
                  </button>
                  {getUnits(quizConfig.subject).map(u => {
                    const unitNum = u.unitNumber || u;
                    const unitLabel = u.unitName ? `${unitNum} — ${u.unitName}` : unitNum;
                    return (
                      <button
                        key={unitNum}
                        onClick={() => setQuizConfig(p => ({ ...p, unit: unitNum }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                          ${quizConfig.unit === unitNum
                            ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                            : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                      >
                        {unitLabel}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Difficulty */}
            <label className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Difficulty</label>
            <div className="flex gap-2 mb-4">
              {['easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setQuizConfig(p => ({ ...p, difficulty: d }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer
                    ${quizConfig.difficulty === d
                      ? d === 'easy' ? 'border-green-500 bg-green-500/20 text-green-300'
                        : d === 'hard' ? 'border-red-500 bg-red-500/20 text-red-300'
                        : 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Question Count */}
            <label className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Questions</label>
            <div className="flex gap-2 mb-6">
              {[5, 10, 15].map(n => (
                <button
                  key={n}
                  onClick={() => setQuizConfig(p => ({ ...p, questionCount: n }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer
                    ${quizConfig.questionCount === n
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              disabled={!quizConfig.subject || loading}
              className="btn-primary w-full py-3 text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : '🚀 Start Quiz'}
            </button>
          </div>
        );

      // ==================== QUIZ ACTIVE ====================
      case 'quiz-active': {
        const currentQ = quizData.questions[quizData.currentIndex];
        if (!currentQ) return null;
        const currentAnswer = quizData.answers[quizData.currentIndex];

        return (
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                Question {quizData.currentIndex + 1} of {quizData.questions.length}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                {quizConfig.difficulty}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 mb-4">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((quizData.currentIndex + 1) / quizData.questions.length) * 100}%`,
                  background: 'var(--gradient-accent)'
                }}
              />
            </div>

            {/* Question */}
            <h4 className="text-sm font-bold text-white mb-4 leading-relaxed">{currentQ.question}</h4>

            {/* Options */}
            <div className="flex flex-col gap-2 mb-4">
              {currentQ.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                let btnClass = 'border-slate-700 text-slate-300 hover:border-slate-500 cursor-pointer';
                
                if (selectedAnswer !== null) {
                  if (option === currentQ.correctAnswer) {
                    btnClass = 'border-green-500 bg-green-500/15 text-green-300';
                  } else if (option === selectedAnswer && option !== currentQ.correctAnswer) {
                    btnClass = 'border-red-500 bg-red-500/15 text-red-300';
                  } else {
                    btnClass = 'border-slate-800 text-slate-600';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition-all flex items-start gap-2 ${btnClass} disabled:cursor-default`}
                  >
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold bg-slate-800">
                      {letter}
                    </span>
                    <span className="pt-0.5">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="animate-fade-in-up mb-4">
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                  currentAnswer?.isCorrect 
                    ? 'bg-green-500/10 border border-green-500/30 text-green-200' 
                    : 'bg-red-500/10 border border-red-500/30 text-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1.5 font-bold">
                    {currentAnswer?.isCorrect 
                      ? <><CheckCircle size={14} /> Correct!</>
                      : <><XCircle size={14} /> Incorrect</>
                    }
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              </div>
            )}

            {/* Next Button */}
            {selectedAnswer !== null && (
              <button
                onClick={handleNextQuestion}
                className="btn-primary w-full py-2.5 text-sm font-bold rounded-xl animate-fade-in mt-auto"
              >
                {quizData.currentIndex + 1 >= quizData.questions.length ? '🏆 See Results' : 'Next Question →'}
              </button>
            )}
          </div>
        );
      }

      // ==================== QUIZ RESULTS ====================
      case 'quiz-results': {
        const score = quizData.answers.filter(a => a.isCorrect).length;
        const total = quizData.questions.length;
        const pct = Math.round((score / total) * 100);
        const resultData = quizData.resultData;

        return (
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3" style={{
                background: pct >= 70 ? 'var(--gradient-success)' : pct >= 40 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'var(--gradient-danger)'
              }}>
                <Trophy size={36} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">{score}/{total}</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{pct}% — {resultData?.message || 'Quiz Complete!'}</p>
            </div>

            {/* Answer Summary */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
              {quizData.answers.map((a, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    a.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {a.isCorrect ? '✓' : '✗'}
                </div>
              ))}
            </div>

            {/* Recommended Videos */}
            {resultData?.recommendedVideos?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  📺 Recommended to Review
                </h4>
                {resultData.recommendedVideos.map(v => (
                  <Link
                    key={v._id}
                    to={`/video/${v._id}`}
                    onClick={toggleChatbot}
                    className="glass-card rounded-lg p-2.5 flex items-center gap-2.5 mb-2 no-underline text-white hover:border-indigo-500/40"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${v.imgId}/default.jpg`}
                      alt={v.title}
                      className="w-16 h-10 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{v.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.topic}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <button onClick={resetToHome} className="btn-ghost flex-1 text-xs py-2.5 rounded-xl">
                Close
              </button>
              <button onClick={() => { resetToHome(); setStep('quiz-config'); }} className="btn-primary flex-1 text-xs py-2.5 rounded-xl">
                🔄 Try Again
              </button>
            </div>
          </div>
        );
      }

      // ==================== LONG ANSWER CONFIG ====================
      case 'long-config':
        return (
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Long Answer Practice</h3>

            <label className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Subject</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {getSubjects().map(sub => (
                <button
                  key={sub}
                  onClick={() => setQuizConfig(p => ({ ...p, subject: sub, unit: null }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                    ${quizConfig.subject === sub
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {quizConfig.subject && (
              <>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Unit (Optional)</label>
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setQuizConfig(p => ({ ...p, unit: null }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                      ${!quizConfig.unit ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 text-slate-400'}`}
                  >
                    Random
                  </button>
                  {getUnits(quizConfig.subject).map(u => {
                    const unitNum = u.unitNumber || u;
                    return (
                      <button
                        key={unitNum}
                        onClick={() => setQuizConfig(p => ({ ...p, unit: unitNum }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                          ${quizConfig.unit === unitNum ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 text-slate-400'}`}
                      >
                        {unitNum}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <button
              onClick={handleGenerateLongQuestion}
              disabled={!quizConfig.subject || loading}
              className="btn-primary w-full py-3 text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-success)' }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : '📖 Generate Question'}
            </button>
          </div>
        );

      // ==================== LONG QUESTION ====================
      case 'long-question':
        return (
          <div className="flex flex-col h-full p-4">
            <div className="glass-card rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} className="text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">{longAnswerData.topic}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-relaxed">{longAnswerData.question}</h4>
            </div>

            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Write your answer below:</p>

            {/* THIS IS THE ONLY PLACE USERS CAN TYPE */}
            <textarea
              value={longAnswer}
              onChange={(e) => setLongAnswer(e.target.value)}
              placeholder="Type your detailed answer here..."
              className="input-dark flex-1 resize-none text-xs leading-relaxed mb-3"
              style={{ minHeight: '140px' }}
            />

            <button
              onClick={handleSubmitLongAnswer}
              disabled={!longAnswer.trim() || loading}
              className="btn-primary w-full py-2.5 text-sm font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-success)' }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Grading...</> : <><Send size={14} /> Submit Answer</>}
            </button>
          </div>
        );

      // ==================== LONG FEEDBACK ====================
      case 'long-feedback': {
        const fb = longAnswerData.feedback;
        if (!fb) return null;
        const scorePct = (fb.score / fb.outOf) * 100;

        return (
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            {/* Score */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2" style={{
                background: scorePct >= 70 ? 'var(--gradient-success)' : scorePct >= 40 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'var(--gradient-danger)'
              }}>
                <span className="text-xl font-black text-white">{fb.score}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>out of {fb.outOf}</p>
            </div>

            {/* Feedback */}
            <div className="glass-card rounded-xl p-3 mb-3">
              <h4 className="text-xs font-bold text-white mb-1">Feedback</h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{fb.feedback}</p>
            </div>

            {/* Missed Concepts */}
            {fb.missedConcepts?.length > 0 && (
              <div className="glass-card rounded-xl p-3 mb-3">
                <h4 className="text-xs font-bold text-amber-400 mb-2">Missed Concepts</h4>
                <ul className="space-y-1">
                  {fb.missedConcepts.map((c, i) => (
                    <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <span className="text-amber-500 mt-0.5">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Videos */}
            {longAnswerData.recommendedVideos?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  📺 Watch to Improve
                </h4>
                {longAnswerData.recommendedVideos.map(v => (
                  <Link
                    key={v._id}
                    to={`/video/${v._id}`}
                    onClick={toggleChatbot}
                    className="glass-card rounded-lg p-2 flex items-center gap-2 mb-1.5 no-underline text-white hover:border-indigo-500/40"
                  >
                    <img src={`https://img.youtube.com/vi/${v.imgId}/default.jpg`} alt={v.title} className="w-14 h-9 rounded object-cover shrink-0" />
                    <p className="text-xs font-medium truncate">{v.title}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <button onClick={resetToHome} className="btn-ghost flex-1 text-xs py-2.5 rounded-xl">Close</button>
              <button onClick={() => { setLongAnswerData({ question: null, videoId: null, videoTitle: null, topic: null, feedback: null, recommendedVideos: [] }); setStep('long-config'); }} className="btn-primary flex-1 text-xs py-2.5 rounded-xl" style={{ background: 'var(--gradient-success)' }}>
                Try Another
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      {/* ==================== FLOATING BUTTON ==================== */}
      <button
        id="chatbot-toggle"
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
        style={{
          background: isOpen ? 'var(--bg-secondary)' : 'var(--gradient-primary)',
          boxShadow: isOpen ? 'none' : '0 0 30px rgba(99, 102, 241, 0.4)',
          border: isOpen ? '1px solid var(--border-subtle)' : 'none'
        }}
        title={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? <X size={22} className="text-slate-400" /> : <Bot size={24} className="text-white animate-float" />}
      </button>

      {/* ==================== CHAT PANEL ==================== */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-50 w-[380px] h-[540px] rounded-2xl overflow-hidden flex flex-col animate-slide-up"
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.08)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div className="flex items-center gap-2.5">
              {step !== 'home' && (
                <button
                  onClick={() => {
                    if (step === 'quiz-config' || step === 'long-config') resetToHome();
                    else if (step === 'quiz-active') { setSelectedAnswer(null); setShowExplanation(false); setStep('quiz-config'); }
                    else resetToHome();
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">EduBot</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {step === 'home' ? 'Ready to help' : step.includes('quiz') ? 'Quiz Mode' : 'Long Answer Mode'}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
