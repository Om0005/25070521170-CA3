import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../api/client';
import AuthShell, { AuthSwitchLink } from '../components/AuthShell';
import { IconArrowRight, IconInfo } from '../components/icons';

export default function Login({ mode = 'admin' }) {
  const isStudent = mode === 'student';
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const expired = new URLSearchParams(location.search).get('expired');

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [wrongPortal, setWrongPortal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
    if (wrongPortal) setWrongPortal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setLoading(true);
    setError('');
    setWrongPortal(false);

    try {
      const result = await login(form.email.trim(), form.password, mode);
      const fallback = isStudent ? '/student' : '/';
      const requested = location.state?.from;
      const belongsHere =
        requested && (isStudent ? requested.startsWith('/student') : !requested.startsWith('/student'));

      toast.success(
        `Signed in as ${result.user.name}.`,
        isStudent ? 'Student portal' : 'Administrator portal'
      );
      navigate(belongsHere ? requested : fallback, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setWrongPortal(Boolean(requestError.response?.data?.fields?.portal));
    } finally {
      setLoading(false);
    }
  };

  const otherDoor = isStudent ? '/login' : '/student/login';
  const otherLabel = isStudent ? 'administrator' : 'student';

  return (
    <AuthShell mode={mode} variant="login">
      <div className="auth__card-head">
        <h2 className="auth__title">{isStudent ? 'Student sign in' : 'Administrator sign in'}</h2>
        <p className="auth__sub">
          {isStudent
            ? 'Use the student account you created with your roll number.'
            : 'Use your administrator account to manage the campus.'}
        </p>
      </div>

      {expired ? (
        <div className="alert alert--info" role="status" style={{ marginBottom: 16 }}>
          <IconInfo size={16} />
          <span>Your session expired. Please sign in again.</span>
        </div>
      ) : null}

      {error ? (
        <div className="alert alert--error" role="alert" style={{ marginBottom: 16 }}>
          <IconInfo size={16} />
          <span>
            {error}{' '}
            {wrongPortal ? (
              <Link to={otherDoor} style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                Switch to {otherLabel} sign-in
              </Link>
            ) : null}
          </span>
        </div>
      ) : null}

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="login-email">
            {isStudent ? 'Student email address' : 'Email address'}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            className="input"
            placeholder={isStudent ? 'you@student.edu' : 'omkashikar@college.edu'}
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="login-password">
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="input"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              style={{ paddingRight: 70 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              style={{
                position: 'absolute',
                right: 6,
                top: 6,
                height: 30,
                padding: '0 9px',
                border: 'none',
                background: 'transparent',
                color: 'var(--muted)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`btn btn--primary btn--block${isStudent ? ' btn--student' : ''}`}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : null}
          {loading ? 'Signing in…' : isStudent ? 'Sign in as student' : 'Sign in as administrator'}
          {!loading ? <IconArrowRight size={16} /> : null}
        </button>
      </form>

      <div className={`auth__demo${isStudent ? ' auth__demo--student' : ''}`}>
        <strong style={{ color: 'var(--ink-soft)' }}>Demo {isStudent ? 'student' : 'admin'} account</strong>
        <br />
        {isStudent ? (
          <>
            Email <code>aarav.mehta@student.edu</code> · Password <code>Student@123</code>
          </>
        ) : (
          <>
            Email <code>omkashikar@college.edu</code> · Password <code>Admin@123</code>
          </>
        )}
      </div>

      <AuthSwitchLink mode={mode} variant="login" />
    </AuthShell>
  );
}
