import React, { useState, useEffect, useContext } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

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

import Copyright from './Copyright';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import ContextStore from '../common/context';

function LoginForm({ defaultPage = 'login' }) {
  const { formatMessage } = useIntl();
  const [page, setPage] = useState(defaultPage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});
  const { setCurrentUser, addMessage } = useContext(ContextStore);

  const emailError = error.email ?? '';
  const passwordError = error.password ?? '';
  const confirmPasswordError = error.confirmPassword ?? '';

  useEffect(() => {
    UserService.getUserProfile().then(profile => {
      setCurrentUser(profile);
    });
  }, [setCurrentUser]);

  async function onSubmit() {
    if (page === 'login') {
      try {
        const profile = await AuthService.login({ email, password });
        setCurrentUser(profile);
      } catch (err) {
        const msg = err?.response?.data?.message ?? '';
        if (msg === 'UserNotFound') {
          setError({ email: formatMessage({ id: 'login.error.email' }) });
        } else if (msg === 'WrongPassword') {
          setError({ password: formatMessage({ id: 'login.error.password' }) });
        } else if (msg === 'NotActivatedAccount') {
          setError({ email: formatMessage({ id: 'login.error.notActivatedAccount' }) });
        }
      }
    } else if (page === 'signup') {
      try {
        await AuthService.register({ email, password });
        addMessage(formatMessage({ id: 'login.form.activateAccountMessage' }));
        setPage('login');
      } catch (ex) {
      }
    } else {
      try {
        await AuthService.getResetPasswordToken({ email });
        addMessage(formatMessage({ id: 'login.form.resetPasswordMessage' }));
        setPage('login');
      } catch (err) {
        console.log(err);
        const msg = err?.response?.data?.message ?? '';
        if (msg === 'UserNotFound') {
          setError({ email: formatMessage({ id: 'login.error.email' }) });
        } else if (msg === 'NotActivatedAccount') {
          setError({ email: formatMessage({ id: 'login.error.notActivatedAccount' }) });
        }
      }
    }
  }

  function switchPage(e, newPage) {
    e.stopPropagation();
    e.preventDefault();
    setPassword('');
    setConfirmPassword('');
    setPage(newPage);
    setError({});
  }

  const buttonStatus = () => {
    if (page === 'login') {
      return (email !== '' &&
        !emailError &&
        password !== '' &&
        !passwordError);
    } else if (page === 'signup') {
      return (email !== '' &&
        !emailError &&
        password !== '' &&
        !passwordError &&
        confirmPassword !== '' &&
        !confirmPasswordError);
    } else if (page === 'resetPassword') {
      return (email !== '');
    }
    return false;
  };

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
            <FormattedMessage id={`login.form.${page}`} />
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={formatMessage({ id: 'login.form.email' })}
              name="email"
              autoComplete="email"
              onChange={e => {
                if (e.target.value === '') {
                  setError(e => ({ ...e, email: formatMessage({ id: 'login.error.emptyEmail' }) }));
                } else if (emailError !== '') {
                  setError(e => ({ ...e, email: '' }));
                }
                // TODO: 檢查是否符合 email 格式
                setEmail(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
              autoFocus
              error={!!emailError}
              helperText={emailError}
            />
            {['login', 'signup'].includes(page) && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={formatMessage({ id: 'login.form.password' })}
              type="password"
              id="password"
              autoComplete={page === 'login' ? 'current-password' : ''}
              onChange={e => {
                if (e.target.value === '') {
                  setError(e => ({ ...e, password: formatMessage({ id: 'login.error.emptyPassword' }) }));
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
            {page === 'signup' && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={formatMessage({ id: 'login.form.confirmPassword' })}
              type="password"
              id="confirmPassword"
              onChange={e => {
                if (e.target.value !== password) {
                  setError(e => ({ ...e, confirmPassword: formatMessage({ id: 'login.error.confirmPassword' }) }));
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
              <FormattedMessage id={`login.form.${page}`} />
            </Button>
            <Grid container>
              <Grid item xs>
                {page === 'login' ? (
                  <>
                    <Link href="/" variant="body2" onClick={e => switchPage(e, 'resetPassword')}>
                      <FormattedMessage id="login.form.forgotPassword" />
                    </Link>
                    <span style={{ margin: '0px 8px' }}>/</span>
                    <Link href="/" variant="body2" onClick={e => switchPage(e, 'signup')}>
                      <FormattedMessage id="login.form.signup" />
                    </Link>
                  </>
                ) : (
                  <Link href="/" variant="body2" onClick={e => switchPage(e, 'login')}>
                    <FormattedMessage id="login.form.loginPage" />
                  </Link>
                )}
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

export default LoginForm;
