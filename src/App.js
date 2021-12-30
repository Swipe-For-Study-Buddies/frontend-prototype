import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';

import Home from './components/Home';
import Profile from "./components/Profile";
// import AuthService from './services/auth.service';
// import ContextStore from './common/context';

function App() {
  // const { currentUser, setCurrentUser } = useContext(ContextStore);

  // const logOut = () => {
  //   AuthService.logout();
  //   setCurrentUser(undefined);
  // };

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      {/* <Route exact path="/login" element={<Login />} /> */}
      <Route exact path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
