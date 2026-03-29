import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import the hook
import { Search, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth(); // 2. Get user and logout function
  const navigate = useNavigate();

  // search state
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Redirect to login page after signing out
  };

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to the Search Page with the query
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm(''); // Clear input after search
      setShowMobileSearch(false);
    }
  };


  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
{/* -------------------------------------------------------- */}
        {/* 📱 MOBILE SEARCH VIEW (Visible only when toggled)        */}
        {/* -------------------------------------------------------- */}
        {showMobileSearch ? (
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 animate-in fade-in duration-200">
            <input 
              autoFocus // ⚡ Automatically focus when opening
              type="text" 
              placeholder="Search topics..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full border border-blue-500 ring-1 ring-blue-500 focus:outline-none bg-slate-50"
            />
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="p-2 text-slate-500 hover:text-slate-800"
            >
              <X size={24} />
            </button>
          </form>
        ) : (
          /* -------------------------------------------------------- */
          /* 🖥️ STANDARD VIEW (Logo + Desktop Search + Links)         */
          /* -------------------------------------------------------- */
          <>
            {/* Logo */}
            <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600">
              EduStream
            </Link>

            {/* Desktop Search Bar (Hidden on Mobile) */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex relative">
                <input 
                    type="text" 
                    placeholder="Search for topics..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </form>

            {/* Navigation & Mobile Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
              {/* 🆕 Mobile Search Trigger Button */}
              <button 
                className="md:hidden p-2 text-slate-600 hover:text-blue-600"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search size={24} />
              </button>

              {user ? (
                <>
                  <span className="hidden lg:block text-sm font-medium text-slate-500 mr-2">
                    Hi, {user.username}
                  </span>

                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-slate-600 font-bold hover:text-blue-600 text-sm sm:text-base">Admin</Link>
                  )}

                  <Link to="/profile" className="text-slate-600 font-bold hover:text-blue-600 text-sm sm:text-base">Profile</Link>

                  <button onClick={handleLogout} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 text-sm sm:text-base">Login</Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm">Register</Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar