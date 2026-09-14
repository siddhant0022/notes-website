import { Search, X } from 'lucide-react';
import { useFilterStore } from '../../store';
import { useSubjects } from '../../hooks/useApi';

const RESOURCE_TYPES = [
  'Class Notes',
  'AKTU PYQs',
  'Quantums',
  'Important Questions',
  'Lab Manuals',
];

export function FilterBar() {
  const { branch, semester, resourceType, search, setFilter, resetFilters } = useFilterStore();
  const { data: subjectData } = useSubjects();

  const hasFilters = branch || semester || resourceType || search;

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Search resources…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent/50"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <FilterSelect
          label="Branch"
          value={branch}
          onChange={(v) => setFilter('branch', v)}
          options={subjectData?.branches || []}
        />
        <FilterSelect
          label="Semester"
          value={semester}
          onChange={(v) => setFilter('semester', v)}
          options={(subjectData?.semesters || []).map(String)}
        />
        <FilterSelect
          label="Type"
          value={resourceType}
          onChange={(v) => setFilter('resourceType', v)}
          options={RESOURCE_TYPES}
        />

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 border border-white/10 focus:outline-none focus:border-accent/50 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
    >
      <option value="" className="bg-pitch-900">
        All {label}s
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-pitch-900">
          {o}
        </option>
      ))}
    </select>
  );
}
