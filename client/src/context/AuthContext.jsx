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

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
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
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
