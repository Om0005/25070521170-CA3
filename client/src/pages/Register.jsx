import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage, getFieldErrors } from '../api/client';
import { IconArrowRight, IconCheck, IconInfo, IconShield } from '../components/icons';
import FlowSteps from '../components/FlowSteps';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Use at least 6 characters';
    if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success(`Account created for ${result.user.email}.`, 'Welcome');
      navigate('/', { replace: true });
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__brand">
          <div className="sidebar__mark" aria-hidden="true">
            CA
          </div>
          <div>
            <div className="sidebar__title">College Administration Portal</div>
            <div className="sidebar__subtitle">Academic year 2025–26</div>
          </div>
        </div>

        <div>
          <h1 className="auth__headline">
            Set up your <span>administrator</span> account.
          </h1>
          <p className="auth__lede">
            This account manages student admissions, the course catalogue, faculty records and
            notices published to the campus.
          </p>

          <ul className="auth__features">
            <li>
              <IconShield />
              <span>Passwords are hashed before they are stored — never saved as plain text.</span>
            </li>
            <li>
              <IconCheck />
              <span>Your session is validated with a signed token on every request.</span>
            </li>
          </ul>

          <div className="auth__flow">
            <div className="auth__flow-label">Onboarding flow</div>
            <FlowSteps
              compact
              label="Onboarding flow"
              steps={[
                { label: 'Register', hint: 'Hash + store' },
                { label: 'Auto sign-in', hint: 'Token returned' },
                { label: 'Dashboard', hint: 'Start managing' },
              ]}
            />
          </div>
        </div>

        <p className="auth__foot">Full Stack Web Development · CA3 · College Administration Portal</p>
      </aside>

      <section className="auth__panel">
        <div className="auth__card">
          <div className="auth__card-head">
            <h2 className="auth__title">Create account</h2>
            <p className="auth__sub">Register a new administrator for the portal.</p>
          </div>

          {error ? (
            <div className="alert alert--error" role="alert" style={{ marginBottom: 16 }}>
              <IconInfo size={16} />
              <span>{error}</span>
            </div>
          ) : null}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field__label" htmlFor="register-name">
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                className={`input${fieldErrors.name ? ' is-invalid' : ''}`}
                placeholder="Dr. Anjali Deshmukh"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
              />
              {fieldErrors.name ? <span className="field__error">{fieldErrors.name}</span> : null}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="register-email">
                Email address
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                className={`input${fieldErrors.email ? ' is-invalid' : ''}`}
                placeholder="you@college.edu"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
              />
              {fieldErrors.email ? <span className="field__error">{fieldErrors.email}</span> : null}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                className={`input${fieldErrors.password ? ' is-invalid' : ''}`}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
              />
              {fieldErrors.password ? (
                <span className="field__error">{fieldErrors.password}</span>
              ) : (
                <span className="field__hint">Minimum 6 characters. Use a mix of letters and numbers.</span>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="register-confirm">
                Confirm password
              </label>
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                className={`input${fieldErrors.confirmPassword ? ' is-invalid' : ''}`}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {fieldErrors.confirmPassword ? (
                <span className="field__error">{fieldErrors.confirmPassword}</span>
              ) : null}
            </div>

            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Creating account…' : 'Create account'}
              {!loading ? <IconArrowRight size={16} /> : null}
            </button>
          </form>

          <p className="auth__switch">
            Already registered? <Link to="/login">Sign in instead</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
