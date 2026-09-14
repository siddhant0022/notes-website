import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResourceBentoGrid } from '../components/resources/ResourceCard';
import { FilterBar } from '../components/resources/FilterBar';
import { ResourceGridSkeleton } from '../components/ui/Skeleton';
import {
  useResources,
  useToggleStar,
  usePublicStats,
  downloadFile,
} from '../hooks/useApi';
import { useAuthStore, useFilterStore } from '../store';

export function HomePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { branch, semester, resourceType, search } = useFilterStore();
  const { user, isAuthenticated } = useAuthStore();
  const toggleStar = useToggleStar();

  const params = {
    page,
    limit: 12,
    ...(branch && { branch }),
    ...(semester && { semester }),
    ...(resourceType && { type: resourceType }),
    ...(search && { search }),
  };

  const { data, isLoading, isFetching } = useResources(params);
  const { data: statsData } = usePublicStats();

  useEffect(() => {
    setPage(1);
  }, [branch, semester, resourceType, search]);

  const handleStar = (id) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleStar.mutate(id);
  };

  const stats = [
    { label: 'Resources', value: statsData?.totalResources ?? '—' },
    { label: 'Contributors', value: statsData?.totalUsers ?? '—' },
    { label: 'Downloads', value: statsData?.totalDownloads ?? '—' },
  ];

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            GCET Resource Hub
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight">
            Notes that
            <br />
            <span className="text-accent">actually help</span> you pass.
          </h1>
          <p className="text-slate-400 max-w-lg text-sm leading-relaxed">
            Browse, preview, and download curated academic resources — class notes,
            PYQs, quantums, lab manuals — filtered by branch, semester, and subject.
          </p>
        </div>

        <div className="lg:col-span-5 flex gap-3 lg:justify-end">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl px-4 py-3 text-center min-w-[90px]">
              <p className="font-display text-xl font-bold text-accent">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <FilterBar />

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold">
            {search ? `Results for "${search}"` : 'Recent Resources'}
          </h2>
          <span className="text-xs text-slate-500">
            {isFetching ? 'Loading…' : `${data?.total ?? 0} results`}
          </span>
        </div>

        {isLoading ? (
          <ResourceGridSkeleton />
        ) : !data?.resources?.length ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-sm">No resources found. Try adjusting filters.</p>
          </div>
        ) : (
          <>
            <ResourceBentoGrid
              resources={data.resources}
              starredIds={user?.starredResources || []}
              onView={(r) => navigate(`/resources/${r._id}`)}
              onDownload={downloadFile}
              onStar={handleStar}
            />

            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-400">
                  Page {page} of {data.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                  disabled={page >= data.pages}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
