import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
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
  console.log('NoAuth');
  return (
    <Routes>
      <Route exact path="/resetPassword/:token" element={<ResetPassword />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

function Root() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const contextValue = useMemo(
    () => ({ currentUser, setCurrentUser }),
    [currentUser]
  );

  return (
    <ContextStore.Provider value={{ ...contextValue }}>
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
