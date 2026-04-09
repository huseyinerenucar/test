import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Briefcase, GraduationCap, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function CandidateCard({ candidate }) {
  const navigate = useNavigate();

  return (
    <article
      className="animate-fade-in rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        boxShadow: `0 1px 3px ${getComputedStyle(document.documentElement).getPropertyValue('--shadow-color').trim()}`,
      }}
      onClick={() => navigate(`/candidates/${candidate.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px var(--shadow-color)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
      role="button"
      tabIndex={0}
      aria-label={`View candidate ${candidate.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/candidates/${candidate.id}`);
        }
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-sm font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
              {candidate.name}
            </h3>
            <p className="text-xs m-0" style={{ color: 'var(--text-secondary)' }}>
              {candidate.title}
            </p>
          </div>
        </div>
        <StatusBadge status={candidate.status} />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <Briefcase size={13} />
          <span>{candidate.engineeringField}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <GraduationCap size={13} />
          <span>{candidate.education}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <Mail size={13} />
          <span>{candidate.email}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {candidate.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-md text-xs font-medium"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--accent-primary)',
            }}
          >
            {skill}
          </span>
        ))}
        {candidate.skills.length > 3 && (
          <span
            className="px-2 py-0.5 rounded-md text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            +{candidate.skills.length - 3}
          </span>
        )}
      </div>

      <div
        className="flex items-center justify-between pt-3 border-t text-xs"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
      >
        <span>{candidate.experienceYears} yr{candidate.experienceYears !== 1 ? 's' : ''} exp</span>
        <div className="flex items-center gap-1">
          <FileText size={12} />
          <span>{candidate.cvAttached ? 'CV attached' : 'No CV'}</span>
        </div>
      </div>
    </article>
  );
}
