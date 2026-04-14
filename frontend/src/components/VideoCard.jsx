import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VideoCard = ({ video, onUpdate }) => {
  const { user } = useAuth();

  const handleVote = async (type) => {
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

  const voteScore = (video.upvotes?.length || 0) - (video.downvotes?.length || 0);
  const scoreBorderColor = voteScore > 0 ? 'rgba(16, 185, 129, 0.4)' : voteScore < 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)';

  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        <Link to={`/video/${video._id}`}>
          <img 
            src={`https://img.youtube.com/vi/${video.imgId}/hqdefault.jpg`} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Score Badge */}
          <div 
            className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm"
            style={{ 
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${scoreBorderColor}`,
              color: voteScore > 0 ? '#34d399' : voteScore < 0 ? '#f87171' : '#fbbf24'
            }}
          >
            {voteScore > 0 ? '+' : ''}{voteScore}
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-white line-clamp-2 mb-1 leading-snug">
          <Link to={`/video/${video._id}`} className="no-underline text-white hover:text-indigo-300 transition-colors">
            {video.title}
          </Link>
        </h3>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{video.topic}</p>
        
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex gap-3">
            {/* Upvote Button */}
            <button 
              onClick={() => handleVote('upvote')}
              className={`flex items-center gap-1 transition-all cursor-pointer ${
                video.upvotes?.includes(user?._id) 
                  ? 'text-indigo-400' 
                  : 'text-slate-500 hover:text-indigo-400'
              }`}
            >
              <ThumbsUp size={16} fill={video.upvotes?.includes(user?._id) ? "currentColor" : "none"} />
              <span className="text-xs font-bold">{video.upvotes?.length || 0}</span>
            </button>

            {/* Downvote Button */}
            <button 
              onClick={() => handleVote('downvote')}
              className={`flex items-center gap-1 transition-all cursor-pointer ${
                video.downvotes?.includes(user?._id) 
                  ? 'text-red-400' 
                  : 'text-slate-500 hover:text-red-400'
              }`}
            >
              <ThumbsDown size={16} fill={video.downvotes?.includes(user?._id) ? "currentColor" : "none"} />
            </button>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            color: '#a5b4fc',
            border: '1px solid rgba(99, 102, 241, 0.15)'
          }}>
            {video.subject}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;