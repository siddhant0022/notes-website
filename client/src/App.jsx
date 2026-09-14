import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthInit } from './components/auth/AuthInit';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { UploadPage } from './pages/UploadPage';
import { StarredPage } from './pages/StarredPage';
import { ResourceViewPage } from './pages/ResourceViewPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { GuidelinesPage } from './pages/GuidelinesPage';

export default function App() {
  return (
    <AuthInit>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="resources/:id" element={<ResourceViewPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="starred" element={<StarredPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="guidelines" element={<GuidelinesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthInit>
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="font-display text-6xl font-bold text-accent mb-2">404</h1>
      <p className="text-slate-400 text-sm">This page doesn't exist.</p>
    </div>
  );
}
