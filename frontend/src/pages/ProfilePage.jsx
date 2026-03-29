import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    university: 'CBSE',
    semester: '10'
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });

  // 1. Pre-fill the form when the user loads
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        university: user.university || 'CBSE',
        semester: user.semester || '10'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // 2. Call our new Context function
    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ text: '✅ Profile updated successfully!', type: 'success' });
    } else {
      setMessage({ text: '❌ Update failed: ' + result.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="p-8">
          {message.text && (
            <div className={`p-4 mb-6 rounded text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Identity Section */}
            <div className="space-y-4">
              <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider border-b pb-2">Identity</h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Academic Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider border-b pb-2">Academic Preferences</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">University</label>
                  <select name="university" value={formData.university} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                    <option value="Nagpur" selected>Nagpur</option>
                    <option value="Pune">Pune</option>
                    {/* <option value="Other">Other</option> */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
                  <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                    {/* <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option> */}
                    <option value="5" selected>5</option>
                    <option value="6">6</option>
                    {/* <option value="7">7</option>
                    <option value="8">8</option> */}

                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Changing these will automatically update your Home Dashboard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-4">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;