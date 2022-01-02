import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

import AuthService from '../services/auth.service';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [page, setPage] = useState('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackPack, setSnackPack] = useState([]);
  const [openMessage, setOpenMessage] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);
  const [error, setError] = useState({});

  const passwordError = error.password ?? '';
  const confirmPasswordError = error.confirmPassword ?? '';

  useEffect(() => {
    if (token) {
      AuthService.verifyResetPasswordToken({ token }).then(() => {
        setPage('resetPassword');
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

  async function onSubmit() {
    if (page === 'resetPassword') {
      try {
        await AuthService.resetPassword({ password, token });
        // TODO: 切到登入頁, 顯示訊息
        setSnackPack((prev) => [
          ...prev,
          {
            message: formatMessage({ id: 'resetPassword.form.success' }),
            key: new Date().getTime()
          }
        ]);
        navigate('/', { replace: true });
        // setCurrentUser(profile)
      } catch (err) {
        const msg = err?.response?.data?.message ?? '';
        if (msg === 'InvalidToken') {
          setPage('invalidToken');
        } else if (msg === 'TokenExpired') {
          setPage('tokenExpired');
        }
      }
    }
  }

  function switchPage(e, newPage) {
    e.stopPropagation();
    e.preventDefault();
    setPage(newPage);
  }

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMessage(false);
  };

  const handleMessageExited = () => {
    setMessageInfo(undefined);
  };

  const buttonStatus = () => {
    if (page === 'resetPassword') {
      return (password !== '' &&
        !passwordError &&
        confirmPassword !== '' &&
        !confirmPasswordError);
    }
    return false;
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
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
      />
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
            {['resetPassword', 'loading'].includes(page) ?
              <FormattedMessage id={`resetPassword.form.${page}`} /> :
              <FormattedMessage id={`resetPassword.error.${page}`} />
            }
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            {page === 'resetPassword' && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={formatMessage({ id: 'resetPassword.form.password' })}
              type="password"
              id="password"
              onChange={e => {
                if (e.target.value === '') {
                  setError(e => ({ ...e, password: formatMessage({ id: 'resetPassword.error.emptyPassword' }) }));
                } else if (passwordError !== '') {
                  setError(e => ({ ...e, password: '' }));
                }
                setPassword(e.target.value);
              }}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  onSubmit();
                }
              }}
              error={!!passwordError}
              helperText={passwordError}
            />}
            {page === 'resetPassword' && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={formatMessage({ id: 'resetPassword.form.confirmPassword' })}
              type="password"
              id="confirmPassword"
              onChange={e => {
                if (e.target.value !== password) {
                  setError(e => ({ ...e, confirmPassword: formatMessage({ id: 'resetPassword.error.confirmPassword' }) }));
                } else {
                  setError(e => ({ ...e, confirmPassword: '' }));
                }
                setConfirmPassword(e.target.value);
              }}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  onSubmit();
                }
              }}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
            />}
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={onSubmit}
              disabled={!buttonStatus()}
            >
              <FormattedMessage id={`resetPassword.form.${page}`} />
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2" onClick={e => switchPage(e, 'login')}>
                  <FormattedMessage id="resetPassword.form.loginPage" />
                </Link>
              </Grid>
              <Grid item>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ResetPassword;
