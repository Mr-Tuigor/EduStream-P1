import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

import SearchPage from './pages/SearchPage';
import WatchPage from './pages/WatchPage';
import ChatbotWidget from './components/ChatbotWidget';

// import VideoTest from './VideoTest';


function App() {
  return (
    // <VideoTest />
    <AuthProvider>
      <ChatbotProvider>
        <Router>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/video/:id" element={<WatchPage />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Main App Route */}
          <Route path="/" element={<HomePage />} />
          </Routes>
          <ChatbotWidget />
        </Router>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;