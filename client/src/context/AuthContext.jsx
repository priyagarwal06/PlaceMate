import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('placemate_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (data) => {
    localStorage.setItem('placemate_token', data.token);
    localStorage.setItem('placemate_user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    persistSession(res.data.data);
    return res.data.data;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    // Only persist the session if the account can actually log in
    // (a pending recruiter gets a token but should still be sent to login)
    if (payload.role !== 'recruiter') {
      persistSession(res.data.data);
    }
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('placemate_token');
    localStorage.removeItem('placemate_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
