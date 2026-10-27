import React from 'react';
import { Play, Pause, Heart, Edit3, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export function TrackCard({ track, onEdit, onDelete, trackList = [] }) {
  const { currentTrack, isPlaying, playTrack, isFavorite, toggleFavorite } = usePlayer();
  const isCurrentPlaying = currentTrack?._id === track._id && isPlaying;
  const isFav = isFavorite(track._id);

  return (
    <div
      className="glass-panel glass-panel-interactive"
      style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* Album art */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '100%',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: '0.85rem',
        background: 'linear-gradient(135deg, #e9d5ff, #fce7f3)',
      }}>
        <img
          src={track.coverUrl}
          alt={track.title}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Playing glow */}
        {isCurrentPlaying && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.45), rgba(219, 39, 119, 0.35))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className="equalizer-bars" style={{ height: '22px' }}>
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
            </div>
          </div>
        )}

        {/* Play button */}
        <button
          onClick={() => playTrack(track, trackList)}
          style={{
            position: 'absolute', right: '10px', bottom: '10px',
            width: '42px', height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.45)',
            transition: 'all 0.2s ease',
            transform: isCurrentPlaying ? 'scale(1.08)' : 'scale(1)',
            border: 'none',
          }}
          title={isCurrentPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentPlaying
            ? <Pause size={19} fill="#fff" />
            : <Play  size={19} fill="#fff" style={{ marginLeft: '2px' }} />
          }
        </button>

        {/* Favourite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track._id); }}
          style={{
            position: 'absolute', top: '9px', right: '9px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '50%',
            width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isFav ? '#db2777' : 'var(--text-muted)',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)',
            border: `1px solid ${isFav ? 'rgba(219, 39, 119, 0.3)' : 'transparent'}`,
            transition: 'all 0.2s ease',
          }}
          title={isFav ? 'Liked' : 'Like'}
        >
          <Heart size={14} fill={isFav ? '#db2777' : 'none'} />
        </button>
      </div>

      {/* Track info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: '0.92rem', fontWeight: 700,
            color: 'var(--text-main)',
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
            marginBottom: '0.2rem',
          }}>
            {track.title}
          </div>
          <div style={{
            fontSize: '0.78rem', color: 'var(--text-secondary)',
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
          }}>
            {track.artist}
          </div>
        </div>

        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '0.8rem', paddingTop: '0.6rem',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <span className="badge badge-primary" style={{ fontSize: '0.67rem', padding: '0.18rem 0.48rem' }}>
            {track.genre}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(track); }}
                className="btn-icon"
                style={{ width: '27px', height: '27px' }}
                title="Edit"
              >
                <Edit3 size={13} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(track); }}
                className="btn-icon"
                style={{ width: '27px', height: '27px', color: '#dc2626' }}
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
