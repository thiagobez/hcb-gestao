import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulação de autenticação
    if (email === 'admin@hcb.com' && password === 'admin123') {
      // Autenticação bem-sucedida
      localStorage.setItem('authToken', 'fake-token-for-demo');
      localStorage.setItem('userData', JSON.stringify({
        id: 1,
        name: 'Administrador',
        email: 'admin@hcb.com',
        role: 'admin'
      }));
      
      // Recarregar a página para atualizar o estado de autenticação
      window.location.reload();
    } else {
      setError('Email ou senha inválidos');
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Item elevation={3}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                HCB Gestão
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Sistema de Gestão para Holding HCB
              </Typography>
              
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Entrar
                </Button>
                
                <Typography variant="caption" color="text.secondary">
                  Para demonstração, use: admin@hcb.com / admin123
                </Typography>
              </Box>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
