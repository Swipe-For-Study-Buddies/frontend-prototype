import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import './App.scss';
import Home from './components/Home';
import Profile from './components/Profile';
import AuthService from './services/auth.service';
import ContextStore from './common/context';

const Container = styled('div')(({ theme }) => ({
  overflow: 'scroll',
  position: 'relative',
  backgroundImage: 'url(/background.png)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundColor: '#b2b6f5',
  minHeight: 'calc(100vh - 64px)',

  // '::before': {
  //   content: '""',
  //   position: 'absolute',
  //   top: '0px',
  //   right: '0px',
  //   bottom: '0px',
  //   left: '0px',
  //   height: '100%',
  //   backgroundColor: 'rgba(255,255,255,0.4)'
  // },
}));

function App() {
  const { currentUser, setCurrentUser } = useContext(ContextStore);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser.name) {
      navigate('/profile', { replace: true });
    }
  }, [currentUser.name, navigate]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function logout() {
    AuthService.logout();
    setCurrentUser(undefined);
  }

  return (
    <>
      <AppBar position="static" sx={{backgroundColor: 'rgba(178, 182, 245)'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1}}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
