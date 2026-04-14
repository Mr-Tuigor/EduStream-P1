import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, Target, BookOpen, Layers, Settings, Award, Loader2, CheckCircle2, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    university: 'Nagpur',
    branch: 'ETC',
    semester: '5'
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        university: user.university || 'Nagpur',
        branch: user.branch || 'ETC',
        semester: user.semester || '5'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } else {
      setMessage({ text: 'Update failed: ' + result.message, type: 'error' });
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 animate-fade-in-up">
        
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shrink-0" style={{ background: 'var(--gradient-primary)' }}>
            <span className="text-4xl font-black text-white">{user.username?.charAt(0).toUpperCase()}</span>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black text-white mb-1">{user.username}</h1>
            <p className="text-indigo-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <Award size={16} /> Beta Tester
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800">
                  <Settings size={20} className="text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Account Settings</h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage your details and preferences</p>
                </div>
              </div>

              {message.text && (
                <div className={`p-4 mb-6 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.type === 'success' && <CheckCircle2 size={18} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><User size={16} /></div>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-dark w-full pl-11" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Mail size={16} /></div>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-dark w-full pl-11" required />
                    </div>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 pt-4 border-t border-slate-700/50">Academic Preferences</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>These settings personalize your home dashboard automatically.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>University</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Target size={16} /></div>
                      <select name="university" value={formData.university} onChange={handleChange} className="input-dark w-full pl-11 appearance-none">
                        <option value="Nagpur">Nagpur</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Branch</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Layers size={16} /></div>
                      <select name="branch" value={formData.branch} onChange={handleChange} className="input-dark w-full pl-11 appearance-none">
                        <option value="ETC">ETC</option>
                        <option value="CS">CS</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Semester</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><BookOpen size={16} /></div>
                      <select name="semester" value={formData.semester} onChange={handleChange} className="input-dark w-full pl-11 appearance-none">
                        <option value="5">5th</option>
                        <option value="6">6th</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={loading} className="btn-primary py-3 px-8 text-sm flex items-center justify-center gap-2">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar / Quiz History */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}>
                  <History size={16} className="text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Quiz History</h3>
              </div>

              <div className="space-y-3">
                {user.quizHistory && user.quizHistory.length > 0 ? (
                  user.quizHistory.slice().reverse().slice(0, 5).map((quiz, i) => {
                    const pct = Math.round((quiz.score / quiz.totalQuestions) * 100);
                    return (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-white leading-tight">{quiz.subject}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{quiz.unit}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            pct >= 70 ? 'bg-emerald-500/20 text-emerald-400' : pct >= 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {quiz.score}/{quiz.totalQuestions}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 mt-2">
                          <span>{quiz.difficulty}</span>
                          <span>{new Date(quiz.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm border border-dashed border-slate-700 rounded-xl p-4" style={{ color: 'var(--text-muted)' }}>
                      No quiz history yet. Open the AI Assistant to take your first quiz!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;