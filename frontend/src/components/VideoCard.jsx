import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VideoCard = ({ video, onUpdate }) => {
  
  // 3. Get the real logged-in user from the "Brain"
  // const { user } = useContext(AuthContext);
  const { user } = useAuth();


  const handleVote = async (type) => {
    // Stop them if they aren't logged in
    if (!user) {
        alert("Please login to vote!");
        return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/videos/${video._id}/${type}`,
        {},
        { withCredentials: true }
      );
      if (onUpdate) {
        onUpdate(data);
      }
    } catch (error) {
      console.error("Voting failed", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video">
        <Link to={`/video/${video._id}`}><img 
          src={`https://img.youtube.com/vi/${video.imgId}/hqdefault.jpg`} 
          alt={video.title}
          className={`border-4 rounded-2xl ${video.upvotes.length - video.downvotes.length > 0 ? 'border-green-500' : video.upvotes.length - video.downvotes.length < 0 ? 'border-red-500': 'border-yellow-600'} border-gray-800 w-full p-2 h-full object-cover group-hover:opacity-80 transition-opacity`}
        /></Link> 
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
          <Link to={`/video/${video._id}`} className="hover:text-blue-600 hover:underline">
            {video.title}
          </Link></h3>
        <p className="text-sm text-slate-500 mt-1">{video.topic}</p>
        
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex gap-4">

            {/* Upvote Button */}
            <button 
              onClick={() => handleVote('upvote')}
              // 4. CHECK: Is the Real User's ID in the upvotes array?
              // user?._id ensures it doesn't crash if user is null (not logged in)
              className={`flex items-center gap-1 transition-colors ${video.upvotes.includes(user?._id) ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
            >
              <ThumbsUp size={20} fill={video.upvotes.includes(user?._id) ? "currentColor" : "none"} />
              <span className="font-bold">{video.upvotes.length}</span>
            </button>

            {/* Downvote Button */}
            <button 
              onClick={() => handleVote('downvote')}
              // 5. CHECK: Is the Real User's ID in the downvotes array?
              className={`flex items-center gap-1 transition-colors ${video.downvotes.includes(user?._id) ? 'text-red-600' : 'text-slate-400 hover:text-red-600'}`}
            >
              <ThumbsDown size={20} fill={video.downvotes.includes(user?._id) ? "currentColor" : "none"} />
            </button>

          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded">
            {video.subject}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;