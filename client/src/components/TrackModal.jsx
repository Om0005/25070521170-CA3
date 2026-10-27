import React, { useState, useEffect } from 'react';
import { X, Music, Image, Clock, Tag, Disc, User, Sparkles } from 'lucide-react';

const GENRE_OPTIONS = [
  'Synthwave',
  'Lo-Fi',
  'Electronic',
  'Acoustic',
  'Ambient',
  'Pop',
  'Rock',
  'Hip Hop',
  'Jazz / Soul'
];

const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
];

export function TrackModal({ isOpen, onClose, onSave, trackToEdit }) {
  const isEditing = Boolean(trackToEdit);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Synthwave',
    duration: '3:30',
    coverUrl: SAMPLE_COVERS[0],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trackToEdit) {
      setFormData({
        title: trackToEdit.title || '',
        artist: trackToEdit.artist || '',
        album: trackToEdit.album || '',
        genre: trackToEdit.genre || 'Synthwave',
        duration: trackToEdit.duration || '3:30',
        coverUrl: trackToEdit.coverUrl || SAMPLE_COVERS[0],
        audioUrl: trackToEdit.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: 'Synthwave',
        duration: '3:30',
        coverUrl: SAMPLE_COVERS[Math.floor(Math.random() * SAMPLE_COVERS.length)],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      });
    }
    setErrors({});
  }, [trackToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist.trim()) newErrors.artist = 'Artist name is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required (e.g. 3:45)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData, trackToEdit?._id);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Error saving track' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', background: '#fff' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Music size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
                {isEditing ? 'Update Audio Track (PUT)' : 'Create New Track (POST)'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {isEditing ? 'Modify track metadata and sync with backend API' : 'Add new track to database and music catalog'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Error notification */}
        {errors.form && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Row 1: Title and Artist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <Music size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Track Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Celestial Horizon"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
              />
              {errors.title && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Artist Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Luna Eclipse"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="input-field"
              />
              {errors.artist && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.artist}</span>}
            </div>
          </div>

          {/* Row 2: Album and Genre */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <Disc size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Album / EP
              </label>
              <input
                type="text"
                placeholder="e.g. Nightfall Vol. 2"
                value={formData.album}
                onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Tag size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Genre
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="input-field"
                style={{ cursor: 'pointer' }}
              >
                {GENRE_OPTIONS.map(g => (
                  <option key={g} value={g} style={{ background: '#fff', color: 'var(--text-main)' }}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Duration & Audio Stream URL */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Duration
              </label>
              <input
                type="text"
                placeholder="3:45"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Audio Stream URL
              </label>
              <input
                type="text"
                placeholder="https://...mp3"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Cover Art selection */}
          <div className="form-group">
            <label className="form-label">
              <Image size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Cover Image URL
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              className="input-field"
              style={{ marginBottom: '0.6rem' }}
            />
            {/* Quick cover presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
              {SAMPLE_COVERS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`preset-${i}`}
                  onClick={() => setFormData({ ...formData, coverUrl: url })}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    border: formData.coverUrl === url ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Track' : 'Create Track'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
