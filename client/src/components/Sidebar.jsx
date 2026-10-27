import React from 'react';
import { Compass, Music2, Heart, PlusCircle, Award, Database, Layers } from 'lucide-react';

export function Sidebar({ currentView, onChangeView, onOpenCreateModal, onOpenInfoModal }) {
  const navItems = [
    { id: 'discover', label: 'Discover & Stream', icon: Compass },
    { id: 'crud',     label: 'Track Studio',       icon: Database, badge: 'CRUD' },
    { id: 'favorites', label: 'Liked Tracks',      icon: Heart },
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1.25rem',
      zIndex: 90,
      boxShadow: '2px 0 20px rgba(124, 58, 237, 0.06)',
      position: 'relative',
    }}>
      <div>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.5rem 1.75rem 0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)',
          }}>
            <Music2 size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              PulseBeat
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '1px' }}>
              Audio Platform
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            padding: '0 0.75rem 0.5rem 0.75rem',
          }}>
            Navigation
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.72rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  textAlign: 'left',
                  background: active
                    ? 'linear-gradient(90deg, rgba(124, 58, 237, 0.14), rgba(124, 58, 237, 0.04))'
                    : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.88rem',
                  transition: 'all var(--transition-fast)',
                  boxShadow: active ? '0 2px 10px rgba(124, 58, 237, 0.1)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = 'rgba(124, 58, 237, 0.06)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.6rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                    color: '#fff',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Track button */}
        <div style={{ marginTop: '1.75rem', padding: '0 0.25rem' }}>
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.875rem' }}
          >
            <PlusCircle size={17} />
            <span>Add New Track</span>
          </button>
        </div>
      </div>

      {/* Bottom project info */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.07), rgba(219, 39, 119, 0.07))',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        border: '1px solid var(--border-subtle)',
        marginBottom: '4.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Award size={15} color="#d97706" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>CA-03 Project</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.6rem' }}>
          Full Stack Audio Streaming Platform · PRN: 25070521179
        </p>
        <button
          onClick={onOpenInfoModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            color: 'var(--primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Layers size={12} />
          <span>View Requirements</span>
        </button>
      </div>
    </aside>
  );
}
