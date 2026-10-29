import axios from 'axios';

const TOKEN_KEY = 'cap.token';
const USER_KEY = 'cap.user';

/** In development the Vite proxy forwards /api -> http://localhost:5000 */
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '').trim() || '/api',
  headers: { 'Content-Type': 'application/json' },
});

/* ------------------------------ token storage ------------------------------ */

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const userStore = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch {
      return null;
    }
  },
  set: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => localStorage.removeItem(USER_KEY),
};

/* ------------------------------ interceptors ------------------------------ */

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register');

    // Expired / invalid session -> clear it and send the user back to the
    // sign-in screen for the portal they were using.
    if (status === 401 && !isAuthAttempt) {
      const role = userStore.get()?.role;
      const isStudentArea =
        role === 'student' || window.location.pathname.startsWith('/student');
      const loginPath = isStudentArea ? '/student/login' : '/login';

      tokenStore.clear();
      userStore.clear();
      if (!window.location.pathname.endsWith('/login')) {
        window.location.assign(`${loginPath}?expired=1`);
      }
    }

    return Promise.reject(error);
  }
);

/* ------------------------------ error helpers ------------------------------ */

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Make sure the API is running on port 5000.';
  }
  return error.message || 'Something went wrong. Please try again.';
};

export const getFieldErrors = (error) => error.response?.data?.fields || {};

export default api;
