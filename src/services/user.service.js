import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../common/constants.js';

const USER_API_URL = `${API_URL}user/`

const getUserProfile = async () => {
  try {
    const res = await axios.get(USER_API_URL + 'getUserProfile', { headers: authHeader() })
    return res
  } catch (error) {
    return
  }
};

const setUserProfile = async () => {
  // TODO: 實作 setUserProfile API
};

const exportedObject = {
  getUserProfile,
  setUserProfile
}

export default exportedObject
