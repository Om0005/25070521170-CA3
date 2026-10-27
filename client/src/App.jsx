import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/PlayerBar';
import { TrackModal } from './components/TrackModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import { Discover } from './pages/Discover';
import { LibraryCrud } from './pages/LibraryCrud';
import { Favorites } from './pages/Favorites';
import { AuthPage } from './pages/AuthPage';
import { fetchTracks, createTrack, updateTrack, deleteTrack } from './api/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Genre → orb colour mappings for music-reactive background
const GENRE_COLORS = {
  'Synthwave':  ['rgba(124, 58, 237, 0.22)', 'rgba(236, 72, 153, 0.16)', 'rgba(168, 85, 247, 0.12)'],
  'Lo-Fi':      ['rgba(99, 102, 241, 0.18)',  'rgba(192, 132, 252, 0.14)', 'rgba(167, 139, 250, 0.1)'],
  'Electronic': ['rgba(139, 92, 246, 0.22)',  'rgba(219, 39, 119, 0.18)', 'rgba(109, 40, 217, 0.12)'],
  'Acoustic':   ['rgba(167, 139, 250, 0.16)', 'rgba(245, 208, 254, 0.2)', 'rgba(196, 181, 253, 0.12)'],
  'Ambient':    ['rgba(196, 181, 253, 0.2)',  'rgba(232, 121, 249, 0.14)', 'rgba(167, 139, 250, 0.1)'],
  'Funk / Pop': ['rgba(219, 39, 119, 0.2)',   'rgba(124, 58, 237, 0.16)', 'rgba(244, 114, 182, 0.14)'],
  'default':    ['rgba(124, 58, 237, 0.18)',  'rgba(219, 39, 119, 0.14)', 'rgba(168, 85, 247, 0.1)'],
};

function MusicReactiveBg() {
  const { currentTrack, isPlaying } = usePlayer();
  const bgRef = useRef(null);

  useEffect(() => {
    if (!bgRef.current) return;
    const genre = currentTrack?.genre || 'default';
    const colors = GENRE_COLORS[genre] || GENRE_COLORS['default'];
    bgRef.current.style.setProperty('--orb1-color', colors[0]);
    bgRef.current.style.setProperty('--orb2-color', colors[1]);
    bgRef.current.style.setProperty('--orb3-color', colors[2]);
  }, [currentTrack]);

  return (
    <div
      ref={bgRef}
      className={`app-bg${isPlaying ? ' playing' : ''}`}
      style={{
        '--orb1-color': 'rgba(124, 58, 237, 0.18)',
        '--orb2-color': 'rgba(219, 39, 119, 0.14)',
        '--orb3-color': 'rgba(168, 85, 247, 0.1)',
      }}
    />
  );
}

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('discover');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState(null);
  const [trackToDelete, setTrackToDelete] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const loadTracks = async () => {
    setLoading(true);
    try {
      const res = await fetchTracks(selectedGenre === 'All' ? '' : selectedGenre, searchQuery);
      setTracks(res.data);
    } catch {
      addToast('Failed to load tracks from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadTracks();
  }, [selectedGenre, searchQuery, isAuthenticated]);

  const handleSaveTrack = async (formData, editId) => {
    try {
      if (editId) {
        const res = await updateTrack(editId, formData);
        setTracks(prev => prev.map(t => (t._id === editId ? { ...t, ...res.data } : t)));
        addToast(`"${formData.title}" updated successfully`);
      } else {
        const res = await createTrack(formData);
        setTracks(prev => [res.data, ...prev]);
        addToast(`"${formData.title}" added to library`);
      }
    } catch (err) {
      addToast(err.message || 'Error occurred while saving', 'error');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!trackToDelete) return;
    try {
      await deleteTrack(trackToDelete._id);
      setTracks(prev => prev.filter(t => t._id !== trackToDelete._id));
      addToast(`"${trackToDelete.title}" removed from library`);
      setTrackToDelete(null);
    } catch (err) {
      addToast(err.message || 'Error deleting track', 'error');
    }
  };

  const Toasts = () => (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#dc2626" />
            : <CheckCircle2 size={18} color="#7c3aed" />
          }
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <>
        <MusicReactiveBg />
        <AuthPage onLoginSuccess={() => addToast('Welcome back! 🎵')} />
        <Toasts />
      </>
    );
  }

  return (
    <div className="app-container">
      <MusicReactiveBg />

      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenCreateModal={() => { setTrackToEdit(null); setIsCreateModalOpen(true); }}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      <div className="main-content-wrapper">
        <Navbar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
        />

        <main className="page-scroll-area">
          {currentView === 'discover' && (
            <Discover
              tracks={tracks}
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              searchQuery={searchQuery}
              onEdit={(t) => { setTrackToEdit(t); setIsCreateModalOpen(true); }}
              onDelete={(t) => setTrackToDelete(t)}
              onOpenCreateModal={() => { setTrackToEdit(null); setIsCreateModalOpen(true); }}
            />
          )}

          {currentView === 'crud' && (
            <LibraryCrud
              tracks={tracks}
              onEdit={(t) => { setTrackToEdit(t); setIsCreateModalOpen(true); }}
              onDelete={(t) => setTrackToDelete(t)}
              onOpenCreateModal={() => { setTrackToEdit(null); setIsCreateModalOpen(true); }}
            />
          )}

          {currentView === 'favorites' && (
            <Favorites
              tracks={tracks}
              onEdit={(t) => { setTrackToEdit(t); setIsCreateModalOpen(true); }}
              onDelete={(t) => setTrackToDelete(t)}
              onOpenCreateModal={() => { setTrackToEdit(null); setIsCreateModalOpen(true); }}
              onNavigate={setCurrentView}
            />
          )}
        </main>
      </div>

      <PlayerBar />

      <TrackModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setTrackToEdit(null); }}
        onSave={handleSaveTrack}
        trackToEdit={trackToEdit}
      />

      <DeleteConfirmModal
        isOpen={Boolean(trackToDelete)}
        onClose={() => setTrackToDelete(null)}
        onConfirm={handleConfirmDelete}
        track={trackToDelete}
      />

      <ProjectInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <MainApp />
      </PlayerProvider>
    </AuthProvider>
  );
}
