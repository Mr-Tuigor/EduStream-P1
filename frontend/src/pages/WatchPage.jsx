import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

import SmallVideoCard from '../components/SmallVideoCard';

const WatchPage = () => {
  const { id } = useParams(); // Get video ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Fetch videos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Main Video
        const videoRes = await axios.get(`http://localhost:3000/api/videos/${id}`);
        setVideo(videoRes.data);

        // 2. Fetch Related Videos
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

  // Handle Vote (Copy logic from VideoCard)
  const handleVote = async (type) => {
    if (!user) return alert("Login to vote!");
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/videos/${video._id}/${type}`,
        {},
        { withCredentials: true }
      );
      setVideo(data); // Update local state
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  // if (video) console.log(`https://www.youtube.com/watch?v=${video.youtubeId}`);
  if (loading) return <div className="p-10 text-center">Loading Video...</div>;
  if (!video) return <div className="p-10 text-center">Video not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Changed max-w-4xl to max-w-7xl for wider layout */}
      <div className="max-w-7xl mx-auto p-4 md:p-8"> 
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: Player & Details (Takes 2/3 width) --- */}
          <div className="lg:col-span-2">
            
            {/* Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video mb-6">
              
              <iframe
                className="w-full h-full"
                // 6mBO2vqLv38  mc979OhitAg
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                /*  src={`https://www.youtube.com/embed/${video.youtubeId}`} */

                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title & Stats */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{video.title}</h1>
          
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="text-slate-500 text-sm font-medium">
                  <span className="font-bold text-blue-600">{video.subject}</span> • 
                  {video.topic} • Semester {video.semester} • {video.university}
              </div>

             {/* Voting Actions */}
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleVote('upvote')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-colors ${video.upvotes.includes(user?._id) ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <ThumbsUp size={20} fill={video.upvotes.includes(user?._id) ? "currentColor" : "none"} />
                  {video.upvotes.length}
                </button>

                <button 
                  onClick={() => handleVote('downvote')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-colors ${video.downvotes.includes(user?._id) ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <ThumbsDown size={20} fill={video.downvotes.includes(user?._id) ? "currentColor" : "none"} />
                </button>
             </div>
          </div>
               
               <div className="prose max-w-none text-slate-600 mt-4 pt-4 border-t">
                 <p>{video.description || "No description provided."}</p>
               </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Related Videos (Takes 1/3 width) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 mb-4 px-1">
                Up Next in {video.subject}
              </h3>
              
              {relatedVideos.length > 0 ? (
                relatedVideos.map((related) => (
                  <SmallVideoCard key={related._id} video={related} />
                ))
              ) : (
                <p className="text-slate-500 text-sm px-1">No related videos found.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchPage;