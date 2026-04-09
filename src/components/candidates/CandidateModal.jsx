import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Phone, Briefcase, GraduationCap, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function CandidateModal({ candidate, onClose }) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!candidate) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Candidate details: ${candidate.name}`}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="animate-scale-in w-full max-w-lg rounded-xl border overflow-hidden max-h-[85vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-base font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
                {candidate.name}
              </h2>
              <p className="text-xs m-0" style={{ color: 'var(--text-secondary)' }}>
                {candidate.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="focus-ring p-1.5 rounded-lg transition-colors duration-150"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2">
            <StatusBadge status={candidate.status} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {candidate.engineeringField}
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Mail size={14} />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Phone size={14} />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <GraduationCap size={14} />
              <span>{candidate.education}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Briefcase size={14} />
              <span>{candidate.experienceYears} year{candidate.experienceYears !== 1 ? 's' : ''} experience</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 m-0" style={{ color: 'var(--text-secondary)' }}>
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 m-0" style={{ color: 'var(--text-secondary)' }}>
              Background
            </h3>
            <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-primary)' }}>
              {candidate.background}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 px-5 py-4 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={onClose}
            className="focus-ring px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              navigate(`/candidates/${candidate.id}`);
            }}
            className="focus-ring flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-150"
            style={{
              backgroundColor: 'var(--accent-primary)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }}
          >
            <ExternalLink size={14} />
            Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
