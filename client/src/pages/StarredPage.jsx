import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { ResourceBentoGrid } from '../components/resources/ResourceCard';
import { ResourceGridSkeleton } from '../components/ui/Skeleton';
import { ProtectedRoute } from '../components/ui/ProtectedRoute';
import {
  useStarredResources,
  useToggleStar,
  downloadFile,
} from '../hooks/useApi';
import { useAuthStore } from '../store';

export function StarredPage() {
  return (
    <ProtectedRoute>
      <StarredContent />
    </ProtectedRoute>
  );
}

function StarredContent() {
  const navigate = useNavigate();
  const { data: resources, isLoading } = useStarredResources();
  const toggleStar = useToggleStar();
  const { user } = useAuthStore();

  if (isLoading) return <ResourceGridSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Starred Resources</h1>
        <p className="text-sm text-slate-400">Your saved notes and study materials.</p>
      </div>

      {!resources?.length ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Star className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No starred resources yet.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-accent text-sm hover:underline"
          >
            Browse resources
          </button>
        </div>
      ) : (
        <ResourceBentoGrid
          resources={resources}
          starredIds={user?.starredResources || []}
          onView={(r) => navigate(`/resources/${r._id}`)}
          onDownload={downloadFile}
          onStar={(id) => toggleStar.mutate(id)}
        />
      )}
    </div>
  );
}
