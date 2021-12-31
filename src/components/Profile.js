import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const numberRule = /[^0-9]/g
const groupProfiles = [
  { name: 'name', type: 'text', required: true },
  { name: 'gender', type: 'select', options: ['male', 'female'] },
  { name: 'age', type: 'text', allowCharacter: numberRule },
  { name: 'job', type: 'text' },
]

const groupTags = [
  { name: 'interest', type: 'popup' },
  { name: 'skill', type: 'popup' },
  { name: 'wantingToLearn', type: 'popup' },
]

const groupContacts = [
  { name: 'contacts', type: 'contacts' }
]

const Profile = () => {
  const { formatMessage } = useIntl()
  // const [fields, setFields] = useState([
  //   'name', 'gender', 'age', 'job',
  //   'interest', 'skill', 'wantingToLearn',
  //   'contacts'
  // ])
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    age: '',
    job: '',
    interest: '',
    skill: [],
    wantingToLearn: [],
    contacts: []
  })

  function updateProfileData({ name, type, allowCharacter, maxLength }, value) {
    setProfileData(profile => {
      let newValue = value
      if (allowCharacter) {
        newValue = newValue.replace(allowCharacter, '')
      }
      if (maxLength) {
        newValue = newValue.substring(0, maxLength)
      }
      if (newValue === undefined || profile[name] === newValue) {
        return profile;
      }
      return { ...profile, [name]: newValue }
    })
  }

  function createField(field) {
    const { type, name: filedName, options } = field
    const { [field.name]: value } = profileData

    if (type === 'text') {
      return <TextField
        key={filedName}
        required={field.required}
        type="text"
        size="small"
        label={formatMessage({ id: `profile.${filedName}` })}
        onChange={e => { updateProfileData(field, e.target.value) }}
        value={value}
        // error={setProfileData[`${field.name}_err`] ? true : false}
        // helperText={setProfileData[`${field.name}_err`]}
        fullWidth
        sx={{ background: '#fff' }}
      />
    } else if (type === 'select') {
      return <TextField
        select
        key={filedName}
        required={field.required}
        type="text"
        size="small"
        label={formatMessage({ id: `profile.${filedName}` })}
        onChange={e => { updateProfileData(field, e.target.value) }}
        value={value}
        // error={setProfileData[`${field.name}_err`] ? true : false}
        // helperText={setProfileData[`${field.name}_err`]}
        fullWidth
        sx={{ background: '#fff' }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {formatMessage({ id: `profile.option.${filedName}.${option}` })}
          </MenuItem>
        ))}
      </TextField>
    } else if (type === 'popup') {
      return <TextField
        key={filedName}
        required={field.required}
        type="text"
        size="small"
        label={formatMessage({ id: `profile.${filedName}` })}
        // onChange={e => {updateProfileData(field, e.target.value)}}
        value={value}
        // error={setProfileData[`${field.name}_err`] ? true : false}
        // helperText={setProfileData[`${field.name}_err`]}
        fullWidth
        sx={{ background: '#fff' }}
      />
    } else if (type === 'contacts') {
      return <TextField
        key={filedName}
        required={field.required}
        type="text"
        size="small"
        label={formatMessage({ id: `profile.${filedName}` })}
        // onChange={e => {updateProfileData(field, e.target.value)}}
        value={value}
        // error={setProfileData[`${field.name}_err`] ? true : false}
        // helperText={setProfileData[`${field.name}_err`]}
        fullWidth
        sx={{ background: '#fff' }}
      />
    }
    return null
  }

  return (
    <Grid container padding={2} spacing={2}>
      <Grid item xs={12} sm={12} md={6}>
        <Paper elevation={3}>
          <Stack padding={2} spacing={2}>
            <Typography component="h1" variant="h5">
              <FormattedMessage id={'profile.title'} />
            </Typography>
            {groupProfiles.map(field => (
              createField(field)
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Paper elevation={3}>
          <Stack padding={2} spacing={2}>
            <Typography component="h1" variant="h5">
              <FormattedMessage id={'profile.tags'} />
            </Typography>
            {groupTags.map(field => (
              createField(field)
            ))}
            <Typography component="h1" variant="h5">
              <FormattedMessage id={'profile.contacts'} />
            </Typography>
            {groupContacts.map(field => (
              createField(field)
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
