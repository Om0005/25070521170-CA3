import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Backdrop from './components/Backdrop';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Faculty from './pages/Faculty';
import Notices from './pages/Notices';
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentNotices from './pages/student/StudentNotices';
import StudentProfile from './pages/student/StudentProfile';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <Backdrop />
          <Routes>
            {/* ----------------------------- public ----------------------------- */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login mode="admin" />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/student/login"
              element={
                <PublicOnlyRoute>
                  <Login mode="student" />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register mode="admin" />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/student/register"
              element={
                <PublicOnlyRoute>
                  <Register mode="student" />
                </PublicOnlyRoute>
              }
            />

            {/* --------------------------- admin portal -------------------------- */}
            <Route
              element={
                <ProtectedRoute role="admin">
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="courses" element={<Courses />} />
              <Route path="faculty" element={<Faculty />} />
              <Route path="notices" element={<Notices />} />
            </Route>

            {/* -------------------------- student portal ------------------------- */}
            <Route
              path="/student"
              element={
                <ProtectedRoute role="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="notices" element={<StudentNotices />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
