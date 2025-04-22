import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Para ambiente de desenvolvimento, autenticar automaticamente
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const devLogin = () => {
        setIsAuthenticated(true);
        const devUser = {
          id: 1,
          name: 'Administrador',
          email: 'admin@hcb.com',
          role: 'admin'
        };
        setUser(devUser);
        localStorage.setItem('authToken', 'dev-token');
        localStorage.setItem('userData', JSON.stringify(devUser));
        setLoading(false);
      };
      
      if (!isAuthenticated) {
        devLogin();
      }
    }
  }, [isAuthenticated]);

  const login = (email, password) => {
    // Em produção, isso seria uma chamada API
    // Para desenvolvimento, simulamos o login
    if (email === 'admin@hcb.com' && password === 'admin123') {
      const userData = {
        id: 1,
        name: 'Administrador',
        email: 'admin@hcb.com',
        role: 'admin'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'fake-token-for-demo');
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
