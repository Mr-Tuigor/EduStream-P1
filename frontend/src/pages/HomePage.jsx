import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UniversityCard from '../components/UniversityCard';
import VideoCard from '../components/VideoCard';

const HomePage = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedIsExamOriented, setSelectedIsExamOriented] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null); // Added this
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

  // ⚡ Auto-select based on User Profile
  useEffect(() => {
    if (user && universities.length > 0 && !selectedUniversity) {
      const userUni = universities.find(u => u.university === user.university);
      if (userUni) {
        setSelectedUniversity(userUni);
      }
    }
  }, [user, universities, selectedUniversity]);

  // Reset helper when navigating back via breadcrumbs
  const resetSelection = (level) => {
    if (level <= 1) setSelectedUniversity(null);
    if (level <= 2) setSelectedBranch(null);
    if (level <= 3) setSelectedSemester(null);
    if (level <= 4) setSelectedIsExamOriented(null);
    if (level <= 5) setSelectedSubject(null);
    if (level <=6) {
        setSelectedUnit(null);
        setVideos([]);
    }
  };

  // Trigger video fetch only when Unit is selected (or when Subject changes)
  const handleUnitSelect = async (unit) => {
    setSelectedUnit(unit);
    try {
      const { data } = await axios.get(`http://localhost:3000/api/videos`, {
        params: {
          university: selectedUniversity.university,
          branch: selectedBranch.branchName,
          semester: selectedSemester.semester,
          isExamOriented: selectedIsExamOriented, 
          subject: selectedSubject,
          unit: unit
        }
      });
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleVideoUpdate = (updatedVideo) => {
    setVideos(prevVideos => 
      prevVideos.map(v => v._id === updatedVideo._id ? updatedVideo : v)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => resetSelection(1)}>Universities</span>
          {selectedUniversity && <> <span>/</span> <span className="cursor-pointer hover:text-blue-600" onClick={() => resetSelection(2)}>{selectedUniversity.university}</span> </>}
          {selectedBranch && <> <span>/</span> <span className="cursor-pointer hover:text-blue-600" onClick={() => resetSelection(3)}>{selectedBranch.branchName}</span> </>}
          {selectedSemester && <> <span>/</span> <span className="cursor-pointer hover:text-blue-600" onClick={() => resetSelection(4)}>Sem {selectedSemester.semester}</span> </>}
          {selectedIsExamOriented && <> <span>/</span> <span className="cursor-pointer hover:text-blue-600" onClick={() => resetSelection(5)}>{selectedIsExamOriented === "Yes" ? "Exam Oriented" : "Non-Exam Oriented"}</span> </>}
          {selectedSubject && <> <span>/</span> <span className="cursor-pointer hover:text-blue-600" onClick={() => resetSelection(6)}>{selectedSubject}</span> </>}
        </div>

        {/* 1. University Selection */}
        {!selectedUniversity && (
          <section>
            <h2 className="text-3xl font-extrabold mb-8">Select Your University</h2>
            <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map(uni => (
                <UniversityCard key={uni._id} university={uni} onSelect={setSelectedUniversity} />
              ))}
            </div>
          </section>
        )}

        {/* 2. Branch Selection */}
        {selectedUniversity && !selectedBranch && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8">{selectedUniversity.university}: Select Branch</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedUniversity.branches.map(br => (
                <button 
                  key={br.branchName} 
                  onClick={() => setSelectedBranch(br)}
                  className="p-6 cursor-pointer bg-white border border-slate-200 rounded-xl font-bold text-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  {br.branchName}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. Semester Selection */}
        {selectedBranch && !selectedSemester && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8">Select Semester</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedBranch.semesters.map(sem => (
                <button 
                  key={sem.semester} 
                  onClick={() => setSelectedSemester(sem)}
                  className="p-6 cursor-pointer bg-white border border-slate-200 rounded-xl font-bold text-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  Semester {sem.semester}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 4. Type Selection */}
        {selectedSemester && !selectedIsExamOriented &&(
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8">Select videos type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Yes", "No"].map(ans => (
                <button 
                  key={ans} 
                  onClick={() => setSelectedIsExamOriented(ans)}
                  className="p-6 cursor-pointer bg-white border border-slate-200 rounded-xl font-bold text-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  {ans === "Yes" ? "Exam Oriented" : "Non-Exam Oriented"}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 5. Subject & Unit Selection */}
        {selectedIsExamOriented && (
          <section className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-extrabold mb-4">
                {selectedSubject ? `Subject: ${selectedSubject}` : "Select Subject"}
            </h2>

            {/* Subject Pills */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {selectedSemester.subjects.map(subject => (
                <button 
                  key={subject}
                  onClick={() => { setSelectedSubject(subject); setSelectedUnit(null); setVideos([]); }}
                  className={`px-6 cursor-pointer py-2 rounded-full border font-bold transition-all whitespace-nowrap ${selectedSubject === subject ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* 6. Unit Selection (Visible only after subject is chosen) */}
            {selectedSubject && (
              <div className="mb-10 animate-in zoom-in-95 duration-300">
                <h3 className="text-lg font-bold mb-4 text-slate-600">Select Unit</h3>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(unit => (
                    <button
                      key={unit}
                      onClick={() => handleUnitSelect(unit)}
                      className={`w-34 h-15 rounded-xl cursor-pointer flex items-center justify-center font-bold text-xl transition-all border-2 
                        ${selectedUnit === unit 
                          ? 'bg-green-600 border-green-600 text-white shadow-lg' 
                          : 'bg-white border-slate-200 hover:border-green-500 text-slate-600'}`}
                    >
                      Unit {unit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Video Results */}
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map(video => (
                  <VideoCard key={video._id} video={video} onUpdate={handleVideoUpdate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-lg">
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