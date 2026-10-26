import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../api/client';
import {
  IconArrowRight,
  IconInfo,
  IconStudents,
  IconCourses,
  IconShield,
} from '../components/icons';
import FlowSteps from '../components/FlowSteps';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const expired = new URLSearchParams(location.search).get('expired');

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(form.email.trim(), form.password);
      toast.success(`Signed in as ${result.user.name}.`, 'Welcome back');
      navigate(location.state?.from || '/', { replace: true });
    } catch (requestError) {
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
            One place to run the <span>whole campus</span>.
          </h1>
          <p className="auth__lede">
            Student records, course allocations, faculty details and official notices — managed
            from a single secure dashboard.
          </p>

          <ul className="auth__features">
            <li>
              <IconStudents />
              <span>Admissions, roll numbers and department-wise student records.</span>
            </li>
            <li>
              <IconCourses />
              <span>Course catalogue with credits, semesters and assigned faculty.</span>
            </li>
            <li>
              <IconShield />
              <span>Protected administration area backed by token authentication.</span>
            </li>
          </ul>

          <div className="auth__flow">
            <div className="auth__flow-label">Sign-in flow</div>
            <FlowSteps
              compact
              label="Sign-in flow"
              steps={[
                { label: 'Sign in', hint: 'JWT issued' },
                { label: 'Dashboard', hint: 'Live campus stats' },
                { label: 'Manage', hint: 'CRUD → MongoDB' },
              ]}
            />
          </div>
        </div>

        <p className="auth__foot">Full Stack Web Development · CA3 · College Administration Portal</p>
      </aside>

      <section className="auth__panel">
        <div className="auth__card">
          <div className="auth__card-head">
            <h2 className="auth__title">Sign in</h2>
            <p className="auth__sub">Use your administrator account to access the portal.</p>
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
              <span>{error}</span>
            </div>
          ) : null}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field__label" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="input"
                placeholder="admin@college.edu"
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

            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading ? <IconArrowRight size={16} /> : null}
            </button>
          </form>

          <div className="auth__demo">
            <strong style={{ color: 'var(--ink-soft)' }}>Demo account</strong>
            <br />
            Email <code>admin@college.edu</code> · Password <code>Admin@123</code>
          </div>

          <p className="auth__switch">
            New to the portal? <Link to="/register">Create an administrator account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
