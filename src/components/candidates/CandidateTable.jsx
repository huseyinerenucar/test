import { useNavigate } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function CandidateTable({ candidates, sortField, sortDirection, onSort }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'engineeringField', label: 'Field' },
    { key: 'experienceYears', label: 'Experience' },
    { key: 'status', label: 'Status' },
    { key: 'uploadDate', label: 'Date' },
  ];

  return (
    <div
      className="rounded-xl border overflow-hidden animate-fade-in"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none transition-colors duration-150"
                  style={{
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                  onClick={() => onSort(col.key)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <ArrowUpDown
                      size={13}
                      style={{
                        opacity: sortField === col.key ? 1 : 0.3,
                        transform: sortField === col.key && sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="cursor-pointer transition-colors duration-150"
                style={{ backgroundColor: 'var(--card-bg)' }}
                onClick={() => navigate(`/candidates/${candidate.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                }}
                tabIndex={0}
                role="button"
                aria-label={`View candidate ${candidate.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/candidates/${candidate.id}`);
                  }
                }}
              >
                <td
                  className="px-4 py-3.5"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {candidate.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {candidate.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className="px-4 py-3.5"
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {candidate.title}
                </td>
                <td
                  className="px-4 py-3.5"
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {candidate.engineeringField}
                </td>
                <td
                  className="px-4 py-3.5"
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {candidate.experienceYears} yr{candidate.experienceYears !== 1 ? 's' : ''}
                </td>
                <td
                  className="px-4 py-3.5"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <StatusBadge status={candidate.status} />
                </td>
                <td
                  className="px-4 py-3.5"
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {new Date(candidate.uploadDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
