import React, { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';

import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiIconButton from '@mui/material/IconButton';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack';
import MuiFab from '@mui/material/Fab';

import ReviewPage from './ReviewPage';
import UserService from '../services/user.service';
// import ReviewPage from './ReviewPage';

const IMAGE_SIZE = '60px';

const Fab = styled(MuiFab)(({ theme, type }) => ({
  backgroundColor: type === 'error' ? 'rgb(223, 165, 173)' : 'rgb(157, 213, 207)',
  color: type === 'error' ? 'rgb(197, 85, 99)' : 'rgb(81, 171, 159)',
  ':hover': {
    backgroundColor: type === 'error' ? 'rgba(223, 165, 173, .9)' : 'rgba(157, 213, 207, .9)',
  },
  margin: '0px 32px'
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IconButton = styled(MuiIconButton)(({ theme, type }) => ({
  // backgroundColor: type === 'error' ? 'rgb(223, 165, 173)' : 'rgb(157, 213, 207)',
  color: type === 'error' ? 'rgb(197, 85, 99)' : 'rgb(81, 171, 159)',
  // ':hover': {
  //   backgroundColor: type === 'error' ? 'rgba(223, 165, 173, .9)' : 'rgba(157, 213, 207, .9)',
  // },
  // margin: '0px 32px'
}));

// 'approve'
// 'reject'
function NotificationItem({ profile, onSelect, review }) {
  const { formatMessage } = useIntl();

  function onClick(event) {
    event.stopPropagation();
    event.preventDefault();
    onSelect();
  }
  return (
    <div style={{ borderBottom: 'solid 1px #000', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Avatar sx={{ cursor: 'pointer', width: IMAGE_SIZE, height: IMAGE_SIZE, m: 1, bgcolor: 'secondary.main' }}>
        <PersonIcon sx={{ width: IMAGE_SIZE, height: IMAGE_SIZE }} />
      </Avatar>
      <div style={{ flexGrow: 1 }}>
        <Stack>
          <Typography variant="h6" gutterBottom component="div">
            {`${formatMessage({ id: 'notifications.user' })}${profile.name}`}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            <FormattedMessage id={'notifications.message'} />
          </Typography>
          <a href="/" onClick={onClick}>
            <Typography variant="subtitle1" gutterBottom component="div">
              <FormattedMessage id={'notifications.viewProfile'} />
            </Typography>
          </a>
        </Stack>
      </div>
      <IconButton size="large" type="error" onClick={() => review(profile.id, 'reject')}>
        <DoDisturbIcon fontSize="inherit" />
      </IconButton>
      <IconButton size="large" type="success" onClick={() => review(profile.id, 'approve')}>
        <CheckCircleOutlineIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
}

const Notifications = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [notifications, setNotifications] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  function formatData(data) {
    return {
      ...data,
      gender: data.gender ? formatMessage({ id: `profile.option.gender.${data.gender}` }) : ''
    };
  }

  useEffect(() => {
    UserService.getNotifications().then(notifications => {
      setNotifications(notifications);
    }).catch(() => {
      navigate('/', { replace: true });
    });
  }, [navigate]);

  async function review(id, action) {
    try {
      if (action === 'approve') {
        await UserService.approveSuggestion({ id });
      } else {
        await UserService.rejectSuggestion({ id });
      }
    } catch (error) {

    } finally {
      const index = notifications.findIndex(i => i.id === id);
      setNotifications(list => {
        list.splice(index, 1);
        return [...list];
      });
      if (selectedItem) {
        setSelectedItem(null);
      }
    }
  }

  return (
    <div className="container" style={{ borderTop: 'solid 1px #000' }}>
      <Dialog
        fullScreen
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        TransitionComponent={Transition}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => setSelectedItem(null)}
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
        {!!selectedItem && <>
          <ReviewPage profileData={formatData(selectedItem)} />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '16px 0px' }}>
            <Fab type="error" onClick={() => review(selectedItem.id, 'approve')}>
              <DoDisturbIcon />
            </Fab>
            <Fab type="success" onClick={() => review(selectedItem.id, 'reject')}>
              <CheckCircleOutlineIcon />
            </Fab>
          </div>
        </>}
      </Dialog>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} profile={notification} review={review} onSelect={() => setSelectedItem(notification)} />
      ))}
    </div>
  );
};

export default Notifications;
