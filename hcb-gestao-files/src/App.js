import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { useTheme } from './contexts/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Imoveis from './pages/imoveis/Imoveis';
import Contratos from './pages/contratos/Contratos';
import Financeiro from './pages/financeiro/Financeiro';
import EmailsIbagy from './pages/emails/EmailsIbagy';
import Login from './pages/auth/Login';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App" style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <CssBaseline />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/imoveis" element={<Imoveis />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/emails" element={<EmailsIbagy />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
