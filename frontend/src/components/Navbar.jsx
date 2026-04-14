import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, X, GraduationCap, LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      setShowMobileSearch(false);
    }
  };

  return (
    <nav className="glass sticky top-0 z-40" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

        {/* MOBILE SEARCH VIEW */}
        {showMobileSearch ? (
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 animate-fade-in">
            <input
              autoFocus
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark flex-1 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </form>
        ) : (
          <>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tight gradient-text hidden sm:block group-hover:opacity-80 transition-opacity">
                EduStream
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex relative mx-8">
              <input
                type="text"
                placeholder="Search for topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-2 text-sm"
              />
              <Search className="absolute left-3 top-2.5" size={16} style={{ color: 'var(--text-muted)' }} />
            </form>

            {/* Navigation & Mobile Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {/* Mobile Search Trigger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => setShowMobileSearch(true)}
                style={{ color: 'var(--text-secondary)' }}
              >
                <Search size={20} />
              </button>

              {user ? (
                <>
                  <span className="hidden lg:block text-sm font-medium mr-1" style={{ color: 'var(--text-secondary)' }}>
                    {user.username}
                  </span>

                  {user.role === 'admin' && (
                    <Link to="/admin" className="p-2 rounded-lg hover:bg-slate-800 transition-colors no-underline" title="Admin" style={{ color: 'var(--text-secondary)' }}>
                      <Shield size={18} />
                    </Link>
                  )}

                  <Link to="/profile" className="p-2 rounded-lg hover:bg-slate-800 transition-colors no-underline" title="Profile" style={{ color: 'var(--text-secondary)' }}>
                    <User size={18} />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-400 cursor-pointer"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold no-underline px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm no-underline px-4 py-1.5 rounded-lg">
                    Register
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;