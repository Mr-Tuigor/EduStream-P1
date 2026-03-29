import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext'; // We need to add a register function here next
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    university: 'CBSE', // Default
    semester: '10' // Default
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // FIREBASE_REPLACE: 
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // await setDoc(doc(db, "users", userCredential.user.uid), { ...extraData });
      
      // For now, hit our local backend
      await axios.post("http://localhost:3000/api/auth/register", formData);
      
      // On success, redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Create Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-slate-700">Username</label>
            <input type="text" name="username" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">Email</label>
            <input type="email" name="email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>

          {/* University Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700">University</label>
            <select name="university" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="Nagpur" selected>Nagpur</option>
                <option value="Pune">Pune</option>
            </select>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700">Branch</label>
            <select name="branchName" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="ETC" selected>ETC</option>
                <option value="CS">CS</option>
            </select>
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700">Class</label>
            <select name="semester" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="5">5th</option>
                <option value="6">6th</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;