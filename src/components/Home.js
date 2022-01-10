import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { styled } from '@mui/material/styles';
import MuiFab from '@mui/material/Fab';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import UserService from '../services/user.service';
import ReviewPage from './ReviewPage';

const Fab = styled(MuiFab)(({ theme, type }) => ({
  backgroundColor: type === 'error' ? 'rgb(223, 165, 173)' : 'rgb(157, 213, 207)',
  color: type === 'error' ? 'rgb(197, 85, 99)' : 'rgb(81, 171, 159)',
  ':hover': {
    backgroundColor: type === 'error' ? 'rgba(223, 165, 173, .9)' : 'rgba(157, 213, 207, .9)',
  },
  margin: '0px 32px'
}));

function EmptyReviewPage() {
  return <div>沒有推薦人選了 QQ</div>;
}

const Home = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [suggestions, setSuggestions] = useState([]);

  function formatData(data) {
    return {
      ...data,
      gender: data.gender ? formatMessage({ id: `profile.option.gender.${data.gender}` }) : ''
    };
  }

  useEffect(() => {
    UserService.getSuggestions().then(suggestions => {
      setSuggestions(suggestions);
    }).catch(() => {
      navigate('/', { replace: true });
    });
  }, [navigate]);

  async function review(action) {
    const id = suggestions[0].id;
    try {
      if (action === 'approve') {
        await UserService.approveSuggestion({ id });
      } else {
        await UserService.rejectSuggestion({ id });
      }
    } catch (error) {

    } finally {
      setSuggestions(list => {
        list.shift();
        return [...list];
      });
    }
  }

  return (
    <div>
      {suggestions.length > 0 ?
        (<>
          <ReviewPage profileData={formatData(suggestions[0])} />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '16px 0px' }}>
            <Fab type="error" onClick={() => review('reject')}>
              <DoDisturbIcon />
            </Fab>
            <Fab type="success" onClick={() => review('approve')}>
              <CheckCircleOutlineIcon />
            </Fab>
          </div>
        </>) :
        <EmptyReviewPage />
      }
    </div>
  );
};

export default Home;
