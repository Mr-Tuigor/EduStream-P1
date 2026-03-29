import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Hook to read URL query
import axios from 'axios';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Get "Gravity" from URL
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Call our API with the search param
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
  }, [query]); // Re-run whenever the query changes

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Search Results for: <span className="text-blue-600">"{query}"</span>
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-lg">No videos found matching "{query}"</p>
            <p className="text-slate-400 text-sm mt-2">Try searching for "Physics" or "Motion"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;