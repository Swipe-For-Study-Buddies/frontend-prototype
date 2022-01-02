import React, { useState, useContext, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import EditProfileView from './EditProfileView';
import EditTagsView from './EditTagsView';
import UserService from '../services/user.service';
import ContextStore from '../common/context';

const Profile = () => {
  const profileViewRef = useRef();
  const tagsViewRef = useRef();
  const theme = useTheme();
  const mdSize = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();
  const { setCurrentUser } = useContext(ContextStore);
  const [page, setPage] = useState('profile');

  function onApply() {
    const profileContent = profileViewRef.current.getContent();
    const tagsContent = tagsViewRef.current.getContent();

    if (!profileContent) { // 資料不完整, 切回 profile page
      setPage('profile');
      return;
    }

    if (!tagsContent) { // tag 不完整
      return;
    }

    // 到這邊已經可以 call API 把資料存下來了, 然後把使用者導向到 HOME 頁面.
    UserService.setUserProfile({ ...profileContent, ...tagsContent }).then(profile => {
      setCurrentUser(profile);
      navigate('/', { replace: true });
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <>
      <Grid container padding={2} spacing={2}>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ display: mdSize || page === 'profile' ? 'block' : 'none' }}
        >
          <EditProfileView ref={profileViewRef} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ display: mdSize || page === 'tags' ? 'block' : 'none' }}
        >
          <EditTagsView ref={tagsViewRef} />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={e => setPage('tags')}
              color="primary"
              sx={{ display: !mdSize && page === 'profile' ? 'block' : 'none' }}
            >
              <FormattedMessage id="button.continue" />
            </Button>
            <Button
              variant="contained"
              onClick={onApply}
              color="primary"
              sx={{ display: mdSize || page === 'tags' ? 'block' : 'none' }}
            >
              <FormattedMessage id="button.save" />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
