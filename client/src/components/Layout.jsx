import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initials } from '../data/helpers';
import {
  IconDashboard,
  IconStudents,
  IconCourses,
  IconFaculty,
  IconNotice,
  IconMenu,
  IconLogout,
  IconBuilding,
} from './icons';

const NAV_MAIN = [{ to: '/', label: 'Dashboard', icon: IconDashboard, end: true }];

const NAV_RESOURCES = [
  { to: '/students', label: 'Students', icon: IconStudents },
  { to: '/courses', label: 'Courses', icon: IconCourses },
  { to: '/faculty', label: 'Faculty', icon: IconFaculty },
  { to: '/notices', label: 'Notices', icon: IconNotice },
];

const ALL_NAV = [...NAV_MAIN, ...NAV_RESOURCES];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const currentPage = ALL_NAV.find((item) => item.to === location.pathname)?.label || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`;

  return (
    <div className="shell">
      {sidebarOpen ? (
        <div
          className="sidebar-backdrop"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside className={`sidebar${sidebarOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar__brand">
          <div className="sidebar__mark" aria-hidden="true">
            CA
          </div>
          <div>
            <div className="sidebar__title">College Admin</div>
            <div className="sidebar__subtitle">Portal</div>
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

          <div className="sidebar__group-label">Manage</div>
          {NAV_RESOURCES.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <strong>{user?.name || 'Administrator'}</strong>
          <span>{user?.email || 'admin@college.edu'}</span>
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
            <IconBuilding size={15} />
            Administration
            <span aria-hidden="true">/</span>
            <strong>{currentPage}</strong>
          </div>

          <div className="topbar__spacer" />

          <div className="topbar__user">
            <div>
              <div className="topbar__user-name">{user?.name || 'Administrator'}</div>
              <div className="topbar__user-role">{user?.role || 'admin'}</div>
            </div>
            <div className="avatar" aria-hidden="true">
              {initials(user?.name || 'Administrator')}
            </div>
          </div>

          <button type="button" className="icon-btn" onClick={handleLogout} aria-label="Log out" title="Log out">
            <IconLogout />
          </button>
        </header>

        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
