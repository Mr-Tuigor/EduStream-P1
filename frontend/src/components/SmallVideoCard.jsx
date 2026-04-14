import React from 'react';
import { Link } from 'react-router-dom';

const SmallVideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="flex gap-3 mb-3 group cursor-pointer no-underline rounded-xl p-2 hover:bg-slate-800/50 transition-all">
      {/* Thumbnail Wrapper */}
      <div className="w-36 h-20 shrink-0 relative rounded-lg overflow-hidden bg-slate-900">
        <img 
          src={`https://img.youtube.com/vi/${video.imgId}/hqdefault.jpg`} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Text Info */}
      <div className="flex flex-col justify-center min-w-0">
        <h4 className="font-semibold text-xs text-white line-clamp-2 leading-snug mb-1 group-hover:text-indigo-300 transition-colors">
          {video.title}
        </h4>
        <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {video.branch} • Semester {video.semester}
        </div>
        <div className="text-xs font-medium mt-1 px-2 py-0.5 rounded w-fit" style={{
          background: 'rgba(99, 102, 241, 0.1)',
          color: '#a5b4fc'
        }}>
          {video.subject}
        </div>
      </div>
    </Link>
  );
};

export default SmallVideoCard;
