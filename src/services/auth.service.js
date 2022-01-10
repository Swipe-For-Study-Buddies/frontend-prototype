import axios from 'axios';
import { API_URL } from '../common/constants.js';

const AUTH_API_URL = `${API_URL}auth/`;

const register = async ({ email, password }) => {
  await axios.post(AUTH_API_URL + 'register', {
    email,
    username: email,
    password,
  });
  return;
};

const activateAccount = async ({ token }) => {
  await axios.post(AUTH_API_URL + 'activateAccount', {
    token
  });
  return;
};

const login = async ({ email, password }) => {
  const res = await axios.post(AUTH_API_URL + 'login', {
    email,
    username: email,
    password,
  });
  const { access: token, ...profile } = res.data;
  localStorage.setItem('accessToken', token);
  return profile;
};

const logout = () => {
  localStorage.removeItem('accessToken');
};

const getResetPasswordToken = async ({ email }) => {
  // 取得重設密碼用的 URL (寄到信箱)
  await axios.post(AUTH_API_URL + 'getResetPasswordToken', {
    email
  });
  return;
};

const verifyResetPasswordToken = async ({ token }) => {
  await axios.post(AUTH_API_URL + 'verifyResetPasswordToken', {
    token
  });
  return;
};

const resetPassword = async ({ password, token }) => {
  // 重設密碼
  await axios.post(AUTH_API_URL + 'resetPassword', {
    password,
    token
  });
  return;
};

const exportedObject = {
  register,
  activateAccount,
  login,
  logout,
  getResetPasswordToken,
  verifyResetPasswordToken,
  resetPassword,
};

export default exportedObject;
