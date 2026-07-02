import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './features/auth/AuthGuard';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MeditationsPage from './pages/MeditationsPage';
import MeditationDetailPage from './pages/MeditationDetailPage';
import MusicLibraryPage from './pages/MusicLibraryPage';
import ProfilePage from './pages/ProfilePage';
import SessionPage from './pages/SessionPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedLayout() {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const router = (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<HomePage />} />
            <Route path="session/:id" element={<SessionPage />} />
            <Route path="meditations" element={<MeditationsPage />} />
            <Route path="meditations/:id" element={<MeditationDetailPage />} />
            <Route path="music" element={<MusicLibraryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );

  return googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{router}</GoogleOAuthProvider> : router;
}

export default App;
