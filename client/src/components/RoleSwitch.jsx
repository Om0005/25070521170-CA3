import { Link } from 'react-router-dom';
import { IconShield, IconStudents } from './icons';

/**
 * Sliding two-tab switch between the administrator and student doors.
 * The pill is positioned in CSS from the `is-student` modifier.
 */
export default function RoleSwitch({ mode = 'admin', variant = 'login' }) {
  const adminTo = variant === 'register' ? '/register' : '/login';
  const studentTo = variant === 'register' ? '/student/register' : '/student/login';

  return (
    <div className={`role-switch${mode === 'student' ? ' is-student' : ''}`} role="tablist" aria-label="Choose portal">
      <span className="role-switch__pill" aria-hidden="true" />
      <Link
        to={adminTo}
        role="tab"
        aria-selected={mode === 'admin'}
        className={`role-switch__tab${mode === 'admin' ? ' is-active' : ''}`}
      >
        <IconShield size={16} />
        Administrator
      </Link>
      <Link
        to={studentTo}
        role="tab"
        aria-selected={mode === 'student'}
        className={`role-switch__tab${mode === 'student' ? ' is-active' : ''}`}
      >
        <IconStudents size={16} />
        Student
      </Link>
    </div>
  );
}
