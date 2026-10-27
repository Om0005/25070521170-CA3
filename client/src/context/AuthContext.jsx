import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pulsebeat_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pulsebeat_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pulsebeat_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pulsebeat_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('pulsebeat_token', token);
    } else {
      localStorage.removeItem('pulsebeat_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      setUser(res.user);
      setToken(res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, prn) => {
    setLoading(true);
    try {
      const res = await registerUser(name, email, password, prn);
      setUser(res.user);
      setToken(res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('pulsebeat_user');
    localStorage.removeItem('pulsebeat_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
