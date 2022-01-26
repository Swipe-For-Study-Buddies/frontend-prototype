import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import './App.scss';
import Home from './components/Home';
// import BlankPage from './components/BlankPage';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import MatchedUsers from './components/MatchedUsers';
import SettingPage from './components/SettingPage';
import Feedback from './components/Feedback';
import ModifyPassword from './components/ModifyPassword';
import DeleteAccount from './components/DeleteAccount';

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

const IconButton = styled(MuiIconButton)(({ theme, type }) => ({
  color: type === 'error' ? 'rgb(197, 85, 99)' : 'rgb(81, 171, 159)',
}));

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
  const theme = useTheme();
  const smSize = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();
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

  const menuItems = () => {
    if (!currentUser.name) {
      return [
        { text: 'logout', icon: <LogoutIcon />, onClick: logout },
      ];
    } else {
      const items = [
        { text: 'profile', icon: <PersonIcon />, path: 'profile' },
        { text: 'notification', icon: <NotificationsIcon />, path: 'notifications' },
        { text: 'matched', icon: <CheckCircleOutlineIcon />, path: 'matched' },
        { text: 'setting', icon: <SettingsIcon />, path: 'setting' },
        { text: 'logout', icon: <LogoutIcon />, onClick: logout },
      ];
      if (smSize) {
        items.splice(1, 0, { text: 'suggestion', icon: <AssignmentIndIcon />, path: 'home' });
      }
      return items;
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
        <Toolbar>
          <div style={
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexGrow: 1
            }
          }>
            {(location.pathname !== '/' && !smSize) &&
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => navigate('/')}
                color="primary"
              >
                <ArrowBackIcon />
              </IconButton>
            }
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            {(location.pathname === '/' || smSize) &&
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="primary"
              >
                <MoreHorizIcon />
              </IconButton>
            }
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
              {menuItems().map(item => (
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
          <div style={{ flexGrow: 1 }}> </div>
          <div
            onClick={toggleDrawer(false)}
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => navigate('/feedback')}
              color="primary"
            >
              <HelpOutlineIcon />
            </IconButton>
          </div>
        </SwipeableDrawer>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/matched" element={<MatchedUsers />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/modifyPassword" element={<ModifyPassword />} />
          <Route path="/deleteAccount" element={<DeleteAccount />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
