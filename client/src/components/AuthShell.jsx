import { Link } from 'react-router-dom';
import FlowSteps from './FlowSteps';
import RoleSwitch from './RoleSwitch';
import {
  IconCheck,
  IconCourses,
  IconIdCard,
  IconNotice,
  IconShield,
  IconStudents,
  IconUser,
} from './icons';

const COPY = {
  login: {
    admin: {
      headline: (
        <>
          One place to run the <span>whole campus</span>.
        </>
      ),
      lede:
        'Student records, course allocations, faculty details and official notices — managed from a single secure dashboard.',
      features: [
        { icon: IconStudents, text: 'Admissions, roll numbers and department-wise student records.' },
        { icon: IconCourses, text: 'Course catalogue with credits, semesters and assigned faculty.' },
        { icon: IconShield, text: 'Protected administration area backed by token authentication.' },
      ],
      flowLabel: 'Admin sign-in flow',
      flow: [
        { label: 'Sign in', hint: 'JWT issued' },
        { label: 'Dashboard', hint: 'Live campus stats' },
        { label: 'Manage', hint: 'CRUD → MongoDB' },
      ],
    },
    student: {
      headline: (
        <>
          Your <span>campus life</span>, all in one place.
        </>
      ),
      lede:
        'Sign in to see your courses, read official notices and keep your contact details up to date — no paperwork required.',
      features: [
        { icon: IconCourses, text: 'Your department courses, credits and faculty in one view.' },
        { icon: IconNotice, text: 'Official notices published for students, newest first.' },
        { icon: IconUser, text: 'Maintain your own phone and address details any time.' },
      ],
      flowLabel: 'Student sign-in flow',
      flow: [
        { label: 'Sign in', hint: 'Student account' },
        { label: 'My courses', hint: 'This semester' },
        { label: 'Notices', hint: 'Campus updates' },
      ],
    },
  },
  register: {
    admin: {
      headline: (
        <>
          Set up your <span>administrator</span> account.
        </>
      ),
      lede:
        'This account manages student admissions, the course catalogue, faculty records and notices published to the campus.',
      features: [
        { icon: IconShield, text: 'Passwords are hashed before they are stored — never saved as plain text.' },
        { icon: IconCheck, text: 'Your session is validated with a signed token on every request.' },
      ],
      flowLabel: 'Admin onboarding flow',
      flow: [
        { label: 'Register', hint: 'Hash + store' },
        { label: 'Auto sign-in', hint: 'Token returned' },
        { label: 'Dashboard', hint: 'Start managing' },
      ],
    },
    student: {
      headline: (
        <>
          Create your <span>student</span> account in a minute.
        </>
      ),
      lede:
        'Register with your roll number and department. Your admission record and student login are created together, then you are signed in automatically.',
      features: [
        { icon: IconIdCard, text: 'One account for your courses, notices and profile.' },
        { icon: IconCheck, text: 'No waiting for approval — start exploring immediately.' },
        { icon: IconUser, text: 'Update your phone and address whenever you need to.' },
      ],
      flowLabel: 'Student onboarding flow',
      flow: [
        { label: 'Register', hint: 'Roll + details' },
        { label: 'Auto sign-in', hint: 'Portal opens' },
        { label: 'My courses', hint: 'Start exploring' },
      ],
    },
  },
};

/**
 * Shared glass split-screen used by both sign-in and sign-up screens.
 * The `mode` switches the copy, accent colour and portal tab.
 */
export default function AuthShell({ mode = 'admin', variant = 'login', children }) {
  const isStudent = mode === 'student';
  const copy = (COPY[variant] || COPY.login)[isStudent ? 'student' : 'admin'];

  return (
    <div className={`auth auth--${mode} auth--${variant}`}>
      <aside className="auth__aside">
        <div className="auth__brand">
          <div className="sidebar__mark" aria-hidden="true">
            {isStudent ? 'SP' : 'CA'}
          </div>
          <div>
            <div className="sidebar__title">
              {isStudent ? 'College Student Portal' : 'College Administration Portal'}
            </div>
            <div className="sidebar__subtitle">
              {isStudent ? 'Student access' : 'Administrator access'}
            </div>
          </div>
        </div>

        <div>
          <h1 className="auth__headline">{copy.headline}</h1>
          <p className="auth__lede">{copy.lede}</p>

          <ul className="auth__features">
            {copy.features.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="auth__flow">
            <div className="auth__flow-label">{copy.flowLabel}</div>
            <FlowSteps compact label={copy.flowLabel} steps={copy.flow} />
          </div>
        </div>

        <p className="auth__foot">
          Full Stack Web Development · CA3 · {isStudent ? 'Student Portal' : 'College Administration Portal'}
        </p>
      </aside>

      <section className="auth__panel">
        <div className={`auth__card${isStudent && variant === 'register' ? ' auth__card--wide' : ''}`}>
          <RoleSwitch mode={mode} variant={variant} />
          {children}
        </div>
      </section>
    </div>
  );
}

export function AuthSwitchLink({ mode, variant = 'login' }) {
  const isStudent = mode === 'student';

  if (isStudent) {
    return variant === 'register' ? (
      <p className="auth__switch">
        Already have a student account? <Link to="/student/login">Sign in instead</Link>
      </p>
    ) : (
      <p className="auth__switch">
        New student? <Link to="/student/register">Create your student account</Link>
      </p>
    );
  }

  return (
    <p className="auth__switch">
      {variant === 'register' ? 'Already registered?' : 'Need an admin account?'}{' '}
      <Link to={variant === 'register' ? '/login' : '/register'}>
        {variant === 'register' ? 'Sign in instead' : 'Register as administrator'}
      </Link>
    </p>
  );
}
