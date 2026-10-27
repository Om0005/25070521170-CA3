import React from 'react';
import { Play, Pause, Music, Sparkles, Disc, TrendingUp, Flame } from 'lucide-react';
import { TrackCard } from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';

const GENRES = ['All', 'Synthwave', 'Lo-Fi', 'Electronic', 'Acoustic', 'Ambient', 'Funk / Pop'];

export function Discover({ tracks, selectedGenre, onSelectGenre, searchQuery, onEdit, onDelete, onOpenCreateModal }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const featuredTrack = tracks.find(t => t.featured) || tracks[0];

  return (
    <div>
      {/* Hero Banner */}
      {featuredTrack && !searchQuery && (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '2.5rem',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2.5rem',
          boxShadow: '0 20px 50px -12px rgba(124, 58, 237, 0.3)',
        }}>
          {/* Blurred background image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${featuredTrack.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.28) saturate(1.3)',
            transform: 'scale(1.06)',
          }} />
          {/* Gradient overlay (violet-pink) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.92) 0%, rgba(124, 58, 237, 0.7) 40%, rgba(219, 39, 119, 0.5) 100%)',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '620px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '0.22rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                <Flame size={12} />
                Featured Spotlight
              </span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>· {featuredTrack.genre}</span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', color: '#ffffff' }}>
              {featuredTrack.title}
            </h1>

            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem' }}>
              By <strong style={{ color: '#fff' }}>{featuredTrack.artist}</strong> · {featuredTrack.album} · {featuredTrack.duration}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                onClick={() => playTrack(featuredTrack, tracks)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.8rem 1.6rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#ffffff',
                  color: '#7c3aed',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {currentTrack?._id === featuredTrack._id && isPlaying
                  ? <><Pause size={17} fill="#7c3aed" /> Pause</>
                  : <><Play  size={17} fill="#7c3aed" style={{ marginLeft: '1px' }} /> Play Now</>
                }
              </button>

              <button
                onClick={onOpenCreateModal}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.8rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <Disc size={17} />
                Upload Track
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Genre filter pills */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          overflowX: 'auto', paddingBottom: '0.4rem',
        }}>
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => onSelectGenre(g)}
              style={{
                padding: '0.48rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: 'none',
                transition: 'all var(--transition-fast)',
                background: selectedGenre === g
                  ? 'linear-gradient(135deg, #7c3aed, #db2777)'
                  : 'rgba(124, 58, 237, 0.07)',
                color: selectedGenre === g ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: selectedGenre === g ? '0 4px 14px rgba(124, 58, 237, 0.35)' : 'none',
                outline: selectedGenre === g ? 'none' : '1px solid var(--border-subtle)',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <TrendingUp size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedGenre === 'All' ? 'Popular & Trending' : `${selectedGenre} Collection`}
          </h2>
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
        </span>
      </div>

      {/* Tracks grid */}
      {tracks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '1.25rem',
        }}>
          {tracks.map(track => (
            <TrackCard
              key={track._id}
              track={track}
              onEdit={onEdit}
              onDelete={onDelete}
              trackList={tracks}
            />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(124, 58, 237, 0.04)',
          border: '1.5px dashed var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}>
          <Music size={42} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No tracks found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Adjust your search or add a new track to the library.
          </p>
          <button onClick={onOpenCreateModal} className="btn btn-primary">
            Add Your First Track
          </button>
        </div>
      )}
    </div>
  );
}
