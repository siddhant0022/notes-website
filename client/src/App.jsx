import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage, ViewerDemoPage } from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="viewer" element={<ViewerDemoPage />} />
        <Route path="upload" element={<PlaceholderPage title="Upload Resource" />} />
        <Route path="starred" element={<PlaceholderPage title="Starred Resources" />} />
        <Route path="login" element={<PlaceholderPage title="Sign In" />} />
        <Route path="admin" element={<PlaceholderPage title="Admin Dashboard" />} />
        <Route path="*" element={<PlaceholderPage title="404 — Not Found" />} />
      </Route>
    </Routes>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="font-display text-2xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-slate-500">Coming soon in the next sprint.</p>
    </div>
  );
}
