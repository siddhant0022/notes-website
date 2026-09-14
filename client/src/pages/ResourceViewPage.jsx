import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Star, Clock, User } from 'lucide-react';
import { PdfViewer } from '../components/pdf/PdfViewer';
import { ResourceGridSkeleton } from '../components/ui/Skeleton';
import { useResource, useToggleStar, downloadFile } from '../hooks/useApi';
import { useAuthStore } from '../store';
import { getFileUrl } from '../utils/fileUrl';

export function ResourceViewPage() {
  const { id } = useParams();
  const { data: resource, isLoading, error } = useResource(id);
  const toggleStar = useToggleStar();
  const { user, isAuthenticated } = useAuthStore();

  if (isLoading) return <ResourceGridSkeleton count={1} />;

  if (error || !resource) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">Resource not found</p>
        <Link to="/" className="text-accent text-sm hover:underline">
          Back to browse
        </Link>
      </div>
    );
  }

  const isStarred = user?.starredResources?.includes(resource._id);
  const pdfUrl = getFileUrl(resource.fileUrl);

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to resources
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {resource.type}
            </span>
            <h1 className="font-display text-2xl font-bold">{resource.title}</h1>
            {resource.description && (
              <p className="text-sm text-slate-400 max-w-2xl">{resource.description}</p>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {resource.uploadedBy?.name || 'Unknown'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(resource.createdAt).toLocaleDateString('en-IN')}
              </span>
              <span>{resource.branch} · Sem {resource.semester}</span>
              {resource.subject?.name && <span>{resource.subject.name}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && (
              <button
                onClick={() => toggleStar.mutate(resource._id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                  isStarred
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                {isStarred ? 'Starred' : 'Star'}
              </button>
            )}
            <button
              onClick={() => downloadFile(resource)}
              className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        {resource.status === 'pending' && (
          <div className="mt-4 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
            This resource is pending admin approval.
          </div>
        )}
      </motion.div>

      <PdfViewer
        url={pdfUrl}
        fileName={resource.fileName}
        onDownload={() => downloadFile(resource)}
      />
    </div>
  );
}
