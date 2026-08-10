import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Download,
  Eye,
  FileText,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const TYPE_COLORS = {
  'Class Notes': 'from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/20',
  'AKTU PYQs': 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/20',
  'Quantums': 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20',
  'Important Questions': 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20',
  'Lab Manuals': 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/20',
};

const BENTO_VARIANTS = {
  default: 'col-span-1 row-span-1',
  featured: 'col-span-1 md:col-span-2 row-span-1',
  tall: 'col-span-1 row-span-1 md:row-span-2',
};

export function ResourceCard({
  resource,
  variant = 'default',
  onStar,
  onView,
  onDownload,
  isStarred = false,
  index = 0,
}) {
  const [starred, setStarred] = useState(isStarred);
  const typeStyle = TYPE_COLORS[resource.type] || TYPE_COLORS['Class Notes'];

  const handleStar = (e) => {
    e.stopPropagation();
    setStarred(!starred);
    onStar?.(resource._id, !starred);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={() => onView?.(resource)}
      className={`group relative glass rounded-2xl p-5 cursor-pointer overflow-hidden ${BENTO_VARIANTS[variant]}`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
      </div>

      {/* Top row */}
      <div className="relative flex items-start justify-between gap-3 mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border bg-gradient-to-r ${typeStyle}`}
        >
          <FileText className="w-3 h-3" />
          {resource.type}
        </span>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleStar}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            starred
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-white/5 text-slate-500 hover:text-amber-400'
          }`}
          aria-label={starred ? 'Unstar' : 'Star'}
        >
          <Star className={`w-4 h-4 ${starred ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="relative space-y-2 mb-5">
        <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>

      {/* Meta tags */}
      <div className="relative flex flex-wrap gap-1.5 mb-4">
        <Tag label={resource.branch} />
        <Tag label={`Sem ${resource.semester}`} />
        {resource.subject?.name && <Tag label={resource.subject.name} />}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(resource.createdAt)}
          </span>
          <span>{formatSize(resource.fileSize)}</span>
          {resource.downloadCount > 0 && (
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {resource.downloadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(resource);
            }}
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors"
            aria-label="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onView?.(resource);
            }}
            className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors"
            aria-label="View"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Featured variant accent */}
      {variant === 'featured' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      )}
    </motion.article>
  );
}

function Tag({ label }) {
  return (
    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-slate-400 border border-white/5">
      {label}
    </span>
  );
}

/**
 * Asymmetrical bento grid layout for resource cards.
 */
export function ResourceBentoGrid({ resources, onStar, onView, onDownload, starredIds = [] }) {
  const getVariant = (index, total) => {
    if (index === 0 && total > 3) return 'featured';
    if (index === 3 && total > 5) return 'tall';
    return 'default';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4">
      {resources.map((resource, i) => (
        <ResourceCard
          key={resource._id}
          resource={resource}
          variant={getVariant(i, resources.length)}
          index={i}
          onStar={onStar}
          onView={onView}
          onDownload={onDownload}
          isStarred={starredIds.includes(resource._id)}
        />
      ))}
    </div>
  );
}
