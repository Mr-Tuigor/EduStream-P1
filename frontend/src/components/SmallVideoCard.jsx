import React from 'react';
import { Link } from 'react-router-dom';

const SmallVideoCard = ({ video }) => {

  return (
    <Link to={`/video/${video._id}`} className="flex gap-3 mb-4 group cursor-pointer">
      {/* Thumbnail Wrapper */}
      <div className="w-40 h-24 shrink-0 relative rounded-lg overflow-hidden bg-slate-900">
        <img 
          src={`https://img.youtube.com/vi/${video.imgId}/hqdefault.jpg`} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
        />
      </div>

      {/* Text Info */}
      <div className="flex flex-col justify-center">
        <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight mb-1 group-hover:text-blue-600">
          {video.title}
        </h4>
        <div className="text-xs text-slate-500 font-medium">
          {video.branch} • Semester {video.semeter}
        </div>
        <div className="text-xs text-blue-500 bg-blue-50 w-fit px-2 py-0.5 rounded mt-1">
          {video.subject}
        </div>
      </div>
    </Link>
  );
};

export default SmallVideoCard;
