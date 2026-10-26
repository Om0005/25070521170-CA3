import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Where a signed-in account belongs. */
export const homeFor = (role) => (role === 'student' ? '/student' : '/');

/** Blocks a portal until a token for the right role exists. */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = role === 'student' ? '/student/login' : '/login';
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={homeFor(user?.role)} replace />;
  }

  return children;
}

/** Keeps signed-in users away from the login / register screens. */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={homeFor(user?.role)} replace />;
  return children;
}
