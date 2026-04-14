import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import SearchView from './components/search/SearchView';
import UploadCV from './components/upload/UploadCV';
import CandidateDetail from './components/candidates/CandidateDetail';
import { apiUrl } from './lib/api';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/candidates'));
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<SearchView candidates={candidates} loading={loading} />} />
            <Route path="/upload" element={<UploadCV onCandidateAdded={fetchCandidates} />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
