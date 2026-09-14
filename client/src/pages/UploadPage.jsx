import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { useUploadResource, useSubjects } from '../hooks/useApi';
import { ProtectedRoute } from '../components/ui/ProtectedRoute';

const RESOURCE_TYPES = [
  'Class Notes',
  'AKTU PYQs',
  'Quantums',
  'Important Questions',
  'Lab Manuals',
];

export function UploadPage() {
  return (
    <ProtectedRoute>
      <UploadForm />
    </ProtectedRoute>
  );
}

function UploadForm() {
  const navigate = useNavigate();
  const upload = useUploadResource();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Class Notes',
    branch: '',
    semester: '',
    subject: '',
    tags: '',
  });

  const { data: subjectData } = useSubjects({
    branch: form.branch || undefined,
    semester: form.semester || undefined,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('file', file);
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'subject' && !v) return;
      fd.append(k, v);
    });

    upload.mutate(fd, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-1">Upload Resource</h1>
        <p className="text-sm text-slate-400">
          Share notes with the community. PDF only, max 20 MB.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-strong rounded-2xl p-6 space-y-5"
      >
        {/* File drop zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file ? 'border-accent/40 bg-accent/5' : 'border-white/10 hover:border-white/20'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files[0];
            if (dropped?.type === 'application/pdf') setFile(dropped);
          }}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">{file.name}</span>
              <button type="button" onClick={() => setFile(null)}>
                <X className="w-4 h-4 text-slate-500 hover:text-red-400" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                Drag & drop a PDF or{' '}
                <label className="text-accent cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              </p>
            </>
          )}
        </div>

        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Resource Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            options={RESOURCE_TYPES}
          />
          <Select
            label="Branch"
            value={form.branch}
            onChange={(v) => setForm({ ...form, branch: v, subject: '' })}
            options={subjectData?.branches || []}
            placeholder="Select branch"
            required
          />
          <Select
            label="Semester"
            value={form.semester}
            onChange={(v) => setForm({ ...form, semester: v, subject: '' })}
            options={(subjectData?.semesters || []).map(String)}
            placeholder="Select semester"
            required
          />
          <Select
            label="Subject (optional)"
            value={form.subject}
            onChange={(v) => setForm({ ...form, subject: v })}
            options={subjectData?.subjects?.map((s) => ({ value: s._id, label: `${s.code} — ${s.name}` })) || []}
            placeholder="Select subject"
          />
        </div>

        <Input label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!file || upload.isPending}
          className="w-full py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {upload.isPending ? 'Uploading…' : 'Upload Resource'}
        </motion.button>
      </motion.form>
    </div>
  );
}

function Input({ label, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent/50"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent/50 resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, required }) {
  const normalized = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent/50 appearance-none"
      >
        <option value="">{placeholder || 'Select…'}</option>
        {normalized.map((o) => (
          <option key={o.value} value={o.value} className="bg-pitch-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
