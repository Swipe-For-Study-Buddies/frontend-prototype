import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import './App.scss';
import Home from './components/Home';
import BlankPage from './components/BlankPage';
import Profile from './components/Profile';
import AuthService from './services/auth.service';
import ContextStore from './common/context';

function MuiListItem({ icon, text, path, onClick }) {
  return (
    <>
      {path ?
        <Link to={`/${path}`} style={{ textDecoration: 'none', color: '#000' }}>
          <ListItem button key={text}>
            {icon}
            <ListItemText primary={text} />
          </ListItem>
        </Link> :
        <ListItem button key={text} onClick={onClick}>
          {icon}
          <ListItemText primary={text} />
        </ListItem>
      }
      <Divider />
    </>
  );
}

const Container = styled('div')(({ theme }) => ({
  overflow: 'scroll',
  position: 'relative',
  // backgroundImage: 'url(/background.png)',
  // backgroundRepeat: 'no-repeat',
  // backgroundSize: 'cover',
  // backgroundColor: '#b2b6f5',
  backgroundColor: '#fff',
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
  const { formatMessage } = useIntl();
  const [drawerState, setDrawerState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerState(open);
  };

  useEffect(() => {
    if (!currentUser.name) {
      navigate('/profile', { replace: true });
    }
  }, [currentUser.name, navigate]);

  function logout() {
    AuthService.logout();
    setCurrentUser(undefined);
  }

  const menuItems = currentUser.name ? [
    { text: 'profile', icon: <PersonIcon />, path: 'profile' },
    { text: 'notification', icon: <NotificationsIcon />, path: 'notification' },
    { text: 'matched', icon: <CheckCircleOutlineIcon />, path: 'matched' },
    { text: 'setting', icon: <SettingsIcon />, path: 'setting' },
    { text: 'logout', icon: <LogoutIcon />, onClick: logout },
  ] : [
    { text: 'logout', icon: <LogoutIcon />, onClick: logout },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
        <Toolbar>
          <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              // onClick={handleMenu}
              onClick={toggleDrawer(true)}
              color="primary"
            >
              <MoreHorizIcon />
            </IconButton>
          </div>
        </Toolbar>
        <SwipeableDrawer
          anchor={'right'}
          open={drawerState}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <Box
            sx={{ width : 200 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {menuItems.map(item => (
                <MuiListItem
                  key={item.text}
                  icon={item.icon}
                  path={item.path}
                  onClick={item.onClick}
                  text={formatMessage({ id: `sideMenu.${item.text}` })}
                />)
              )}
            </List>
          </Box>
        </SwipeableDrawer>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notification" element={<BlankPage />} />
          <Route path="/Matched" element={<BlankPage />} />
          <Route path="/Setting" element={<BlankPage />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
