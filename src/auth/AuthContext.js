import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, loginRequest, signupRequest } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, role, region_id, ... }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dkn_token');
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (e) {
        console.error('Failed to load current user', e);
        localStorage.removeItem('dkn_token');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    localStorage.setItem('dkn_token', data.token);
    const me = await fetchMe();
    setUser(me);
  };

  const signup = async (name, email, password) => {
    const data = await signupRequest(name, email, password);
    localStorage.setItem('dkn_token', data.token);
    const me = await fetchMe();
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem('dkn_token');
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
