import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, Mail, Lock, User, Target, Layers, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    university: 'Nagpur', 
    branch: 'ETC',
    semester: '5' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/auth/register", formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ background: 'var(--bg-primary)' }}>
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[100px]" style={{ background: 'var(--gradient-success)' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[100px]" style={{ background: 'var(--gradient-accent)' }}></div>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-2xl transition-transform hover:scale-105" style={{ background: 'var(--gradient-success)' }}>
            <GraduationCap size={32} className="text-white" />
          </Link>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join EduStream and supercharge your studies</p>
        </div>

        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input 
                  type="text" name="username" onChange={handleChange} 
                  className="input-dark w-full pl-11" placeholder="student123" required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" name="email" onChange={handleChange} 
                  className="input-dark w-full pl-11" placeholder="student@example.com" required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" name="password" onChange={handleChange} 
                  className="input-dark w-full pl-11" placeholder="••••••••" required 
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/50 mt-4">
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider w-fit mx-auto -mt-5 px-3 mb-4" style={{ background: 'var(--bg-card)' }}>Academic Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>University</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Target size={16} />
                  </div>
                  <select name="university" onChange={handleChange} className="input-dark w-full pl-11 appearance-none cursor-pointer" defaultValue="Nagpur">
                    <option value="Nagpur">Nagpur University</option>
                    <option value="Pune">Pune University</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Branch</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Layers size={16} />
                  </div>
                  <select name="branch" onChange={handleChange} className="input-dark w-full pl-11 appearance-none cursor-pointer" defaultValue="ETC">
                    <option value="ETC">ETC</option>
                    <option value="CS">CS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Semester</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <BookOpen size={16} />
                  </div>
                  <select name="semester" onChange={handleChange} className="input-dark w-full pl-11 appearance-none cursor-pointer" defaultValue="5">
                    <option value="5">5th Sem</option>
                    <option value="6">6th Sem</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: 'var(--gradient-success)' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Complete Registration <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;