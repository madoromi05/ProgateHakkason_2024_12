import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    console.log('AuthContext login called with:', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('AuthContext logout called');
    setUser(null);
  };

  console.log('Current AuthContext user:', user);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 