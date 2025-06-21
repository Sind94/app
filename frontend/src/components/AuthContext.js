import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalUserData, clearLocalUserData } from '../mock/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulazione del controllo di autenticazione esistente
    const checkAuth = () => {
      const savedUser = localStorage.getItem('slowlycard_auth');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Simulazione login
    if (email && password) {
      const userData = getLocalUserData();
      const authData = { ...userData, email };
      setUser(authData);
      localStorage.setItem('slowlycard_auth', JSON.stringify(authData));
      return { success: true };
    }
    return { success: false, error: 'Email e password richiesti' };
  };

  const register = async (email, nickname, password) => {
    // Simulazione registrazione
    if (email && nickname && password) {
      const userData = {
        id: Date.now(),
        email,
        nickname,
        foundCards: []
      };
      setUser(userData);
      localStorage.setItem('slowlycard_auth', JSON.stringify(userData));
      localStorage.setItem('slowlycard_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Tutti i campi sono richiesti' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('slowlycard_auth');
    clearLocalUserData();
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};