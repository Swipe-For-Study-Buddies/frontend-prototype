import React, { useContext } from 'react';

import AuthService from "../services/auth.service";
import ContextStore from '../common/context';

const Home = () => {
  const { setCurrentUser } = useContext(ContextStore)
  function logout() {
    AuthService.logout();
    setCurrentUser(undefined);
  }
  return (
    <div className="container">
      <div style={{marginBottom: '20px'}}>HOME 頁面，還沒作好</div>
      <div onClick={logout}>登出</div>
    </div>
  );
};

export default Home;
