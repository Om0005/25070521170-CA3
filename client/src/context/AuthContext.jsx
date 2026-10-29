import { createContext, useCallback, useContext, useState } from 'react';
import api, { tokenStore, userStore } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => userStore.get());
  const [token, setToken] = useState(() => tokenStore.get());

  const persistSession = useCallback((payload) => {
    tokenStore.set(payload.token);
    userStore.set(payload.user);
    setToken(payload.token);
    setUser(payload.user);
  }, []);

  /**
   * `portal` is "admin" or "student". The API rejects a mismatch, so the two
   * sign-in doors stay separate even if a password is valid for the other one.
   */
  const login = useCallback(
    async (email, password, portal) => {
      const { data } = await api.post('/auth/login', { email, password, portal });
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const registerStudent = useCallback(
    async (payload) => {
      const { data } = await api.post('/auth/register/student', payload);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    userStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    login,
    register,
    registerStudent,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
