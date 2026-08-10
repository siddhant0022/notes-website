import { ResourceBentoGrid } from '../components/resources/ResourceCard';
import { PdfViewer } from '../components/pdf/PdfViewer';

const SAMPLE_RESOURCES = [
  {
    _id: '1',
    title: 'Data Structures & Algorithms — Complete Unit Notes',
    description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, and sorting algorithms with solved examples.',
    type: 'Class Notes',
    branch: 'CSE',
    semester: 3,
    subject: { name: 'DSA' },
    fileUrl: '/sample.pdf',
    fileName: 'dsa-notes.pdf',
    fileSize: 2457600,
    downloadCount: 142,
    starCount: 38,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    _id: '2',
    title: 'Operating Systems — AKTU Previous Year Questions 2020-2025',
    description: 'Compiled PYQs with marking scheme hints.',
    type: 'AKTU PYQs',
    branch: 'CSE',
    semester: 4,
    subject: { name: 'OS' },
    fileUrl: '/sample.pdf',
    fileName: 'os-pyq.pdf',
    fileSize: 1843200,
    downloadCount: 89,
    starCount: 21,
    createdAt: '2026-02-28T14:30:00Z',
  },
  {
    _id: '3',
    title: 'Engineering Mathematics — Quantum Series',
    description: 'Most important questions for end-semester exams.',
    type: 'Quantums',
    branch: 'CSE',
    semester: 1,
    subject: { name: 'Maths-I' },
    fileUrl: '/sample.pdf',
    fileName: 'maths-quantum.pdf',
    fileSize: 983040,
    downloadCount: 256,
    starCount: 67,
    createdAt: '2026-02-25T09:15:00Z',
  },
  {
    _id: '4',
    title: 'DBMS Lab Manual — MySQL & MongoDB Experiments',
    description: 'All 10 lab experiments with screenshots and Viva questions.',
    type: 'Lab Manuals',
    branch: 'IT',
    semester: 5,
    subject: { name: 'DBMS' },
    fileUrl: '/sample.pdf',
    fileName: 'dbms-lab.pdf',
    fileSize: 3145728,
    downloadCount: 73,
    starCount: 19,
    createdAt: '2026-02-20T16:45:00Z',
  },
  {
    _id: '5',
    title: 'Computer Networks — Important Questions Unit 1-5',
    description: 'Short and long answer type questions for quick revision.',
    type: 'Important Questions',
    branch: 'CSE',
    semester: 6,
    subject: { name: 'CN' },
    fileUrl: '/sample.pdf',
    fileName: 'cn-imp-q.pdf',
    fileSize: 512000,
    downloadCount: 198,
    starCount: 45,
    createdAt: '2026-02-18T11:00:00Z',
  },
  {
    _id: '6',
    title: 'Digital Electronics — Class Notes Sem 2',
    description: 'Boolean algebra, K-maps, flip-flops, and sequential circuits.',
    type: 'Class Notes',
    branch: 'ECE',
    semester: 2,
    subject: { name: 'DE' },
    fileUrl: '/sample.pdf',
    fileName: 'de-notes.pdf',
    fileSize: 1572864,
    downloadCount: 54,
    starCount: 12,
    createdAt: '2026-02-15T08:20:00Z',
  },
];

export function HomePage() {
  return (
    <div className="space-y-10">
      {/* Asymmetric hero — NOT centered generic gradient */}
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
          {[
            { label: 'Resources', value: '1.2k+' },
            { label: 'Contributors', value: '340' },
            { label: 'Downloads', value: '18k' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl px-4 py-3 text-center min-w-[90px]">
              <p className="font-display text-xl font-bold text-accent">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter bar placeholder */}
      <div className="glass rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-slate-500 font-medium">Filters:</span>
        {['All Branches', 'All Semesters', 'All Types'].map((f) => (
          <button
            key={f}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:text-accent hover:bg-accent/10 border border-white/5 transition-colors"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold">Recent Resources</h2>
          <span className="text-xs text-slate-500">{SAMPLE_RESOURCES.length} results</span>
        </div>
        <ResourceBentoGrid
          resources={SAMPLE_RESOURCES}
          onView={(r) => console.log('View:', r.title)}
          onDownload={(r) => console.log('Download:', r.title)}
          onStar={(id, starred) => console.log('Star:', id, starred)}
        />
      </section>
    </div>
  );
}

export function ViewerDemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">PDF Viewer</h1>
        <p className="text-sm text-slate-400">Built-in document preview with navigation and zoom.</p>
      </div>
      <PdfViewer
        url="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
        fileName="sample-document.pdf"
      />
    </div>
  );
}
