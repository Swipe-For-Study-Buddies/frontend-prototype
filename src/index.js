import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Snackbar from '@mui/material/Snackbar';

import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import ActivateAccount from './components/ActivateAccount';

import './index.css';
import App from './App';
import i18n from './i18n/i18n';
// import reportWebVitals from './reportWebVitals';
import ContextStore from './common/context';

const cache = createIntlCache();
const intl = createIntl({
  locale: 'zh-TW',
  messages: i18n
}, cache);

function NoAuth() {
  return (
    <Routes>
      <Route exact path="/activateAccount/:token" element={<ActivateAccount />} />
      <Route exact path="/resetPassword/:token" element={<ResetPassword />} />
      <Route path="/signup" element={<Login defaultPage='signup' />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

function Root() {
  const theme = useTheme();
  const mdSize = useMediaQuery(theme.breakpoints.up('md'));
  const [snackPack, setSnackPack] = useState([]);
  const [openMessage, setOpenMessage] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  const [currentUser, setCurrentUser] = useState(undefined);
  const contextValue = useMemo(
    () => ({ currentUser, setCurrentUser, addMessage: (message) => {
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    } }),
    [currentUser]
  );

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpenMessage(true);
    } else if (snackPack.length && messageInfo && openMessage) {
      // Close an active snack when a new one is added
      setOpenMessage(false);
    }
  }, [snackPack, messageInfo, openMessage]);

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMessage(false);
  };

  const handleMessageExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <ContextStore.Provider value={{ ...contextValue }}>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={openMessage}
        autoHideDuration={4000}
        onClose={handleMessageClose}
        TransitionProps={{ onExited: handleMessageExited }}
        message={messageInfo ? messageInfo.message : undefined}
        ContentProps={mdSize ? {} : { sx: { display: 'flex', justifyContent: 'center' } }}
      />
      {currentUser ? <App /> : <NoAuth />}
    </ContextStore.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <RawIntlProvider value={intl}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </RawIntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
