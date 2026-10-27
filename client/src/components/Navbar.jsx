import React, { useState, useEffect } from 'react';
import { Search, Radio, User, LogOut, Info, Sparkles, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkServerStatus } from '../api/api';

export function Navbar({ onSearch, searchQuery, onOpenInfoModal, onOpenAuthModal }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [serverStatus, setServerStatus] = useState({ online: false, database: '' });

  useEffect(() => {
    let isMounted = true;
    async function verify() {
      const res = await checkServerStatus();
      if (isMounted) setServerStatus(res);
    }
    verify();
    const interval = setInterval(verify, 10000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  return (
    <header style={{
      height: '72px',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-navbar)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 12px rgba(124, 58, 237, 0.07)',
    }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
        <Search size={16} style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }} />
        <input
          type="text"
          placeholder="Search songs, artists, genres…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="input-field"
          style={{
            paddingLeft: '40px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.875rem',
            height: '42px',
          }}
        />
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Server status pill */}
        <div
          title={serverStatus.online ? `Backend connected` : 'Server offline'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.7rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: serverStatus.online
              ? 'rgba(5, 150, 105, 0.1)'
              : 'rgba(220, 38, 38, 0.08)',
            color: serverStatus.online ? '#059669' : '#dc2626',
            border: `1px solid ${serverStatus.online ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.2)'}`,
          }}
        >
          <Server size={13} />
          <span>{serverStatus.online ? 'Server Online' : 'Server Offline'}</span>
        </div>

        {/* PRN Badge */}
        <button
          onClick={onOpenInfoModal}
          className="badge badge-prn"
          style={{
            cursor: 'pointer',
            padding: '0.38rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s ease',
            fontWeight: 700,
          }}
          title="View project details"
        >
          <Sparkles size={13} style={{ color: 'var(--secondary)' }} />
          <span>PRN: 25070521179</span>
          <Info size={13} style={{ opacity: 0.6 }} />
        </button>

        {/* User profile / logout */}
        {isAuthenticated && user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(124, 58, 237, 0.07)',
              padding: '0.3rem 0.75rem 0.3rem 0.4rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)',
              }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>{user.prn || '25070521179'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="btn-icon"
              style={{ color: '#dc2626', width: '34px', height: '34px' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="btn btn-primary"
            style={{ padding: '0.48rem 1.1rem', fontSize: '0.85rem' }}
          >
            <User size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
