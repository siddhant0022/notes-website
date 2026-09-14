import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Clock,
  Users,
  FileText,
  Check,
  X,
  Shield,
  ShieldOff,
} from 'lucide-react';
import { ProtectedRoute } from '../components/ui/ProtectedRoute';
import { ResourceGridSkeleton } from '../components/ui/Skeleton';
import {
  useAdminStats,
  usePendingResources,
  useModerateResource,
  useAdminUsers,
  useUpdateUser,
  useSubjects,
  useCreateSubject,
  useDeleteSubject,
} from '../hooks/useApi';

export function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const { data: statsData, isLoading: statsLoading } = useAdminStats();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'moderation', label: 'Moderation', badge: statsData?.stats?.pendingResources },
    { id: 'subjects', label: 'Subjects' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-sm text-slate-400">Manage resources, moderation, and users.</p>
      </div>

      <div className="flex gap-1 glass rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              tab === t.id ? 'bg-accent/20 text-accent' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab stats={statsData} isLoading={statsLoading} />}
      {tab === 'moderation' && <ModerationTab />}
      {tab === 'subjects' && <SubjectsTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  );
}

function OverviewTab({ stats, isLoading }) {
  if (isLoading) return <ResourceGridSkeleton count={4} />;

  const cards = [
    { label: 'Resources', value: stats?.stats?.totalResources, icon: FileText },
    { label: 'Pending', value: stats?.stats?.pendingResources, icon: Clock },
    { label: 'Users', value: stats?.stats?.totalUsers, icon: Users },
    { label: 'Downloads', value: stats?.stats?.totalDownloads, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5"
          >
            <c.icon className="w-5 h-5 text-accent mb-3" />
            <p className="font-display text-2xl font-bold">{c.value ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {stats?.recentUploads?.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {stats.recentUploads.map((r) => (
              <div key={r._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-slate-500">
                    {r.uploadedBy?.name} · {r.status}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ModerationTab() {
  const { data, isLoading } = usePendingResources();
  const moderate = useModerateResource();
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');

  if (isLoading) return <ResourceGridSkeleton count={3} />;

  if (!data?.resources?.length) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Moderation queue is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.resources.map((r) => (
        <div key={r._id} className="glass rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {r.type} · {r.branch} Sem {r.semester} · by {r.uploadedBy?.name}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => moderate.mutate({ id: r._id, action: 'approve' })}
                disabled={moderate.isPending}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
              >
                <Check className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => setRejectId(r._id)}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium flex items-center gap-1.5 hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>

          {rejectId === r._id && (
            <div className="mt-4 flex gap-2">
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection reason…"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
              />
              <button
                onClick={() => {
                  moderate.mutate({ id: r._id, action: 'reject', reason });
                  setRejectId(null);
                  setReason('');
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SubjectsTab() {
  const { data, isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const deleteSubject = useDeleteSubject();
  const [form, setForm] = useState({ name: '', code: '', branch: 'CSE', semester: '1' });
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    createSubject.mutate(
      { ...form, semester: Number(form.semester) },
      {
        onSuccess: () => {
          setForm({ name: '', code: '', branch: 'CSE', semester: '1' });
          setShowForm(false);
        },
      }
    );
  };

  if (isLoading) return <ResourceGridSkeleton count={4} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{data?.subjects?.length ?? 0} active subjects</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="glass rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <AdminInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <AdminInput label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} required />
          <AdminSelect
            label="Branch"
            value={form.branch}
            onChange={(v) => setForm({ ...form, branch: v })}
            options={data?.branches || []}
          />
          <AdminSelect
            label="Semester"
            value={form.semester}
            onChange={(v) => setForm({ ...form, semester: v })}
            options={(data?.semesters || []).map(String)}
          />
          <button
            type="submit"
            disabled={createSubject.isPending}
            className="sm:col-span-2 py-2.5 rounded-xl bg-accent text-white text-sm font-medium disabled:opacity-50"
          >
            {createSubject.isPending ? 'Creating…' : 'Create Subject'}
          </button>
        </motion.form>
      )}

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-slate-500">
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Branch</th>
              <th className="px-5 py-3 font-medium">Sem</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.subjects?.map((s) => (
              <tr key={s._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3 font-mono text-accent text-xs">{s.code}</td>
                <td className="px-5 py-3 font-medium">{s.name}</td>
                <td className="px-5 py-3 text-slate-400">{s.branch}</td>
                <td className="px-5 py-3 text-slate-400">{s.semester}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => deleteSubject.mutate(s._id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    title="Deactivate"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent/50"
      />
    </div>
  );
}

function AdminSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent/50"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-pitch-900">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function UsersTab() {
  const { data, isLoading } = useAdminUsers();
  const updateUser = useUpdateUser();

  if (isLoading) return <ResourceGridSkeleton count={5} />;

  return (
    <div className="glass rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs text-slate-500">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.map((u) => (
            <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="px-5 py-3 font-medium">{u.name}</td>
              <td className="px-5 py-3 text-slate-400">{u.email}</td>
              <td className="px-5 py-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    u.role === 'Admin'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td className="px-5 py-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    u.isActive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      updateUser.mutate({
                        id: u._id,
                        role: u.role === 'Admin' ? 'Student' : 'Admin',
                      })
                    }
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-accent"
                    title="Toggle role"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateUser.mutate({ id: u._id, isActive: !u.isActive })}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400"
                    title="Toggle active"
                  >
                    <ShieldOff className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    approved: 'bg-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-400',
    rejected: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${colors[status] || ''}`}>{status}</span>
  );
}
