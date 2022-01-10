import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../common/constants.js';

const USER_API_URL = `${API_URL}user/`;

const getUserProfile = async () => {
  try {
    const res = await axios.get(USER_API_URL + 'getUserProfile', { headers: authHeader() });
    return res.data;
  } catch (error) {
    return;
  }
};

const setUserProfile = async (profile) => {
  try {
    const res = await axios.post(
      USER_API_URL + 'setUserProfile',
      profile,
      { headers: authHeader() });
    return res.data;
  } catch (error) {
    return;
  }
};

const getSuggestions = async () => {
  try {
    const res = await axios.get(USER_API_URL + 'getSuggestions', { headers: authHeader() });
    return res.data;
  } catch (error) {
    return;
  }
};

const getNotifications = async () => {
  try {
    const res = await axios.get(USER_API_URL + 'getNotifications', { headers: authHeader() });
    return res.data;
  } catch (error) {
    return;
  }
};

const approveSuggestion = async ({ id }) => {
  try {
    const res = await axios.post(
      USER_API_URL + 'approveSuggestion',
      { id },
      { headers: authHeader() });
    return res.data;
  } catch (error) {
    return;
  }
};

const rejectSuggestion = async ({ id }) => {
  try {
    const res = await axios.post(
      USER_API_URL + 'rejectSuggestion',
      { id },
      { headers: authHeader() });
    return res.data;
  } catch (error) {
    return;
  }
};

const exportedObject = {
  getUserProfile,
  setUserProfile,
  getSuggestions,
  approveSuggestion,
  rejectSuggestion,
  getNotifications,
};

export default exportedObject;
