import React, { useState, useMemo } from 'react';
import {
  Heart, Play, Pause, Shuffle, Search, Sparkles, Clock, Music,
  LayoutGrid, Table, CheckCircle2, Trash2, Edit3, PlusCircle, X,
  Disc, Flame, Compass, Volume2
} from 'lucide-react';
import { TrackCard } from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';

export function Favorites({ tracks = [], onEdit, onDelete, onOpenCreateModal, onNavigate }) {
  const { currentTrack, isPlaying, playTrack, favorites, toggleFavorite } = usePlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [hoveredRow, setHoveredRow] = useState(null);

  // All tracks currently marked as favorite
  const likedTracks = useMemo(() => {
    return tracks.filter((t) => favorites.includes(t._id));
  }, [tracks, favorites]);

  // Non-favorite tracks to suggest when empty or below
  const suggestedTracks = useMemo(() => {
    return tracks.filter((t) => !favorites.includes(t._id)).slice(0, 3);
  }, [tracks, favorites]);

  // Unique genres present in liked tracks
  const availableGenres = useMemo(() => {
    const set = new Set();
    likedTracks.forEach((t) => { if (t.genre) set.add(t.genre); });
    return ['All', ...Array.from(set)];
  }, [likedTracks]);

  // Filtered by search and genre
  const filteredTracks = useMemo(() => {
    return likedTracks.filter((track) => {
      const matchGenre = selectedGenre === 'All' || track.genre === selectedGenre;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        track.title?.toLowerCase().includes(q) ||
        track.artist?.toLowerCase().includes(q) ||
        track.album?.toLowerCase().includes(q);
      return matchGenre && matchSearch;
    });
  }, [likedTracks, selectedGenre, searchQuery]);

  // Total listening time
  const totalDurationSec = useMemo(() => {
    return likedTracks.reduce((acc, t) => acc + (t.durationSec || 215), 0);
  }, [likedTracks]);

  const totalDurationStr = useMemo(() => {
    const mins = Math.floor(totalDurationSec / 60);
    const secs = totalDurationSec % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs} hr ${remMins} min`;
    }
    return `${mins} min ${secs > 0 ? `${secs}s` : ''}`;
  }, [totalDurationSec]);

  // Top genre in favorites
  const topGenre = useMemo(() => {
    if (likedTracks.length === 0) return 'None';
    const counts = {};
    likedTracks.forEach((t) => {
      counts[t.genre] = (counts[t.genre] || 0) + 1;
    });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'Eclectic';
  }, [likedTracks]);

  // Play entire favorites list
  const handlePlayAll = () => {
    if (filteredTracks.length > 0) {
      playTrack(filteredTracks[0], filteredTracks);
    } else if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  // Shuffle play favorites
  const handleShufflePlay = () => {
    const pool = filteredTracks.length > 0 ? filteredTracks : likedTracks;
    if (pool.length === 0) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.14) 0%, rgba(124, 58, 237, 0.11) 50%, rgba(244, 63, 94, 0.08) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(236, 72, 153, 0.28)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem',
        boxShadow: '0 16px 40px -12px rgba(219, 39, 119, 0.18), 0 4px 16px rgba(124, 58, 237, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '2.25rem',
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient background glow orb */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Big Heart Artwork */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 16px 36px -6px rgba(236, 72, 153, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.35) inset',
          flexShrink: 0,
        }}>
          <Heart
            size={56}
            fill="#fff"
            color="#fff"
            style={{
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))',
              animation: isPlaying ? 'pulseRing 1.8s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* Details & Info */}
        <div style={{ flex: 1, minWidth: '260px', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#db2777',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Sparkles size={12} /> Curated Playlist
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              PRN: 25070521179
            </span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #db2777 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.4rem',
            lineHeight: 1.15,
          }}>
            Liked Tracks
          </h1>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            maxWidth: '560px',
            lineHeight: 1.5,
          }}>
            Your personal archive of heavy-rotation anthems and saved tracks. Fully synced across your session with instant one-click playback.
          </p>

          {/* Metadata pill list */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-main)',
            fontWeight: 500,
            flexWrap: 'wrap',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Music size={14} color="var(--primary)" />
              <strong>{likedTracks.length}</strong> {likedTracks.length === 1 ? 'track' : 'tracks'}
            </span>
            {likedTracks.length > 0 && (
              <>
                <span style={{ color: 'var(--border-strong)' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="#d97706" />
                  {totalDurationStr}
                </span>
                <span style={{ color: 'var(--border-strong)' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Flame size={14} color="#ec4899" />
                  Top: <strong>{topGenre}</strong>
                </span>
              </>
            )}
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 600 }}>
              <CheckCircle2 size={13} /> Auto-Saved
            </span>
          </div>

          {/* Hero Action Buttons */}
          {likedTracks.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginTop: '1.4rem',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handlePlayAll}
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.92rem',
                  boxShadow: '0 8px 24px rgba(219, 39, 119, 0.35)',
                }}
              >
                <Play size={16} fill="#fff" />
                <span>Play All Favorites</span>
              </button>

              <button
                onClick={handleShufflePlay}
                className="btn btn-ghost"
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1.5px solid rgba(124, 58, 237, 0.25)',
                  padding: '0.75rem 1.3rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                }}
              >
                <Shuffle size={16} color="var(--primary)" />
                <span>Shuffle Play</span>
              </button>

              {onOpenCreateModal && (
                <button
                  onClick={onOpenCreateModal}
                  className="btn btn-ghost"
                  style={{
                    background: 'rgba(255, 255, 255, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.75rem 1.1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <PlusCircle size={15} />
                  <span>Add Track</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>


      {/* ── Filter & Search Toolbar (when tracks > 0) ────────────── */}
      {likedTracks.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.9rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Search in favorites */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '240px',
            flex: '1 1 240px',
            maxWidth: '380px',
          }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search in liked tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{
                paddingLeft: '2.4rem',
                paddingRight: searchQuery ? '2rem' : '1rem',
                fontSize: '0.85rem',
                background: '#fff',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Genre filter chips */}
          {availableGenres.length > 2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {availableGenres.map((g) => {
                const count = g === 'All' ? likedTracks.length : likedTracks.filter(t => t.genre === g).length;
                const isSelected = selectedGenre === g;
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(219, 39, 119, 0.12))'
                        : '#fff',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{g}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      opacity: 0.8,
                      background: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              style={{
                width: '32px', height: '32px',
                background: viewMode === 'grid' ? '#fff' : 'transparent',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
              }}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              style={{
                width: '32px', height: '32px',
                background: viewMode === 'table' ? '#fff' : 'transparent',
                color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
              }}
              title="Playlist View"
            >
              <Table size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Content View (Grid or Playlist Table) ─────────────────── */}
      {likedTracks.length > 0 ? (
        filteredTracks.length > 0 ? (
          viewMode === 'grid' ? (
            /* ── Grid View ── */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredTracks.map((track) => (
                <TrackCard
                  key={track._id}
                  track={track}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  trackList={filteredTracks}
                />
              ))}
            </div>
          ) : (
            /* ── Playlist / Table View ── */
            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '44px 2.2fr 1.2fr 90px 48px 84px',
                padding: '0.85rem 1.25rem',
                borderBottom: '1.5px solid var(--border-subtle)',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(219, 39, 119, 0.03))',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                alignItems: 'center',
              }}>
                <div style={{ textAlign: 'center' }}>#</div>
                <div>Title</div>
                <div>Genre & Album</div>
                <div style={{ textAlign: 'right' }}>Time</div>
                <div style={{ textAlign: 'center' }}>Saved</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>

              {/* Table Rows */}
              <div>
                {filteredTracks.map((track, idx) => {
                  const isCurrentPlaying = currentTrack?._id === track._id && isPlaying;
                  const isCurrentTrack = currentTrack?._id === track._id;
                  const isRowHovered = hoveredRow === track._id;

                  return (
                    <div
                      key={track._id}
                      onMouseEnter={() => setHoveredRow(track._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '44px 2.2fr 1.2fr 90px 48px 84px',
                        padding: '0.75rem 1.25rem',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isCurrentTrack
                          ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(219, 39, 119, 0.06))'
                          : isRowHovered
                          ? 'rgba(124, 58, 237, 0.03)'
                          : 'transparent',
                        transition: 'background var(--transition-fast)',
                        position: 'relative',
                      }}
                    >
                      {/* Left highlight strip if active */}
                      {isCurrentTrack && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: '15%',
                          bottom: '15%',
                          width: '3.5px',
                          background: 'linear-gradient(180deg, var(--primary), var(--secondary))',
                          borderRadius: '0 4px 4px 0',
                        }} />
                      )}

                      {/* Number / Play / Equalizer */}
                      <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isCurrentPlaying ? (
                          <div className="equalizer-bars" style={{ height: '16px' }}>
                            <div className="equalizer-bar" />
                            <div className="equalizer-bar" />
                            <div className="equalizer-bar" />
                          </div>
                        ) : isRowHovered ? (
                          <button
                            onClick={() => playTrack(track, filteredTracks)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                            }}
                          >
                            <Play size={15} fill="var(--primary)" />
                          </button>
                        ) : (
                          <span style={{
                            fontSize: '0.8rem',
                            color: isCurrentTrack ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: isCurrentTrack ? 700 : 500,
                          }}>
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Title & Artist & Artwork Thumbnail */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                        <div style={{
                          position: 'relative',
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: 'var(--bg-subtle)',
                          boxShadow: 'var(--shadow-sm)',
                        }}>
                          <img
                            src={track.coverUrl}
                            alt={track.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {isCurrentPlaying && (
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'rgba(124, 58, 237, 0.4)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Volume2 size={14} color="#fff" />
                            </div>
                          )}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            color: isCurrentTrack ? 'var(--primary)' : 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {track.title}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {track.artist}
                          </div>
                        </div>
                      </div>

                      {/* Genre & Album */}
                      <div style={{ minWidth: 0 }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                          {track.genre || 'Music'}
                        </span>
                        {track.album && (
                          <div style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '2px',
                          }}>
                            {track.album}
                          </div>
                        )}
                      </div>

                      {/* Duration */}
                      <div style={{
                        textAlign: 'right',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        color: 'var(--text-muted)',
                      }}>
                        {track.duration || '3:30'}
                      </div>

                      {/* Saved Heart Toggle */}
                      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                        <button
                          onClick={() => toggleFavorite(track._id)}
                          style={{
                            background: 'rgba(236, 72, 153, 0.1)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#db2777',
                            transition: 'all var(--transition-fast)',
                          }}
                          title="Remove from favorites"
                        >
                          <Heart size={13} fill="#db2777" />
                        </button>
                      </div>

                      {/* Actions (Edit / Delete) */}
                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(track)}
                            className="btn-icon"
                            style={{ width: '28px', height: '28px' }}
                            title="Edit Track"
                          >
                            <Edit3 size={13} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(track)}
                            className="btn-icon"
                            style={{ width: '28px', height: '28px', color: '#dc2626' }}
                            title="Delete Track"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          /* Search gave 0 matches */
          <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <Search size={36} color="var(--text-muted)" style={{ marginBottom: '0.8rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              No matches found
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              No tracks in your liked list match "{searchQuery}".
            </p>
            <button onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }} className="btn btn-primary">
              Clear Search Filter
            </button>
          </div>
        )
      ) : (
        /* ── Gorgeous Empty State (when 0 favorites) ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Ambient orb behind heart */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Glowing Heart Container */}
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(124, 58, 237, 0.15))',
              border: '1.5px solid rgba(236, 72, 153, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              boxShadow: '0 12px 30px rgba(236, 72, 153, 0.2)',
            }}>
              <Heart size={42} color="#db2777" />
            </div>

            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>
              Your Favorites Library is Waiting
            </h2>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              margin: '0 auto 1.75rem auto',
              lineHeight: 1.6,
            }}>
              Discover music across Synthwave, Lo-Fi, Electronic and more. Click the heart icon on any track to save it here for instant one-click streaming.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('discover')}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.6rem', fontSize: '0.92rem' }}
                >
                  <Compass size={17} />
                  <span>Discover Music</span>
                </button>
              )}

              {onOpenCreateModal && (
                <button
                  onClick={onOpenCreateModal}
                  className="btn btn-ghost"
                  style={{
                    background: '#fff',
                    border: '1.5px solid var(--border-subtle)',
                    padding: '0.75rem 1.4rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <PlusCircle size={16} />
                  <span>Add New Track</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick suggestions to like right now */}
          {suggestedTracks.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}>
                <Flame size={16} color="#db2777" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Recommended to start your playlist
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
              }}>
                {suggestedTracks.map((t) => (
                  <div
                    key={t._id}
                    className="glass-panel"
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem',
                      transition: 'transform var(--transition-fast)',
                    }}
                  >
                    <img
                      src={t.coverUrl}
                      alt={t.title}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {t.title}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {t.artist} · {t.genre}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(t._id)}
                      className="btn btn-primary"
                      style={{
                        padding: '0.45rem 0.8rem',
                        fontSize: '0.76rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        flexShrink: 0,
                      }}
                    >
                      <Heart size={13} fill="#fff" />
                      <span>Like</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
