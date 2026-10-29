import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage, getFieldErrors } from '../api/client';
import AuthShell, { AuthSwitchLink } from '../components/AuthShell';
import { IconArrowRight, IconInfo } from '../components/icons';
import { DEPARTMENTS, SEMESTERS, YEARS } from '../data/constants';

const EMPTY_STUDENT = {
  name: '',
  rollNo: '',
  email: '',
  phone: '',
  department: '',
  year: '',
  semester: '',
  password: '',
  confirmPassword: '',
};

export default function Register({ mode = 'admin' }) {
  const isStudent = mode === 'student';
  const { register, registerStudent } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(
    isStudent ? EMPTY_STUDENT : { name: '', email: '', password: '', confirmPassword: '' }
  );
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

    if (isStudent) {
      if (!form.rollNo.trim()) errors.rollNo = 'Roll number is required';
      if (!form.department) errors.department = 'Select your department';
      if (!form.year) errors.year = 'Select your year';
      if (!form.semester) errors.semester = 'Select your semester';
      if (form.phone && !/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) {
        errors.phone = 'Use 8–15 digits, spaces, + or -';
      }
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isStudent) {
        const result = await registerStudent({
          name: form.name.trim(),
          rollNo: form.rollNo.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          department: form.department,
          year: Number(form.year),
          semester: Number(form.semester),
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
        toast.success(`Student account ready for ${result.user.email}.`, 'Welcome to campus');
        navigate('/student', { replace: true });
      } else {
        const result = await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
        toast.success(`Administrator account created for ${result.user.email}.`, 'Welcome');
        navigate('/', { replace: true });
      }
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode={mode} variant="register">
      <div className="auth__card-head">
        <h2 className="auth__title">{isStudent ? 'Create student account' : 'Create admin account'}</h2>
        <p className="auth__sub">
          {isStudent
            ? 'Your admission record and login are created together — no approval needed.'
            : 'Register a new administrator for the portal.'}
        </p>
      </div>

      {error ? (
        <div className="alert alert--error" role="alert" style={{ marginBottom: 16 }}>
          <IconInfo size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <div className={isStudent ? 'auth__grid' : ''}>
          <div className={`field${isStudent ? ' field--full' : ''}`}>
            <label className="field__label" htmlFor="register-name">
              Full name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              className={`input${fieldErrors.name ? ' is-invalid' : ''}`}
              placeholder={isStudent ? 'Aarav Mehta' : 'Om Kashikar'}
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
            />
            {fieldErrors.name ? <span className="field__error">{fieldErrors.name}</span> : null}
          </div>

          {isStudent ? (
            <div className="field">
              <label className="field__label" htmlFor="register-roll">
                Roll number
              </label>
              <input
                id="register-roll"
                name="rollNo"
                type="text"
                className={`input mono${fieldErrors.rollNo ? ' is-invalid' : ''}`}
                placeholder="25070521013"
                autoComplete="off"
                value={form.rollNo}
                onChange={handleChange}
              />
              {fieldErrors.rollNo ? <span className="field__error">{fieldErrors.rollNo}</span> : null}
            </div>
          ) : null}

          {isStudent ? (
            <div className="field">
              <label className="field__label" htmlFor="register-phone">
                Phone <span style={{ color: 'var(--muted-light)', fontWeight: 500 }}>(optional)</span>
              </label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                className={`input${fieldErrors.phone ? ' is-invalid' : ''}`}
                placeholder="9822011201"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
              />
              {fieldErrors.phone ? <span className="field__error">{fieldErrors.phone}</span> : null}
            </div>
          ) : null}

          <div className={`field${isStudent ? ' field--full' : ''}`}>
            <label className="field__label" htmlFor="register-email">
              Email address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className={`input${fieldErrors.email ? ' is-invalid' : ''}`}
              placeholder={isStudent ? 'you@student.edu' : 'you@college.edu'}
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email ? <span className="field__error">{fieldErrors.email}</span> : null}
          </div>

          {isStudent ? (
            <div className="field field--full">
              <label className="field__label" htmlFor="register-department">
                Department
              </label>
              <select
                id="register-department"
                name="department"
                className={`select${fieldErrors.department ? ' is-invalid' : ''}`}
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              {fieldErrors.department ? (
                <span className="field__error">{fieldErrors.department}</span>
              ) : null}
            </div>
          ) : null}

          {isStudent ? (
            <div className="field">
              <label className="field__label" htmlFor="register-year">
                Year of study
              </label>
              <select
                id="register-year"
                name="year"
                className={`select${fieldErrors.year ? ' is-invalid' : ''}`}
                value={form.year}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
              {fieldErrors.year ? <span className="field__error">{fieldErrors.year}</span> : null}
            </div>
          ) : null}

          {isStudent ? (
            <div className="field">
              <label className="field__label" htmlFor="register-semester">
                Semester
              </label>
              <select
                id="register-semester"
                name="semester"
                className={`select${fieldErrors.semester ? ' is-invalid' : ''}`}
                value={form.semester}
                onChange={handleChange}
              >
                <option value="">Select semester</option>
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
              {fieldErrors.semester ? (
                <span className="field__error">{fieldErrors.semester}</span>
              ) : null}
            </div>
          ) : null}

          <div className={`field${isStudent ? '' : ' field--full'}`}>
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
              <span className="field__hint">Minimum 6 characters. Mix letters and numbers.</span>
            )}
          </div>

          <div className={`field${isStudent ? '' : ' field--full'}`}>
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
        </div>

        <button
          type="submit"
          className={`btn btn--primary btn--block${isStudent ? ' btn--student' : ''}`}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : null}
          {loading
            ? 'Creating account…'
            : isStudent
              ? 'Create student account'
              : 'Create administrator account'}
          {!loading ? <IconArrowRight size={16} /> : null}
        </button>
      </form>

      {isStudent ? (
        <p className="auth__hintline">
          Already admitted? Create your login with the roll number from your admission letter. Your
          record appears instantly on the admin portal.
        </p>
      ) : null}

      <AuthSwitchLink mode={mode} variant="register" />
    </AuthShell>
  );
}
