import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UniversityCard from '../components/UniversityCard';
import VideoCard from '../components/VideoCard';
import { ChevronRight, BookOpen, Layers, Monitor, Zap } from 'lucide-react';

const HomePage = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedIsExamOriented, setSelectedIsExamOriented] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [videos, setVideos] = useState([]);

  const { user } = useAuth();

  // 1. Fetch university on Load
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/university');
        setUniversities(data);
      } catch (error) {
        console.error("Error fetching university:", error);
      }
    };
    fetchUniversities();
  }, []);

  // Auto-select based on User Profile
  useEffect(() => {
    if (user && universities.length > 0 && !selectedUniversity) {
      const userUni = universities.find(u => u.university === user.university);
      if (userUni) {
        setSelectedUniversity(userUni);
      }
    }
  }, [user, universities, selectedUniversity]);

  // Reset helper
  const resetSelection = (level) => {
    if (level <= 1) setSelectedUniversity(null);
    if (level <= 2) setSelectedBranch(null);
    if (level <= 3) setSelectedSemester(null);
    if (level <= 4) setSelectedIsExamOriented(null);
    if (level <= 5) setSelectedSubject(null);
    if (level <= 6) {
      setSelectedUnit(null);
      setVideos([]);
    }
  };

  // Fetch videos on unit select
  const handleUnitSelect = async (unitNumber) => {
    console.log(selectedBranch, selectedSemester);
    setSelectedUnit(unitNumber);
    try {
      const { data } = await axios.get(`http://localhost:3000/api/videos`, {
        params: {
          university: selectedUniversity.university,
          branch: selectedBranch.branchName,
          semester: selectedSemester.semester,
          isExamOriented: selectedIsExamOriented === 'Yes',
          subject: selectedSubject,
          unit: unitNumber
        }
      });
      setVideos(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleVideoUpdate = (updatedVideo) => {
    setVideos(prev => prev.map(v => v._id === updatedVideo._id ? updatedVideo : v));
  };

  // Get subjects from the new schema structure
  const getSubjects = () => {
    if (!selectedSemester) return [];
    return selectedSemester.subjects?.map(s => s.subjectName || s) || [];
  };

  // Get units for the selected subject
  const getUnitsForSubject = () => {
    if (!selectedSemester || !selectedSubject) return [];
    const subjObj = selectedSemester.subjects?.find(s => (s.subjectName || s) === selectedSubject);
    if (subjObj && subjObj.units) return subjObj.units;
    // Fallback
    return [1, 2, 3, 4, 5].map(n => ({ unitNumber: `Unit ${n}`, unitName: '' }));
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 mt-4 sm:mt-8">

        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-1.5 text-sm font-medium overflow-x-auto whitespace-nowrap pb-2" style={{ color: 'var(--text-muted)' }}>
          <span className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => resetSelection(1)}>University</span>
          {selectedUniversity && <><ChevronRight size={14} /> <span className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => resetSelection(2)}>{selectedUniversity.university}</span></>}
          {selectedBranch && <><ChevronRight size={14} /> <span className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => resetSelection(3)}>{selectedBranch.branchName}</span></>}
          {selectedSemester && <><ChevronRight size={14} /> <span className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => resetSelection(4)}>Sem {selectedSemester.semester}</span></>}
          {selectedIsExamOriented && <><ChevronRight size={14} /> <span className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => resetSelection(5)}>{selectedIsExamOriented === "Yes" ? "Exam Oriented" : "Conceptual"}</span></>}
          {selectedSubject && <><ChevronRight size={14} /> <span className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => resetSelection(6)}>{selectedSubject}</span></>}
        </div>

        {/* 1. University Selection */}
        {!selectedUniversity && (
          <section className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black mb-3 gradient-text">Select Your University</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Choose your university to get started</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map(uni => (
                <UniversityCard key={uni._id} university={uni} onSelect={setSelectedUniversity} />
              ))}
            </div>
          </section>
        )}

        {/* 2. Branch Selection */}
        {selectedUniversity && !selectedBranch && (
          <section className="animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">{selectedUniversity.university}</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Select your branch</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedUniversity.branches.map(br => (
                <button
                  key={br.branchName}
                  onClick={() => setSelectedBranch(br)}
                  className="glass-card rounded-xl p-6 text-center cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110" style={{ background: 'var(--gradient-accent)' }}>
                    <Layers size={20} className="text-white" />
                  </div>
                  <span className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{br.branchName}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. Semester Selection */}
        {selectedBranch && !selectedSemester && (
          <section className="animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">Select Semester</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{selectedBranch.branchName} — Choose your semester</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedBranch.semesters.map(sem => (
                <button
                  key={sem.semester}
                  onClick={() => setSelectedSemester(sem)}
                  className="glass-card rounded-xl p-6 text-center cursor-pointer group"
                >
                  <span className="text-3xl font-black gradient-text">{sem.semester}</span>
                  <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>Semester</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 4. Exam Oriented Selection */}
        {selectedSemester && !selectedIsExamOriented && (
          <section className="animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">Video Type</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Choose your learning preference</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <button
                onClick={() => setSelectedIsExamOriented("Yes")}
                className="glass-card rounded-xl p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <Zap size={24} className="text-white" />
                </div>
                <span className="font-bold text-white">Exam Oriented</span>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Focused on exam preparation</p>
              </button>
              <button
                onClick={() => setSelectedIsExamOriented("No")}
                className="glass-card rounded-xl p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--gradient-success)' }}>
                  <BookOpen size={24} className="text-white" />
                </div>
                <span className="font-bold text-white">Conceptual</span>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Deep understanding focused</p>
              </button>
            </div>
          </section>
        )}

        {/* 5. Subject & Unit Selection + Videos */}
        {selectedIsExamOriented && (
          <section className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">
              {selectedSubject ? selectedSubject : "Select Subject"}
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              {!selectedSubject ? 'Choose a subject' : !selectedUnit ? 'Now select a unit' : `Showing videos for ${selectedUnit}`}
            </p>

            {/* Subject Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {getSubjects().map(subject => (
                <button
                  key={subject}
                  onClick={() => { setSelectedSubject(subject); setSelectedUnit(null); setVideos([]); }}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer
                    ${selectedSubject === subject
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'}`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Unit Selection */}
            {selectedSubject && (
              <div className="mb-8 animate-fade-in">
                <div className="flex flex-wrap gap-3">
                  {getUnitsForSubject().map(u => {
                    const unitNum = u.unitNumber || `Unit ${u}`;
                    const unitLabel = u.unitName ? `${unitNum} — ${u.unitName}` : unitNum;
                    return (
                      <button
                        key={unitNum}
                        onClick={() => handleUnitSelect(unitNum)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border
                          ${selectedUnit === unitNum
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                            : 'border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-slate-300'}`}
                      >
                        {unitLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Video Results */}
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {videos.map(video => (
                  <VideoCard key={video._id} video={video} onUpdate={handleVideoUpdate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-card rounded-2xl" style={{ borderStyle: 'dashed' }}>
                <Monitor size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {!selectedSubject ? "Select a subject to begin" : !selectedUnit ? "Now select a unit to view videos" : "No videos found for this unit."}
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;