import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import { SearchX, Loader2, Sparkles } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:3000/api/videos?search=${query}`);
        setVideos(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8 p-6 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Search Results
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Showing results for <span className="text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">"{query}"</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Searching videos...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-slate-700 mx-auto max-w-2xl animate-fade-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-800/50">
              <SearchX size={32} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
              We couldn't find any videos matching "{query}". 
            </p>
            <div className="flex justify-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs border border-slate-700 text-slate-400 bg-slate-800/50">Try different spelling</span>
              <span className="px-3 py-1 rounded-full text-xs border border-slate-700 text-slate-400 bg-slate-800/50">Use broader terms</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;