import React, { useState } from 'react';
import {
  Database, PlusCircle, Search, Edit3, Trash2, Play, Pause,
  Music, Table, LayoutGrid, TrendingUp, Layers, Clock, CheckCircle2,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const METHOD_COLORS = {
  GET:    { bg: 'rgba(5, 150, 105, 0.1)',   color: '#059669', border: 'rgba(5, 150, 105, 0.25)' },
  POST:   { bg: 'rgba(124, 58, 237, 0.1)',  color: '#7c3aed', border: 'rgba(124, 58, 237, 0.25)' },
  PUT:    { bg: 'rgba(217, 119, 6, 0.1)',   color: '#d97706', border: 'rgba(217, 119, 6, 0.25)' },
  DELETE: { bg: 'rgba(220, 38, 38, 0.1)',   color: '#dc2626', border: 'rgba(220, 38, 38, 0.25)' },
};

function MethodBadge({ method }) {
  const c = METHOD_COLORS[method];
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.18rem 0.5rem',
      borderRadius: '6px',
      fontSize: '0.68rem',
      fontWeight: 700,
      fontFamily: 'monospace',
      letterSpacing: '0.04em',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {method}
    </span>
  );
}

export function LibraryCrud({ tracks, onEdit, onDelete, onOpenCreateModal }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [filterGenre, setFilterGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table');

  const genres = ['All', ...new Set(tracks.map(t => t.genre))];

  const filteredTracks = tracks.filter(t => {
    const matchGenre = filterGenre === 'All' || t.genre.toLowerCase() === filterGenre.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase()) ||
      t.album.toLowerCase().includes(search.toLowerCase());
    return matchGenre && matchSearch;
  });

  const stats = [
    {
      label: 'Total Tracks',
      value: tracks.length,
      sub: 'In catalog',
      icon: <Music size={18} />,
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.1)',
    },
    {
      label: 'Genres',
      value: genres.length - 1,
      sub: 'Categories',
      icon: <Layers size={18} />,
      color: '#db2777',
      bg: 'rgba(219, 39, 119, 0.1)',
    },
    {
      label: 'API Endpoints',
      value: '4 / 4',
      sub: 'GET, POST, PUT, DELETE',
      icon: <CheckCircle2 size={18} />,
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.1)',
    },
    {
      label: 'Showing',
      value: filteredTracks.length,
      sub: 'Matching filter',
      icon: <TrendingUp size={18} />,
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.1)',
    },
  ];

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '0.3rem',
          }}>
            Track Studio
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.55 }}>
            Manage your full audio catalog with Create, Read, Update & Delete operations backed by a live REST API.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', flexShrink: 0 }}
        >
          <PlusCircle size={17} />
          <span>Add New Track</span>
        </button>
      </div>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-panel"
            style={{ padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: s.bg,
              color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{
                fontSize: '1.65rem', fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: s.color, lineHeight: 1,
                marginBottom: '0.2rem',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search / Filter / View Toggle Bar ───────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.85rem',
        flexWrap: 'wrap', marginBottom: '1.5rem',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{
            position: 'absolute', left: '13px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search by title, artist or album…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-md)' }}
          />
        </div>

        {/* Genre filter */}
        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="input-field"
          style={{ width: '160px', height: '42px', cursor: 'pointer', borderRadius: 'var(--radius-md)' }}
        >
          {genres.map(g => (
            <option key={g} value={g} style={{ background: '#fff', color: 'var(--text-main)' }}>
              {g}
            </option>
          ))}
        </select>

        {/* View mode toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(124, 58, 237, 0.07)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
          border: '1px solid var(--border-subtle)',
        }}>
          {[
            { mode: 'table', Icon: Table,      label: 'Table View'  },
            { mode: 'grid',  Icon: LayoutGrid, label: 'Grid View'   },
          ].map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              style={{
                width: '36px', height: '36px',
                borderRadius: 'calc(var(--radius-md) - 3px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: 'none',
                background: viewMode === mode
                  ? 'linear-gradient(135deg, #7c3aed, #db2777)'
                  : 'transparent',
                color: viewMode === mode ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
                boxShadow: viewMode === mode ? '0 2px 8px rgba(124,58,237,0.3)' : 'none',
              }}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty State ──────────────────────────────────── */}
      {filteredTracks.length === 0 && (
        <div style={{
          background: 'rgba(124, 58, 237, 0.04)',
          border: '1.5px dashed var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
        }}>
          <Music size={38} style={{ color: 'var(--text-muted)', marginBottom: '0.85rem' }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>No tracks match your filter</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Try a different search term or genre, or add a new track.
          </p>
          <button onClick={onOpenCreateModal} className="btn btn-primary">
            <PlusCircle size={16} /> Add Track
          </button>
        </div>
      )}

      {/* ── TABLE VIEW ──────────────────────────────────── */}
      {viewMode === 'table' && filteredTracks.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(219,39,119,0.05))',
                  borderBottom: '1.5px solid var(--border-subtle)',
                }}>
                  {['Track', 'Artist', 'Album', 'Genre', 'Duration', 'Actions'].map((h, i) => (
                    <th key={h} style={{
                      padding: '0.9rem 1.2rem',
                      textAlign: i === 5 ? 'right' : 'left',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track, idx) => {
                  const isCurrentPlaying = currentTrack?._id === track._id && isPlaying;
                  const isActive = currentTrack?._id === track._id;
                  return (
                    <tr
                      key={track._id}
                      style={{
                        borderBottom: idx < filteredTracks.length - 1
                          ? '1px solid var(--border-subtle)'
                          : 'none',
                        background: isActive
                          ? 'linear-gradient(90deg, rgba(124,58,237,0.06), rgba(219,39,119,0.04))'
                          : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'rgba(124,58,237,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {/* Track */}
                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          {/* Album art / play button */}
                          <button
                            onClick={() => playTrack(track, tracks)}
                            style={{
                              width: '40px', height: '40px',
                              borderRadius: '8px',
                              position: 'relative', overflow: 'hidden',
                              flexShrink: 0, cursor: 'pointer',
                              border: isActive ? '2px solid #7c3aed' : '2px solid transparent',
                              transition: 'border-color 0.2s ease',
                              boxShadow: isActive ? '0 2px 10px rgba(124,58,237,0.3)' : 'none',
                            }}
                          >
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: isCurrentPlaying
                                ? 'linear-gradient(135deg, rgba(124,58,237,0.55), rgba(219,39,119,0.45))'
                                : 'rgba(0,0,0,0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff',
                            }}>
                              {isCurrentPlaying
                                ? <div className="equalizer-bars" style={{ height: '14px', gap: '2px' }}>
                                    <div className="equalizer-bar" style={{ width: '2px' }} />
                                    <div className="equalizer-bar" style={{ width: '2px' }} />
                                    <div className="equalizer-bar" style={{ width: '2px' }} />
                                  </div>
                                : <Play size={13} fill="#fff" style={{ marginLeft: '1px' }} />
                              }
                            </div>
                          </button>

                          <div style={{ overflow: 'hidden' }}>
                            <div style={{
                              fontWeight: 700,
                              color: isActive ? 'var(--primary)' : 'var(--text-main)',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              maxWidth: '180px',
                              transition: 'color 0.15s',
                            }}>
                              {track.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                              {track._id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Artist */}
                      <td style={{ padding: '0.9rem 1.2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {track.artist}
                      </td>

                      {/* Album */}
                      <td style={{ padding: '0.9rem 1.2rem', color: 'var(--text-muted)' }}>
                        {track.album || 'Single'}
                      </td>

                      {/* Genre */}
                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                          {track.genre}
                        </span>
                      </td>

                      {/* Duration */}
                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                          <Clock size={13} />
                          <span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{track.duration}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => onEdit(track)}
                            title="Edit (PUT)"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                              padding: '0.35rem 0.7rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem', fontWeight: 600,
                              background: 'rgba(124, 58, 237, 0.08)',
                              color: 'var(--primary)',
                              border: '1px solid rgba(124, 58, 237, 0.2)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.16)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
                          >
                            <Edit3 size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(track)}
                            title="Delete (DELETE)"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                              padding: '0.35rem 0.7rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem', fontWeight: 600,
                              background: 'rgba(220, 38, 38, 0.07)',
                              color: '#dc2626',
                              border: '1px solid rgba(220, 38, 38, 0.18)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,38,38,0.14)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(220,38,38,0.07)'}
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GRID VIEW ───────────────────────────────────── */}
      {viewMode === 'grid' && filteredTracks.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.1rem',
        }}>
          {filteredTracks.map(track => {
            const isCurrentPlaying = currentTrack?._id === track._id && isPlaying;
            const isActive = currentTrack?._id === track._id;
            return (
              <div
                key={track._id}
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(16px)',
                  border: isActive
                    ? '1.5px solid rgba(124,58,237,0.4)'
                    : '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: isActive
                    ? '0 6px 24px rgba(124,58,237,0.2)'
                    : 'var(--shadow-card)',
                  transition: 'all var(--transition-normal)',
                }}
              >
                {/* Cover */}
                <div style={{ position: 'relative', height: '160px' }}>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isCurrentPlaying && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(219,39,119,0.4))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div className="equalizer-bars" style={{ height: '20px' }}>
                        <div className="equalizer-bar" />
                        <div className="equalizer-bar" />
                        <div className="equalizer-bar" />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => playTrack(track, tracks)}
                    style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                      color: '#fff', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 3px 12px rgba(124,58,237,0.4)',
                    }}
                  >
                    {isCurrentPlaying
                      ? <Pause size={15} fill="#fff" />
                      : <Play  size={15} fill="#fff" style={{ marginLeft: '1px' }} />
                    }
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: '0.9rem' }}>
                  <div style={{
                    fontWeight: 700, fontSize: '0.9rem',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: '0.2rem',
                  }}>
                    {track.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {track.artist}
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                      {track.genre}
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        onClick={() => onEdit(track)}
                        className="btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Edit"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(track)}
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', color: '#dc2626' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── API Reference Footer ─────────────────────────── */}
      <div style={{
        marginTop: '2rem',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '1rem',
        }}>
          <Database size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
            REST API Endpoints
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
          {[
            { method: 'GET',    path: '/api/tracks',     desc: 'List all tracks'   },
            { method: 'POST',   path: '/api/tracks',     desc: 'Create new track'  },
            { method: 'PUT',    path: '/api/tracks/:id', desc: 'Update a track'    },
            { method: 'DELETE', path: '/api/tracks/:id', desc: 'Remove a track'    },
          ].map(({ method, path, desc }) => (
            <div key={method} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.55rem 0.75rem',
              background: 'rgba(124, 58, 237, 0.04)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}>
              <MethodBadge method={method} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'var(--text-secondary)', flex: 1 }}>
                {path}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
