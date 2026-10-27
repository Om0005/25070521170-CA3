import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function PlayerBar() {
  const {
    currentTrack, isPlaying, currentTime, duration,
    togglePlay, playNext, playPrev, seek,
    volume, setVolume, isMuted, setIsMuted,
    isFavorite, toggleFavorite,
  } = usePlayer();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <footer style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '72px',
        background: 'rgba(250, 245, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        boxShadow: 'var(--shadow-player)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Music size={16} />
          <span>Select a track to start listening</span>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: '84px',
      background: 'rgba(250, 245, 255, 0.97)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1.5px solid var(--border-subtle)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 200,
      boxShadow: 'var(--shadow-player)',
    }}>
      {/* Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', width: '280px', minWidth: '220px' }}>
        {/* Album art with reactive glow */}
        <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
          {isPlaying && (
            <div style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              opacity: 0.4,
              animation: 'pulseRing 1.5s ease-in-out infinite',
              zIndex: 0,
            }} />
          )}
          <div style={{
            position: 'relative',
            width: '52px',
            height: '52px',
            borderRadius: '8px',
            overflow: 'hidden',
            zIndex: 1,
            boxShadow: isPlaying ? '0 4px 16px rgba(124, 58, 237, 0.4)' : '0 2px 8px rgba(124, 58, 237, 0.15)',
            transition: 'box-shadow 0.4s ease',
          }}>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: isPlaying ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.4s ease',
              }}
            />
            {isPlaying && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(124, 58, 237, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div className="equalizer-bars">
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div style={{
            fontSize: '0.88rem', fontWeight: 700,
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
            color: 'var(--text-main)',
          }}>
            {currentTrack.title}
          </div>
          <div style={{
            fontSize: '0.73rem', color: 'var(--text-secondary)',
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
            marginTop: '2px',
          }}>
            {currentTrack.artist} ·{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{currentTrack.genre}</span>
          </div>
        </div>

        <button
          onClick={() => toggleFavorite(currentTrack._id)}
          className="btn-icon"
          style={{ width: '32px', height: '32px', flexShrink: 0, color: isFavorite(currentTrack._id) ? '#db2777' : 'var(--text-muted)' }}
          title={isFavorite(currentTrack._id) ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart size={17} fill={isFavorite(currentTrack._id) ? '#db2777' : 'none'} />
        </button>
      </div>

      {/* Playback Controls + Scrubber */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0.4rem', flex: 1, maxWidth: '560px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button onClick={playPrev} className="btn-icon" title="Previous" style={{ width: '34px', height: '34px' }}>
            <SkipBack size={17} />
          </button>

          <button
            onClick={togglePlay}
            style={{
              width: '46px', height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(124, 58, 237, 0.45)',
              transition: 'transform 0.15s ease, box-shadow 0.2s ease',
              border: 'none',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause size={20} fill="#fff" />
              : <Play  size={20} fill="#fff" style={{ marginLeft: '2px' }} />
            }
          </button>

          <button onClick={playNext} className="btn-icon" title="Next" style={{ width: '34px', height: '34px' }}>
            <SkipForward size={17} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '36px', textAlign: 'right' }}>
            {formatTime(currentTime)}
          </span>
          <div style={{ flex: 1, position: 'relative', height: '6px', cursor: 'pointer' }}>
            {/* Track */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '3px',
              background: 'rgba(124, 58, 237, 0.12)',
            }} />
            {/* Fill */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: `${progressPercent}%`,
              borderRadius: '3px',
              background: 'linear-gradient(to right, #7c3aed, #db2777)',
              transition: 'width 0.1s linear',
            }} />
            <input
              type="range" min="0" max={duration || 180} step="0.5" value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer',
              }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '36px' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', width: '190px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="btn-icon"
          style={{ width: '32px', height: '32px' }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div style={{ position: 'relative', height: '5px', width: '90px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '3px',
            background: 'rgba(124, 58, 237, 0.12)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: `${(isMuted ? 0 : volume) * 100}%`,
            borderRadius: '3px',
            background: 'linear-gradient(to right, #7c3aed, #db2777)',
          }} />
          <input
            type="range" min="0" max="1" step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              opacity: 0, cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </footer>
  );
}
