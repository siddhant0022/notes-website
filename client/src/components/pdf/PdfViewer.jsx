import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  Loader2,
  FileWarning,
} from 'lucide-react';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function PdfViewer({ url, fileName = 'document.pdf', onDownload }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scale = ZOOM_LEVELS[zoomIndex];

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    setLoading(false);
    setError(err?.message || 'Failed to load PDF');
  }, []);

  const goToPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goToNext = () => setPageNumber((p) => Math.min(numPages || 1, p + 1));
  const zoomIn = () => setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1));
  const zoomOut = () => setZoomIndex((i) => Math.max(0, i - 1));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById('pdf-viewer-container')?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return (
    <div
      id="pdf-viewer-container"
      className={`glass-strong rounded-2xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-[100] rounded-none' : ''
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-white/10 bg-pitch-900/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate text-slate-300">{fileName}</span>
          {numPages && (
            <span className="text-xs text-slate-500 shrink-0">
              {pageNumber} / {numPages}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Page Nav */}
          <ToolbarButton onClick={goToPrev} disabled={pageNumber <= 1} label="Previous page">
            <ChevronLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={goToNext} disabled={pageNumber >= (numPages || 1)} label="Next page">
            <ChevronRight className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Zoom */}
          <ToolbarButton onClick={zoomOut} disabled={zoomIndex <= 0} label="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </ToolbarButton>
          <span className="text-xs text-slate-400 w-10 text-center">{Math.round(scale * 100)}%</span>
          <ToolbarButton onClick={zoomIn} disabled={zoomIndex >= ZOOM_LEVELS.length - 1} label="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <ToolbarButton onClick={toggleFullscreen} label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </ToolbarButton>
          <ToolbarButton onClick={handleDownload} label="Download">
            <Download className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Viewer Canvas */}
      <div className="relative flex items-center justify-center min-h-[480px] max-h-[70vh] overflow-auto p-6 bg-pitch/80">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            >
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <span className="text-sm text-slate-400">Loading document…</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 text-center p-8"
            >
              <FileWarning className="w-10 h-10 text-red-400" />
              <p className="text-sm text-slate-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!error && (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="flex justify-center"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl"
            />
          </Document>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({ children, onClick, disabled, label }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
    >
      {children}
    </motion.button>
  );
}
