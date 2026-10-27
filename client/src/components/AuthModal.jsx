import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    prn: '25070521179'
  });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      const res = await register(formData.name, formData.email, formData.password, formData.prn);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Registration failed');
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Please enter your email and password');
        return;
      }
      const res = await login(formData.email, formData.password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Login failed');
      }
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '2rem', background: '#fff' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
                {isRegister ? 'Register' : 'Sign In'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                PulseBeat Audio Platform
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          background: 'rgba(124, 58, 237, 0.07)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: !isRegister ? 'var(--primary)' : 'transparent',
              color: !isRegister ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: isRegister ? 'var(--primary)' : 'transparent',
              color: isRegister ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            padding: '0.7rem 0.9rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">
                  <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ritik Mahakalkar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Student PRN
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25070521179"
                  value={formData.prn}
                  onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Email Address
            </label>
            <input
              type="email"
              placeholder="student@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <KeyRound size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Password {isRegister && <span style={{ textTransform: 'none', color: 'var(--text-muted)' }}>(min 6 characters)</span>}
            </label>
            <input
              type="password"
              placeholder={isRegister ? "At least 6 characters" : "••••••••"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              minLength={isRegister ? 6 : undefined}
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Log In & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
