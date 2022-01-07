import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

import Copyright from './Copyright';
import AuthService from '../services/auth.service';

function ActivateAccount() {
  const { token } = useParams();
  const [page, setPage] = useState('loading');

  useEffect(() => {
    if (token) {
      AuthService.activateAccount({ token }).then(() => {
        setPage('success');
      }).catch(err => {
        const msg = err?.response?.data?.message ?? '';
        if (msg === 'InvalidToken') {
          setPage('invalidToken');
        } else if (msg === 'TokenExpired') {
          setPage('tokenExpired');
        }
      });
    }
  }, [token]);

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(/background.png)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {['success', 'loading'].includes(page) ?
              <FormattedMessage id={`activateAccount.form.${page}`} /> :
              <FormattedMessage id={`activateAccount.error.${page}`} />
            }
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            <Link href={page === 'success' ? '/' : '/signup'} variant="body2">
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                <FormattedMessage
                  id={page === 'success' ? 'button.continue' : 'activateAccount.form.register'}
                />
              </Button>
            </Link>
            <Box mt={5}>
              <Copyright />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ActivateAccount;
