import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, Filter, X, Users } from 'lucide-react';
import CandidateCard from '../candidates/CandidateCard';
import CandidateTable from '../candidates/CandidateTable';
import CandidateModal from '../candidates/CandidateModal';

const statusOptions = ['All', 'New', 'Reviewed', 'Interview', 'Pending CV'];

export default function SearchView({ candidates }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...candidates];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.engineeringField.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [candidates, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1 m-0" style={{ color: 'var(--text-primary)' }}>
          Candidates
        </h1>
        <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
          {candidates.length} total candidate{candidates.length !== 1 ? 's' : ''} in the pipeline
        </p>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-secondary)' }}
          />
          <input
            type="text"
            placeholder="Search by name, title, skills, or field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
            }}
            aria-label="Search candidates"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{
                color: 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="focus-ring flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: showFilters ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: showFilters ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <Filter size={15} />
            <span className="hidden sm:inline">Filter</span>
          </button>

          <div
            className="flex rounded-lg overflow-hidden border"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="focus-ring p-2.5 transition-colors duration-150"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className="focus-ring p-2.5 transition-colors duration-150"
              style={{
                backgroundColor: viewMode === 'table' ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                color: viewMode === 'table' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                borderLeft: '1px solid var(--border-color)',
              }}
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="focus-ring px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: statusFilter === status ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: statusFilter === status ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: statusFilter === status ? 'var(--accent-primary)' : 'var(--border-color)',
                cursor: 'pointer',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <Users size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 16px' }} />
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            No candidates found
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <CandidateTable
          candidates={filtered}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {/* Quick View Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
