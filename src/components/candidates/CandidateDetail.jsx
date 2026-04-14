import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, Briefcase, GraduationCap, Calendar,
  FileText, Hash, Clock, User, Loader,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { apiUrl } from '../../lib/api';

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl(`/api/candidates/${id}`))
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setCandidate)
      .catch(() => setCandidate(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <User size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 16px' }} />
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Candidate not found
        </h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          The candidate you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="focus-ring inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-200"
          style={{
            backgroundColor: 'var(--accent-primary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          Back to Candidates
        </button>
      </div>
    );
  }

  const infoItems = [
    { Icon: Mail, label: 'Email', value: candidate.email },
    { Icon: Phone, label: 'Phone', value: candidate.phone },
    { Icon: Briefcase, label: 'Field', value: candidate.engineeringField },
    { Icon: GraduationCap, label: 'Education', value: candidate.education },
    { Icon: Clock, label: 'Experience', value: `${candidate.experienceYears} year${candidate.experienceYears !== 1 ? 's' : ''}` },
    { Icon: Hash, label: 'OSYM Ranking', value: candidate['OSYM siralamasi']?.toLocaleString() },
    { Icon: Calendar, label: 'Upload Date', value: new Date(candidate.uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
    { Icon: FileText, label: 'CV', value: candidate.cvAttached ? candidate.cvFileName : 'Not attached' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
      <button
        onClick={() => navigate('/')}
        className="focus-ring flex items-center gap-2 text-sm font-medium mb-6 px-3 py-1.5 rounded-lg transition-colors duration-200"
        style={{
          color: 'var(--text-secondary)',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          e.currentTarget.style.color = 'var(--accent-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        <ArrowLeft size={16} />
        Back to Candidates
      </button>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-6 border-b"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold m-0" style={{ color: 'var(--text-primary)' }}>
                  {candidate.name}
                </h1>
                <StatusBadge status={candidate.status} />
              </div>
              <p className="text-base m-0" style={{ color: 'var(--text-secondary)' }}>
                {candidate.title}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Info Grid */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
              Contact & Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <item.Icon size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <p className="text-xs font-medium mb-0.5 m-0" style={{ color: 'var(--text-secondary)' }}>
                      {item.label}
                    </p>
                    <p className="text-sm m-0" style={{ color: 'var(--text-primary)' }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
              Experience
            </h2>
            <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-primary)' }}>
              {candidate.experience}
            </p>
          </section>

          {/* Background */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
              Background
            </h2>
            <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-primary)' }}>
              {candidate.background}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
