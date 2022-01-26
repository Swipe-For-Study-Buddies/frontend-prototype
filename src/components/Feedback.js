import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import Typography from '@mui/material/Typography';

import UserService from '../services/user.service';

function Feedback() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [page, setPage] = useState('main');
  const [content, setContent] = useState('');

  async function onSubmit() {
    if (page === 'main') {
      try {
        await UserService.sendFeedback({ content });
        setPage('message');
      } catch (err) {
      }
    } else {
      navigate('/');
    }
  }

  const buttonStatus = () => {
    return page !== 'main' || content.trim() !== '';
  };

  return (
    <Grid container component="main" sx={{ justifyContent: 'center', height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} >
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
            <FeedbackOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            <FormattedMessage id={`feedback.${page}`} />
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            {page === 'main' && <TextField
              variant="outlined"
              margin="normal"
              multiline
              required
              fullWidth
              label={formatMessage({ id: 'feedback.content' })}
              onChange={e => {
                setContent(e.target.value);
              }}
              autoFocus
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
              <FormattedMessage id={`button.${page === 'main' ? 'submit' : 'back'}`} />
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Feedback;
