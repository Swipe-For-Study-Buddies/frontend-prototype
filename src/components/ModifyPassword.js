import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

import UserService from '../services/user.service';

function ModifyPassword() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [page, setPage] = useState('modifyPassword');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});

  const oldPasswordError = error.oldPassword ?? '';
  const passwordError = error.password ?? '';
  const confirmPasswordError = error.confirmPassword ?? '';

  async function onSubmit() {
    if (page === 'modifyPassword') {
      try {
        await UserService.modifyPassword({ oldPassword, newPassword: password });
        setPage('success');
      } catch (err) {
        const msg = err?.response?.data?.message ?? '';
        if (msg === 'WrongPassword') {
          setError(e => ({ ...e, password: formatMessage({ id: 'modifyPassword.error.wrongPassword' }) }));
        }
      }
    } else if (page === 'success') {
      navigate('/');
    }
  }

  const buttonStatus = () => {
    if (page === 'modifyPassword') {
      return (oldPassword !== '' &&
        !oldPasswordError &&
        password !== '' &&
        !passwordError &&
        confirmPassword !== '' &&
        !confirmPasswordError);
    }
    return true;
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
            <FormattedMessage id={`modifyPassword.form.${page}`} />
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            {page === 'modifyPassword' && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label={formatMessage({ id: 'modifyPassword.form.oldPassword' })}
              type="password"
              value={oldPassword}
              onChange={e => {
                if (e.target.value === '') {
                  setError(e => ({ ...e, password: formatMessage({ id: 'modifyPassword.error.emptyPassword' }) }));
                } else if (passwordError !== '') {
                  setError(e => ({ ...e, password: '' }));
                }
                setOldPassword(e.target.value);
              }}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  onSubmit();
                }
              }}
              error={!!passwordError}
              helperText={passwordError}
            />}
            {page === 'modifyPassword' && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label={formatMessage({ id: 'modifyPassword.form.password' })}
              type="password"
              value={password}
              onChange={e => {
                if (e.target.value === '') {
                  setError(e => ({ ...e, oldPassword: formatMessage({ id: 'modifyPassword.error.emptyPassword' }) }));
                } else if (oldPasswordError !== '') {
                  setError(e => ({ ...e, oldPassword: '' }));
                }
                setPassword(e.target.value);
              }}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  onSubmit();
                }
              }}
              error={!!oldPasswordError}
              helperText={oldPasswordError}
            />}
            {page === 'modifyPassword' && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label={formatMessage({ id: 'modifyPassword.form.confirmPassword' })}
              type="password"
              value={confirmPassword}
              onChange={e => {
                if (e.target.value !== password) {
                  setError(e => ({ ...e, confirmPassword: formatMessage({ id: 'modifyPassword.error.confirmPassword' }) }));
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
              <FormattedMessage
                id={page === 'modifyPassword' ? `modifyPassword.form.${page}` : 'button.back'}
              />
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ModifyPassword;
