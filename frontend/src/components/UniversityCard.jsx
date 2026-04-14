import React from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';

const UniversityCard = ({ university, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(university)}
      className="glass-card cursor-pointer rounded-2xl p-8 text-center group"
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'var(--gradient-primary)' }}>
        <GraduationCap size={32} className="text-white" />
      </div>
      <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
        {university.university}
      </h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {university.branches?.length || 0} branch{university.branches?.length !== 1 ? 'es' : ''} available
      </p>
      <div className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <ChevronRight size={14} />
      </div>
    </div>
  );
};

export default UniversityCard;