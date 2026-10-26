import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi, studentApi } from '../../api/resources';
import { getErrorMessage, getFieldErrors } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatDate, initials } from '../../data/helpers';
import { StatusBadge } from '../../components/Badge';
import {
  IconCalendar,
  IconCheckCircle,
  IconCourses,
  IconIdCard,
  IconInfo,
  IconKey,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShield,
} from '../../components/icons';

export default function StudentProfile() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [contact, setContact] = useState({ phone: '', address: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [savingContact, setSavingContact] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentApi.profile();
      setData(response);
      setContact({
        phone: response.profile?.phone || '',
        address: response.profile?.address || '',
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const profile = data?.profile;
  const account = data?.account;
  const completeness = Math.round(
    ([profile?.phone, profile?.address].filter(Boolean).length / 2) * 100
  );

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContact((current) => ({ ...current, [name]: value }));
    setContactErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const saveContact = async (event) => {
    event.preventDefault();

    if (contact.phone && !/^[0-9+\-\s]{8,15}$/.test(contact.phone.trim())) {
      setContactErrors({ phone: 'Use 8–15 digits, spaces, + or -' });
      return;
    }

    setSavingContact(true);
    setContactErrors({});
    try {
      const response = await studentApi.updateProfile({
        phone: contact.phone.trim(),
        address: contact.address.trim(),
      });
      setData((current) => (current ? { ...current, profile: response.profile } : current));
      setContact({
        phone: response.profile?.phone || '',
        address: response.profile?.address || '',
      });
      toast.success('Your contact details are up to date.', 'Profile saved');
    } catch (requestError) {
      setContactErrors(getFieldErrors(requestError));
      toast.error(getErrorMessage(requestError), 'Could not save');
    } finally {
      setSavingContact(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!passwords.currentPassword) errors.currentPassword = 'Enter your current password';
    if (!passwords.newPassword) errors.newPassword = 'Choose a new password';
    else if (passwords.newPassword.length < 6) errors.newPassword = 'Use at least 6 characters';
    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length) {
      setPasswordErrors(errors);
      return;
    }

    setSavingPassword(true);
    setPasswordErrors({});
    try {
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Use your new password the next time you sign in.', 'Password updated');
    } catch (requestError) {
      setPasswordErrors(getFieldErrors(requestError));
      toast.error(getErrorMessage(requestError), 'Could not update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">My profile</h1>
          <p className="page__subtitle">
            Your admission identity stays with the office; contact details are yours to maintain.
          </p>
        </div>

        <div className="page__actions">
          <Link to="/student" className="btn btn--secondary btn--sm">
            Back to overview
          </Link>
        </div>
      </div>

      {error ? (
        <div className="card" style={{ padding: 18, marginBottom: 18 }}>
          <div className="alert alert--error" role="alert">
            <IconInfo size={16} />
            <span>{error}</span>
          </div>
          <button type="button" className="btn btn--secondary btn--sm" style={{ marginTop: 12 }} onClick={load}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="profile-grid">
        <section className="card profile-identity">
          <div className="profile-identity__banner" aria-hidden="true" />
          <div className="profile-identity__body">
            {loading ? (
              <span className="skeleton" style={{ width: 84, height: 84, borderRadius: '50%' }} />
            ) : (
              <span className="avatar avatar--xl avatar--student" aria-hidden="true">
                {initials(profile?.name || 'Student')}
              </span>
            )}

            {loading ? (
              <>
                <span className="skeleton" style={{ width: 180, height: 22, marginTop: 16 }} />
                <span className="skeleton" style={{ width: 120, height: 14, marginTop: 10 }} />
              </>
            ) : (
              <>
                <h2 className="profile-identity__name">{profile?.name}</h2>
                <span className="profile-identity__roll mono">{profile?.rollNo}</span>
                {profile ? <StatusBadge value={profile.status} /> : null}
              </>
            )}

            <div className="divider" style={{ margin: '20px 0 16px' }} />

            <ul className="kv-list">
              <li>
                <span>
                  <IconCourses size={15} />
                  Department
                </span>
                <strong>{profile?.department || '—'}</strong>
              </li>
              <li>
                <span>
                  <IconCalendar size={15} />
                  Year &amp; semester
                </span>
                <strong>
                  Year {profile?.year || '—'} · Sem {profile?.semester || '—'}
                </strong>
              </li>
              <li>
                <span>
                  <IconIdCard size={15} />
                  Admission date
                </span>
                <strong>{formatDate(profile?.admissionDate)}</strong>
              </li>
              <li>
                <span>
                  <IconMail size={15} />
                  Account email
                </span>
                <strong className="kv-list__email">{account?.email || '—'}</strong>
              </li>
              <li>
                <span>
                  <IconShield size={15} />
                  Last sign-in
                </span>
                <strong>{account?.lastLoginAt ? formatDate(account.lastLoginAt) : 'This session'}</strong>
              </li>
            </ul>

            <p className="profile-identity__note">
              To change your name, roll number, department or semester, contact the administration
              office.
            </p>
          </div>
        </section>

        <div className="dash-stack">
          <section className="card">
            <div className="card__head">
              <div>
                <h2 className="card__title">Contact details</h2>
                <p className="card__subtitle">Visible to the administration office</p>
              </div>
              {!loading ? (
                <span className="badge badge--plain badge--success">
                  <IconCheckCircle size={13} />
                  {completeness}% complete
                </span>
              ) : null}
            </div>

            <div className="card__body">
              {loading ? (
                <div style={{ display: 'grid', gap: 14 }}>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <span key={index} className="skeleton" style={{ height: 42 }} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="completeness" style={{ marginTop: 0, marginBottom: 18 }}>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${completeness}%` }} />
                    </div>
                  </div>

                  <form className="auth__form" onSubmit={saveContact}>
                    <div className="form-grid">
                      <div className="field">
                        <label className="field__label" htmlFor="profile-phone">
                          <IconPhone size={14} /> Phone number
                        </label>
                        <input
                          id="profile-phone"
                          name="phone"
                          type="tel"
                          className={`input${contactErrors.phone ? ' is-invalid' : ''}`}
                          placeholder="9822011201"
                          autoComplete="tel"
                          value={contact.phone}
                          onChange={handleContactChange}
                        />
                        {contactErrors.phone ? (
                          <span className="field__error">{contactErrors.phone}</span>
                        ) : (
                          <span className="field__hint">8–15 digits, spaces, + or -</span>
                        )}
                      </div>

                      <div className="field">
                        <label className="field__label" htmlFor="profile-email">
                          <IconMail size={14} /> Login email
                        </label>
                        <input
                          id="profile-email"
                          type="email"
                          className="input"
                          value={account?.email || ''}
                          readOnly
                          aria-readonly="true"
                        />
                        <span className="field__hint">Your login email cannot be changed here.</span>
                      </div>

                      <div className="field field--full">
                        <label className="field__label" htmlFor="profile-address">
                          <IconMapPin size={14} /> Address
                        </label>
                        <textarea
                          id="profile-address"
                          name="address"
                          className={`textarea${contactErrors.address ? ' is-invalid' : ''}`}
                          placeholder="House / street, area, city, PIN code"
                          maxLength={200}
                          value={contact.address}
                          onChange={handleContactChange}
                          style={{ minHeight: 96 }}
                        />
                        {contactErrors.address ? (
                          <span className="field__error">{contactErrors.address}</span>
                        ) : (
                          <span className="field__hint">Up to 200 characters.</span>
                        )}
                      </div>
                    </div>

                    <div className="profile-form__actions">
                      <button type="submit" className="btn btn--primary btn--student" disabled={savingContact}>
                        {savingContact ? <span className="spinner" /> : null}
                        {savingContact ? 'Saving…' : 'Save contact details'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <div>
                <h2 className="card__title">Security</h2>
                <p className="card__subtitle">Change the password you use to sign in</p>
              </div>
              <span className="stat-card__icon" style={{ width: 34, height: 34 }}>
                <IconKey size={17} />
              </span>
            </div>

            <div className="card__body">
              <form className="auth__form" onSubmit={changePassword}>
                <div className="form-grid">
                  <div className="field field--full">
                    <label className="field__label" htmlFor="pwd-current">
                      Current password
                    </label>
                    <input
                      id="pwd-current"
                      type="password"
                      className={`input${passwordErrors.currentPassword ? ' is-invalid' : ''}`}
                      autoComplete="current-password"
                      value={passwords.currentPassword}
                      onChange={(event) =>
                        setPasswords((current) => ({ ...current, currentPassword: event.target.value }))
                      }
                    />
                    {passwordErrors.currentPassword ? (
                      <span className="field__error">{passwordErrors.currentPassword}</span>
                    ) : null}
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="pwd-new">
                      New password
                    </label>
                    <input
                      id="pwd-new"
                      type="password"
                      className={`input${passwordErrors.newPassword ? ' is-invalid' : ''}`}
                      autoComplete="new-password"
                      value={passwords.newPassword}
                      onChange={(event) =>
                        setPasswords((current) => ({ ...current, newPassword: event.target.value }))
                      }
                    />
                    {passwordErrors.newPassword ? (
                      <span className="field__error">{passwordErrors.newPassword}</span>
                    ) : null}
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="pwd-confirm">
                      Confirm new password
                    </label>
                    <input
                      id="pwd-confirm"
                      type="password"
                      className={`input${passwordErrors.confirmPassword ? ' is-invalid' : ''}`}
                      autoComplete="new-password"
                      value={passwords.confirmPassword}
                      onChange={(event) =>
                        setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                    />
                    {passwordErrors.confirmPassword ? (
                      <span className="field__error">{passwordErrors.confirmPassword}</span>
                    ) : null}
                  </div>
                </div>

                <div className="profile-form__actions">
                  <button type="submit" className="btn btn--secondary" disabled={savingPassword}>
                    {savingPassword ? <span className="spinner spinner--dark" /> : null}
                    {savingPassword ? 'Updating…' : 'Update password'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
