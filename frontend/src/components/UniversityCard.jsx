// frontend/src/components/UniversityCard.jsx
import React from 'react';

const UniversityCard = ({ university, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(university)}
      className="group cursor-pointer p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
    >
      <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
        {university.university}
      </h2>
      <p className="mt-2 text-slate-500 font-medium">Click to view semesters</p>
      <div className="mt-4 inline-block w-8 h-1 bg-blue-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
    </div>
  );
};

export default UniversityCard;