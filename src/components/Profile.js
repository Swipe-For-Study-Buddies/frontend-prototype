import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';

import SelectTagsDialog from './SelectTagsDialog';

// TODO: 從 backend 把所有的聯絡方式選項撈回來
const contactOptions = [
  'Email', 'FaceBook', 'Line', 'Telegram', 'WhatsApp', '電話'
]

// TODO: 從 backend 把所有的 tag 撈回來
const interestTags = [
  '養魚', '爬山', '逛街', '旅行', '烹飪', '看電影', '健身'
].map(tag => ({name: tag, key: btoa(unescape(encodeURIComponent(tag.toLocaleLowerCase())))}))
const skillTags = [
  '養魚', '英文', '中文', '日文', '台語', 'C++', 'C#', 'Swift', 'Java', 'Javascript', 'Rust'
].map(tag => ({name: tag, key: btoa(unescape(encodeURIComponent(tag.toLocaleLowerCase())))}))

const tagMapping = {interest: interestTags, skill: skillTags, wantingToLearn: skillTags}

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
    interest: [],
    skill: [],
    wantingToLearn: [],
    contacts: []
  })
  const [tagsDialog, setTagsDialog] = useState('');

  function onTagsChanged(tags) {
    setProfileData(profile => ({...profile, [tagsDialog]: tags}))
  }

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
    const { type, name: filedName, options, required = false } = field
    const { [field.name]: value } = profileData

    if (type === 'text') {
      return <TextField
        key={filedName}
        required={field.required}
        type="text"
        variant="outlined"
        label={formatMessage({ id: `profile.${filedName}` })}
        onChange={e => { updateProfileData(field, e.target.value) }}
        value={value}
        // error={setProfileData[`${field.name}_err`] ? true : false}
        // helperText={setProfileData[`${field.name}_err`]}
        fullWidth
      />
    } else if (type === 'select') {
      return <TextField
        select
        key={filedName}
        required={required}
        type="text"
        variant="outlined"
        label={formatMessage({ id: `profile.${filedName}` })}
        onChange={e => { updateProfileData(field, e.target.value) }}
        value={value}
        // error={setProfileData[`${field.name}_err`] ? true : false}
        // helperText={setProfileData[`${field.name}_err`]}
        fullWidth
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {formatMessage({ id: `profile.option.${filedName}.${option}` })}
          </MenuItem>
        ))}
      </TextField>
    } else if (type === 'popup') {
      return <FormControl key={filedName} sx={{ m: 1 }}>
        <InputLabel sx={{backgroundColor: '#fff', paddingLeft: .5, paddingRight: .5}}>{formatMessage({ id: `profile.${filedName}` })}</InputLabel>
        <Select
          multiple
          value={value.map(v => v.name)}
          onClick={(e) => {e.preventDefault();e.stopPropagation();setTagsDialog(filedName)}}
          input={<OutlinedInput />}
          SelectDisplayProps={{onMouseDown: (e) => {e.preventDefault()}}}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip size="small" key={value} label={value} />
              ))}
            </Box>
          )}
        >
        <div />
        </Select>
      </FormControl>
    } else if (type === 'contacts') {
      return
    }
    return null
  }

  function updateContactData(index, field, value) {
    setProfileData(profile => {
      const newContacts = [...profile.contacts]
      newContacts[index][field] = value
      return {...profile, contacts: newContacts}
    })
  }

  function addContact() {
    setProfileData(profile => ({...profile, contacts: [...profile.contacts, {contactName: '', contactData: ''}]}))
  }

  function onApply() {
    // TODO: 檢查必填欄位, 整理欄位資料, 呼叫 backend API
    // console.log(profileData)
  }

  return (
    <>
      {tagsDialog && <SelectTagsDialog
        defaultSelectedItems={profileData[tagsDialog]}
        handleClose={() => setTagsDialog('')}
        handleSave={onTagsChanged}
        tags={tagMapping[tagsDialog]}
      />}
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
              <div style={{display: 'flex'}}>
                <Typography component="h1" variant="h5" sx={{flexGrow: 1}}>
                  <FormattedMessage id={'profile.contacts'} />
                </Typography>
                <Tooltip title={formatMessage({ id: 'profile.addContact' })}>
                  <IconButton color="primary" onClick={addContact}>
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {profileData.contacts.map((contact, index) => (
                <Box key={`contacts-${index}`} sx={{ display: 'flex', gap: 1 }}>
                  <Autocomplete
                    sx={{ minWidth: '140px' }}
                    freeSolo
                    options={contactOptions.map((option) => option)}
                    onInputChange={(e, v) => {updateContactData(index, 'contactName', v)}}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        value={contact.contactName}
                        required
                        label={formatMessage({ id: 'profile.contacts' })}
                      />
                    }
                  />
                  <TextField
                    required
                    type="text"
                    label={formatMessage({ id: 'profile.contactData' })}
                    onChange={e => {updateContactData(index, 'contactData', e.target.value)}}
                    value={contact.contactData}
                    fullWidth
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={onApply} color="primary">
              <FormattedMessage id="button.save" />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
