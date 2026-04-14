import { useContext, createContext, useState } from "react";

const ChatbotContext = createContext();

export const useChatbot = () => {
  return useContext(ChatbotContext);
};

/**
 * ChatbotProvider manages the entire chatbot state across all pages.
 * 
 * State is preserved even when navigating between pages,
 * so a user won't lose their quiz progress.
 */
export const ChatbotProvider = ({ children }) => {
  // Panel visibility
  const [isOpen, setIsOpen] = useState(false);

  // Current step in the flow
  // Steps: 'home' | 'quiz-config' | 'quiz-active' | 'quiz-results' | 'long-config' | 'long-question' | 'long-feedback'
  const [step, setStep] = useState('home');

  // Quiz configuration (selected by user via option buttons)
  const [quizConfig, setQuizConfig] = useState({
    subject: null,
    unit: null,
    difficulty: 'medium',
    questionCount: 5
  });

  // Quiz session data
  const [quizData, setQuizData] = useState({
    questions: [],
    currentIndex: 0,
    answers: [],       // Array of { selectedOption, isCorrect }
    metadata: null
  });

  // Long answer session data
  const [longAnswerData, setLongAnswerData] = useState({
    question: null,
    videoId: null,
    videoTitle: null,
    topic: null,
    feedback: null,
    recommendedVideos: []
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Toggle chatbot open/close
  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
  };

  // Reset back to home
  const resetToHome = () => {
    setStep('home');
    setQuizConfig({ subject: null, unit: null, difficulty: 'medium', questionCount: 5 });
    setQuizData({ questions: [], currentIndex: 0, answers: [], metadata: null });
    setLongAnswerData({ question: null, videoId: null, videoTitle: null, topic: null, feedback: null, recommendedVideos: [] });
  };

  // Move to next quiz question
  const nextQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1
    }));
  };

  // Record an answer
  const recordAnswer = (selectedOption, isCorrect) => {
    setQuizData(prev => ({
      ...prev,
      answers: [...prev.answers, { selectedOption, isCorrect }]
    }));
  };

  return (
    <ChatbotContext.Provider value={{
      isOpen, setIsOpen, toggleChatbot,
      step, setStep,
      quizConfig, setQuizConfig,
      quizData, setQuizData,
      longAnswerData, setLongAnswerData,
      loading, setLoading,
      resetToHome, nextQuestion, recordAnswer
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};
