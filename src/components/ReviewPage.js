import React from 'react';
import { useIntl } from 'react-intl';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import Chip from '@mui/material/Chip';

const IMAGE_SIZE = '120px';

const profileFields = ['name', 'gender', 'age', 'job'];
const tagsFields = ['skill', 'interest', 'wantingToLearn'];
const photoStyle = {
  borderRadius: '8px',
  border: '#888 solid 1px',
  width: IMAGE_SIZE,
  height: IMAGE_SIZE,
};

function ProfileItem({ label, text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Typography component="h1" variant="h6">{label}</Typography>
      <div style={{ width: '8px' }}></div>
      <Typography component="h1" variant="h6">{text}</Typography>
    </div>
  );
}

function TagsItem({ label, tags }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
      <Typography component="h1" variant="h6">{label}</Typography>
      <div style={{ width: '8px' }}></div>
      {tags.map(tag => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={{ marginRight: 1, marginTop: '2px', marginButtom: '2px' }}
        />
      ))}
    </div>
  );
}

const ReviewPage = ({ profileData }) => {
  const { formatMessage } = useIntl();

  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ backgroundColor: 'white' }}>
            <Stack paddingBottom={2} spacing={2}>
              {profileFields.map(f => (
                <ProfileItem
                  key={f}
                  label={formatMessage({ id: `reviewPage.field.${f}` })}
                  text={profileData[f]}
                />
              ))}
            </Stack>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ backgroundColor: 'white', display: 'flex', justifyContent: 'flex-end' }}
          >
            {profileData.avatar ?
              <div style={{ ...photoStyle, backgroundImage: `url(${profileData.avatar})` }} /> :
              <div style={{ ...photoStyle, backgroundColor: '#999' }}>
                <PersonIcon sx={{ width: IMAGE_SIZE, height: IMAGE_SIZE }} />
              </div>
            }
          </Grid>
          <Grid item xs={12}>
            <Stack paddingBottom={2} spacing={2}>
              <ProfileItem label={formatMessage({ id: 'reviewPage.field.tags' })} text="" />
              {tagsFields.map(f => (
                <TagsItem
                  key={f}
                  label={formatMessage({ id: `reviewPage.field.${f}` })}
                  tags={profileData[f]}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

    </Container>
  );
};

export default ReviewPage;
