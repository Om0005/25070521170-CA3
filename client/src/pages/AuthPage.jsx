import React, { useState, useEffect } from 'react';
import {
  Music2, Lock, Mail, User, ShieldCheck, KeyRound, Sparkles,
  ArrowRight, CheckCircle2, Server, Disc, Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkServerStatus } from '../api/api';

export function AuthPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    prn: '25070521179',
  });
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState({ online: false, database: '' });
  const { login, register, loading } = useAuth();

  useEffect(() => {
    let isMounted = true;
    checkServerStatus().then((res) => { if (isMounted) setServerStatus(res); });
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      const res = await register(formData.name.trim(), formData.email.trim(), formData.password, formData.prn);
      if (res.success) { if (onLoginSuccess) onLoginSuccess(); }
      else { setError(res.error || 'Registration failed'); }
    } else {
      if (!formData.email.trim() || !formData.password) {
        setError('Please enter your email and password');
        return;
      }
      const res = await login(formData.email.trim(), formData.password);
      if (res.success) { if (onLoginSuccess) onLoginSuccess(); }
      else { setError(res.error || 'Invalid email or password'); }
    }
  };

  const features = [
    'Protected multi-page dashboard',
    'Full CRUD audio catalog (REST API)',
    'JWT authentication & secure sessions',
    'Music-reactive UI & audio player',
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background:
        'radial-gradient(circle at 15% 25%, rgba(124, 58, 237, 0.15) 0%, transparent 45%), ' +
        'radial-gradient(circle at 85% 75%, rgba(219, 39, 119, 0.12) 0%, transparent 45%), ' +
        'linear-gradient(160deg, #faf5ff 0%, #fdf4ff 45%, #fff0fb 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: '-8%', left: '-4%',
        width: '480px', height: '480px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '420px', height: '420px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(219, 39, 119, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '1040px',
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        borderRadius: '28px',
        overflow: 'hidden',
        border: '1.5px solid rgba(124, 58, 237, 0.15)',
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 30px 70px -15px rgba(124, 58, 237, 0.2), 0 8px 20px rgba(219, 39, 119, 0.08)',
      }}>
        {/* Left — Brand Showcase */}
        <div style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 45%, #db2777 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circle */}
          <div style={{
            position: 'absolute', top: '-30%', right: '-15%',
            width: '320px', height: '320px', borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', left: '-10%',
            width: '260px', height: '260px', borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.5rem' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
                <Music2 size={26} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  PulseBeat
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 600, marginTop: '1px', color: '#ffffff' }}>
                  Audio Platform
                </div>
              </div>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: '#ffffff' }}>
              Your music, your world.
            </h1>

            <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.65, marginBottom: '2rem', color: '#ffffff' }}>
              Sign in to unlock your personal music dashboard — stream, manage, and discover tracks in one beautiful space.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.84rem' }}>
                  <CheckCircle2 size={17} color="rgba(255,255,255,0.9)" style={{ flexShrink: 0 }} />
                  <span style={{ opacity: 0.9 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom badges */}
          <div style={{
            position: 'relative', zIndex: 1,
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.75rem', fontWeight: 700,
              fontFamily: 'monospace',
            }}>
              <Sparkles size={12} />
              PRN: 25070521179 · CA-03
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.75rem', opacity: serverStatus.online ? 1 : 0.7,
              background: serverStatus.online ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)',
              padding: '0.3rem 0.7rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              <Server size={12} />
              <span>{serverStatus.online ? 'Server Online' : 'Server Offline'}</span>
            </div>
          </div>
        </div>

        {/* Right — Auth Form */}
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
              {isRegister
                ? 'Fill in your details to get started'
                : 'Enter your credentials to continue'}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(124, 58, 237, 0.07)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
          }}>
            {['Sign In', 'Register'].map((label, i) => {
              const active = i === 0 ? !isRegister : isRegister;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setIsRegister(i === 1); setError(''); }}
                  style={{
                    flex: 1, padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem', fontWeight: 600,
                    background: active ? 'linear-gradient(135deg, #7c3aed, #db2777)' : 'transparent',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    boxShadow: active ? '0 2px 10px rgba(124, 58, 237, 0.35)' : 'none',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {error && (
            <div style={{
              padding: '0.8rem 1rem',
              background: 'rgba(220, 38, 38, 0.07)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <User size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <ShieldCheck size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    Student PRN
                  </label>
                  <input
                    type="text"
                    value={formData.prn}
                    onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
                    className="input-field"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">
                <Mail size={11} style={{ display: 'inline', marginRight: '4px' }} />
                Email Address *
              </label>
              <input
                type="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">
                <KeyRound size={11} style={{ display: 'inline', marginRight: '4px' }} />
                Password *{' '}
                {isRegister && <span style={{ textTransform: 'none', color: 'var(--text-muted)' }}>(min 6 characters)</span>}
              </label>
              <input
                type="password"
                placeholder={isRegister ? 'At least 6 characters' : '••••••••'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                minLength={isRegister ? 6 : undefined}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <span>{loading ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Register
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
