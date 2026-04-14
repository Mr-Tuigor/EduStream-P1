import React from 'react';
<<<<<<< Updated upstream
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';
>>>>>>> Stashed changes

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
<<<<<<< Updated upstream

import SearchPage from './pages/SearchPage';
import WatchPage from './pages/WatchPage';

// import VideoTest from './VideoTest';


function App() {
  return (
    // <VideoTest />
    <AuthProvider>
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
      </Router>
=======
import SearchPage from './pages/SearchPage';
import WatchPage from './pages/WatchPage';

import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/video/:id" element={<WatchPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Main App Route */}
            <Route path="/" element={<HomePage />} />
          </Routes>

          {/* Floating Chatbot — visible on ALL pages */}
          <ChatbotWidget />
        </Router>
      </ChatbotProvider>
>>>>>>> Stashed changes
    </AuthProvider>
  );
}

export default App;