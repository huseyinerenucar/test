import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import SearchView from './components/search/SearchView';
import UploadCV from './components/upload/UploadCV';
import CandidateDetail from './components/candidates/CandidateDetail';
import { mockCandidates } from './data/mockCandidates';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  const [candidates, setCandidates] = useState(mockCandidates);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleAddCandidate = (newCandidate) => {
    const id = candidates.length > 0 ? Math.max(...candidates.map((c) => c.id)) + 1 : 1;

    const experienceText = newCandidate.experience || '';
    const yearMatch = experienceText.match(/(\d+)\s*year/i);
    const experienceYears = yearMatch ? parseInt(yearMatch[1], 10) : 0;

    setCandidates((prev) => [
      ...prev,
      { ...newCandidate, id, experienceYears },
    ]);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<SearchView candidates={candidates} />} />
            <Route path="/upload" element={<UploadCV onAddCandidate={handleAddCandidate} />} />
            <Route path="/candidates/:id" element={<CandidateDetail candidates={candidates} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
