import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, ThumbsDown, ArrowLeft, BotMessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import SmallVideoCard from '../components/SmallVideoCard';
import { useAuth } from '../context/AuthContext';
import { useChatbot } from '../context/ChatbotContext';

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleChatbot, setIsOpen } = useChatbot();
  
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const videoRes = await axios.get(`http://localhost:3000/api/videos/${id}`);
        setVideo(videoRes.data);
        const relatedRes = await axios.get(`http://localhost:3000/api/videos/related/${id}`);
        setRelatedVideos(relatedRes.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleVote = async (type) => {
    if (!user) return alert("Please login to vote!");
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/videos/${video._id}/${type}`,
        {},
        { withCredentials: true }
      );
      setVideo(data);
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  const handleAskAI = () => {
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Video not found</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>The video you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Return to Home</button>
        </div>
      </div>
    );
  }

  const voteScore = (video.upvotes?.length || 0) - (video.downvotes?.length || 0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center gap-2 text-sm font-semibold transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-slate-800"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player & Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Player */}
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl aspect-video border-0 bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title & Stats */}
            <div className="glass-card p-6 md:p-8 rounded-2xl">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">
                {video.title}
              </h1>
          
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    {video.subject}
                  </span>
                  <span>Semester {video.semester}</span>
                  <span>•</span>
                  <span>{video.topic}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={handleAskAI}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg hover:-translate-y-0.5"
                    style={{ background: 'var(--gradient-primary)', color: 'white' }}
                  >
                    <BotMessageSquare size={16} /> Ask AI
                  </button>

                  <div className="flex items-center rounded-xl overflow-hidden glass-light">
                    <button 
                      onClick={() => handleVote('upvote')}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-colors border-r cursor-pointer ${
                        video.upvotes?.includes(user?._id) 
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                          : 'hover:bg-slate-800 text-slate-300 border-transparent'
                      }`}
                      style={{ borderRightColor: 'var(--border-subtle)' }}
                    >
                      <ThumbsUp size={16} fill={video.upvotes?.includes(user?._id) ? "currentColor" : "none"} />
                      <span>{video.upvotes?.length || 0}</span>
                    </button>

                    <button 
                      onClick={() => handleVote('downvote')}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        video.downvotes?.includes(user?._id) 
                          ? 'bg-red-500/20 text-red-300' 
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <ThumbsDown size={16} fill={video.downvotes?.includes(user?._id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
               
              <div className="mt-6">
                <h3 className="text-sm font-bold text-white mb-2">Description</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                  {video.description || "No description provided for this lecture."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Related Videos */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 rounded-2xl sticky top-24">
              <h3 className="font-bold text-lg text-white mb-4">Up Next</h3>
              <div className="space-y-1">
                {relatedVideos.length > 0 ? (
                  relatedVideos.map((related) => (
                    <SmallVideoCard key={related._id} video={related} />
                  ))
                ) : (
                  <div className="text-center py-8 rounded-xl bg-slate-800/30 border border-dashed border-slate-700">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No related videos found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchPage;