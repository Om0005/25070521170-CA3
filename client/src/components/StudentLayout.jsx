import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initials } from '../data/helpers';
import {
  IconDashboard,
  IconCourses,
  IconNotice,
  IconUser,
  IconMenu,
  IconLogout,
  IconIdCard,
} from './icons';

const NAV_MAIN = [{ to: '/student', label: 'Overview', icon: IconDashboard, end: true }];

const NAV_STUDENT = [
  { to: '/student/courses', label: 'My courses', icon: IconCourses },
  { to: '/student/notices', label: 'Notices', icon: IconNotice },
  { to: '/student/profile', label: 'My profile', icon: IconUser },
];

const ALL_NAV = [...NAV_MAIN, ...NAV_STUDENT];

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const currentPage = ALL_NAV.find((item) => item.to === location.pathname)?.label || 'Overview';

  const handleLogout = () => {
    logout();
    navigate('/student/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`;

  return (
    <div className="shell shell--student">
      {sidebarOpen ? (
        <div
          className="sidebar-backdrop"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`sidebar sidebar--student${sidebarOpen ? ' is-open' : ''}`}
        aria-label="Student navigation"
      >
        <div className="sidebar__brand">
          <div className="sidebar__mark" aria-hidden="true">
            SP
          </div>
          <div>
            <div className="sidebar__title">Student Portal</div>
            <div className="sidebar__subtitle">Campus 2025–26</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__group-label">Overview</div>
          {NAV_MAIN.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <Icon />
              {label}
            </NavLink>
          ))}

          <div className="sidebar__group-label">My campus</div>
          {NAV_STUDENT.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <Icon />
              {label}
            </NavLink>
          ))}

          <div className="sidebar__note">
            <IconIdCard size={16} />
            <span>
              Your roll number is your campus identity. Keep your profile contact details current.
            </span>
          </div>
        </nav>

        <div className="sidebar__footer">
          <strong>{user?.name || 'Student'}</strong>
          <span>{user?.email || 'student@college.edu'}</span>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="topbar__toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <IconMenu />
          </button>

          <div className="topbar__crumb">
            <IconIdCard size={15} />
            Student portal
            <span aria-hidden="true">/</span>
            <strong>{currentPage}</strong>
          </div>

          <div className="topbar__spacer" />

          <span className="sync-chip" title="Data is served live from MongoDB">
            <span className="sync-chip__dot" aria-hidden="true" />
            Live · MongoDB
          </span>

          <div className="topbar__user">
            <div>
              <div className="topbar__user-name">{user?.name || 'Student'}</div>
              <div className="topbar__user-role">
                <span className="role-chip role-chip--student">
                  <IconIdCard size={10} />
                  Student
                </span>
              </div>
            </div>
            <div className="avatar avatar--student" aria-hidden="true">
              {initials(user?.name || 'Student')}
            </div>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <IconLogout />
          </button>
        </header>

        <main className="page">
          <div className="page-anim" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
