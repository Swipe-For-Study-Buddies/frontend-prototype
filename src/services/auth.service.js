import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../common/constants.js';

const register = async ({ email, password }) => {
  // TODO: 加入 error handling
  console.log(email, password)
  const res = await axios.post(API_URL + 'register', {
    email,
    password,
  })
  const { token } = res.data
  localStorage.setItem('accessToken', token)
};

const login = async ({ email, password }) => {
  const res = await axios.post(API_URL + 'login', {
    email,
    password,
  })
  const { token, ...profile } = res.data
  localStorage.setItem('accessToken', token)
  return profile
};

const logout = () => {
  localStorage.removeItem('accessToken');
};

const getResetPasswordToken = async ({ email }) => {
  // 取得重設密碼用的 URL (寄到信箱)
  await axios.post(API_URL + 'getResetPasswordToken', {
    email
  })
  return
};

const verifyResetPasswordToken = async ({ token }) => {
  await axios.post(API_URL + 'verifyResetPasswordToken', {
    token
  })
  return
};

const resetPassword = async ({ password, token }) => {
  // 重設密碼
  await axios.post(API_URL + 'resetPassword', {
    password,
    token
  })
  return
};

const getCurrentUser = async () => {
  try {
    const res = await axios.get(API_URL + 'me', { headers: authHeader() })

    return res
  } catch (error) {
    return
  }
};

const exportedObject = {
  register,
  login,
  logout,
  getResetPasswordToken,
  verifyResetPasswordToken,
  resetPassword,
  getCurrentUser,
}

export default exportedObject
