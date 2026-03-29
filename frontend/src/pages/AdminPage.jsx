import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    youtubeId: '', // e.g., dQw4w9WgXcQ
    university: 'Nagpur',
    branch: '',
    semester: '1',
    subject: 'Applied Physics',
    unit: '1',
    topic: ''
  });
  
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('http://localhost:3000/api/videos', formData, {
        withCredentials: true // Important: Sends your Admin Cookie
      });
      setMessage('✅ Video Added Successfully!');
      // Reset form (optional)
      setFormData({ ...formData, title: '', youtubeId: '', topic: '' });
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to add video. Are you definitely an admin?');
    }
  };

  const handleLogout = async () => {
      await logout();
      navigate('/login');
  }


  // Security: Bounce them if they aren't admin (Client-side check)
  if (!user || user.role !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied: Admins Only</h1>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        
        <div className="flex justify-between items-center relative mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <Link to="/" className="text-slate-600 absolute right-20 font-bold hover:underline">Back</Link>
            <button onClick={handleLogout} className="text-red-600 font-bold hover:underline">Logout</button>
        </div>

        {message && (
            <div className={`p-4 mb-6 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
                <label className="block font-bold mb-1">Video Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            {/* YouTube ID */}
            <div>
                <label className="block font-bold mb-1">YouTube Video ID</label>
                <input type="text" name="youtubeId" value={formData.youtubeId} onChange={handleChange} placeholder="e.g. kKKM8Y-u7ds" className="w-full p-2 border rounded" required />
                <p className="text-xs text-slate-500 mt-1">The random code at the end of the YouTube URL</p>
            </div>

            {/* Topic */}
            <div>
                <label className="block font-bold mb-1">Topic Name</label>
                <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g. Newton's Laws" className="w-full p-2 border rounded" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Board */}
                <div>
                    <label className="block font-bold mb-1">University</label>
                    <select name="university" value={formData.university} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="Nagpur">NAGPUR</option>
                        
                    </select>
                </div>

                {/* Class */}
                <div>
                    <label className="block font-bold mb-1">Semester</label>
                    <select name="semester" value={formData.semester} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="5">5th</option>
                        <option value="6">6th</option>
                    </select>
                </div>

                {/* Branch */}
                <div>
                    <label className="block font-bold mb-1">Branch</label>
                    <select name="branch" value={formData.branch} onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="" selected>Select Branch</option>
                        <option value="ETC">ETC</option>
                    </select>
                </div>

                {/* Subject */}
                <div>
                    <label className="block font-bold mb-1">Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full p-2 border rounded">
                        {formData.semester === '5' ? (
                        <>
                          <option value="SensorAndSystem">Sensor & System</option>
                          <option value="EMW">EMW</option>
                          <option value="EmbeddedSystem">Embedded System</option>
                          <option value="DSP">DSP</option>
                        </>
                      ) : (
                        <>
                          <option value="CSE">CSE</option>
                          <option value="CCN">CCN</option>
                          <option value="WSN">WSN</option>
                          <option value="IOT">IOT</option>
                          
                        </>
                      )}
                       

                    </select>
                </div>

                {/* Unit */}
                <div>
                    <label className="block font-bold mb-1">Unit</label>
                    <select name="unit" value={formData.unit} onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="" selected>Select Unit</option>
                        <option value="1">Unit 1</option>
                        <option value="2">Unit 2</option>
                        <option value="3">Unit 3</option>
                        <option value="4">Unit 4</option>
                        <option value="5">Unit 5</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
                Add Video
            </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;