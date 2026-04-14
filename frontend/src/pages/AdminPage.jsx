import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Shield, ArrowLeft, Upload, Link as LinkIcon, FileText, Layers, Target, BookOpen, Hash, Loader2 } from 'lucide-react';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    youtubeId: '',
    university: 'Nagpur',
    branch: 'ETC',
    semester: '5',
    subject: 'Sensor and Systems', // Changed to match seeder
    unit: 'Unit 1',
    topic: '',
    isExamOriented: false
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/videos', formData, {
        withCredentials: true 
      });
      setMessage('✅ Video Added and queued for AI Processing!');
      setFormData({ ...formData, title: '', youtubeId: '', topic: '' });
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to add video. Are you definitely an admin?');
    }
    setLoading(false);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="glass-card p-10 rounded-3xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield size={36} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You must be an administrator to view this page.</p>
          <Link to="/" className="btn-primary mt-8 inline-block px-8 py-3">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 animate-fade-in-up">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Shield className="text-indigo-500" /> Admin Console
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage platform content and videos</p>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold transition-colors w-fit px-4 py-2 rounded-xl hover:bg-slate-800" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Back to App
          </Link>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Upload size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Video</h2>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-bold shadow-lg ${message.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Video Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><FileText size={16} /></div>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-dark w-full pl-11" required placeholder="e.g. Introduction to JVM" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>YouTube ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><LinkIcon size={16} /></div>
                  <input type="text" name="youtubeId" value={formData.youtubeId} onChange={handleChange} placeholder="e.g. kKKM8Y-u7ds" className="input-dark w-full pl-11" required />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 ml-1">The 11-character code at the end of the YouTube URL</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Topic Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Hash size={16} /></div>
                  <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g. JVM Architecture" className="input-dark w-full pl-11" required />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/50">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 mt-4">Categorization</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>University</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Target size={16} /></div>
                  <select name="university" value={formData.university} onChange={handleChange} className="input-dark w-full pl-11 appearance-none">
                    <option value="Nagpur">NAGPUR</option>
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

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="input-dark w-full">
                  {formData.semester === '5' ? (
                    <>
                      <option value="Sensor and Systems">Sensor & System</option>
                      <option value="EMW">EMW</option>
                      <option value="Embedded System">Embedded System</option>
                      <option value="DSP">DSP</option>
                    </>
                  ) : (
                    <>
                      <option value="CSE">CSE</option>
                      <option value="CCN">CCN</option>
                      <option value="WSN">WSN</option>
                      <option value="IOT">IOT</option>
                      <option value="Java Programming(OE)">Java Programming(OE)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="input-dark w-full">
                  <option value="Unit 1">Unit 1</option>
                  <option value="Unit 2">Unit 2</option>
                  <option value="Unit 3">Unit 3</option>
                  <option value="Unit 4">Unit 4</option>
                  <option value="Unit 5">Unit 5</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800 transition-colors w-fit">
                <input 
                  type="checkbox" 
                  name="isExamOriented" 
                  checked={formData.isExamOriented} 
                  onChange={handleChange} 
                  className="w-4 h-4 rounded appearance-none border-2 border-indigo-500 checked:bg-indigo-500 relative before:content-[''] checked:before:absolute checked:before:border-b-2 checked:before:border-r-2 checked:before:border-white checked:before:w-1.5 checked:before:h-2.5 checked:before:top-0.5 checked:before:left-[3px] checked:before:rotate-45"
                />
                <span className="text-sm font-semibold text-white">This video is Exam Oriented</span>
              </label>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-700/50">
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Processing AI Features...</> : 'Add Video to Platform'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;