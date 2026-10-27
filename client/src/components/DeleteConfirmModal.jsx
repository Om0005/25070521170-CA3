import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, track }) {
  if (!isOpen || !track) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '10px',
            background: 'rgba(220, 38, 38, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#dc2626',
          }}>
            <AlertTriangle size={22} />
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Delete Track?
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--primary)' }}>"{track.title}"</strong> by {track.artist}? This action cannot be undone.
        </p>

        <div style={{
          background: 'rgba(124, 58, 237, 0.05)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)',
        }}>
          <img
            src={track.coverUrl}
            alt={track.title}
            style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{track.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{track.genre} · {track.duration}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
