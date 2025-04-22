import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  }),
);

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar open={!mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar open={!mobileOpen} onClose={handleDrawerToggle} />
      <Main open={!mobileOpen}>
        <Toolbar />
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;
