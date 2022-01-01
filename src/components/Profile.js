import React, { useState, useContext } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';

import MuiDatePicker from './MuiDatePicker';
import SelectTagsDialog from './SelectTagsDialog';
import UserService from '../services/user.service';
import ContextStore from '../common/context';

// TODO: 從 backend 把所有的聯絡方式選項撈回來
const contactOptions = [
  'Email', 'FaceBook', 'Line', 'Telegram', 'WhatsApp', '電話'
]

// TODO: 從 backend 把所有的 tag 撈回來
const interestTags = [
  '養魚', '爬山', '逛街', '旅行', '烹飪', '看電影', '健身'
].map(tag => ({ name: tag, key: btoa(unescape(encodeURIComponent(tag.toLocaleLowerCase()))) }))
const skillTags = [
  '養魚', '英文', '中文', '日文', '台語', 'C++', 'C#', 'Swift', 'Java', 'Javascript', 'Rust'
].map(tag => ({ name: tag, key: btoa(unescape(encodeURIComponent(tag.toLocaleLowerCase()))) }))

const tagMapping = { interest: interestTags, skill: skillTags, wantingToLearn: skillTags }

// const numberRule = /[^0-9]/g
const groupProfiles = [
  { name: 'name', type: 'text', required: true },
  { name: 'gender', type: 'select', options: ['male', 'female'] },
  { name: 'birthday', type: 'date', required: true },
  { name: 'job', type: 'text' },
].map(i => ({ ...i, required: i.required || false }))

const groupTags = [
  { name: 'interest', type: 'popup' },
  { name: 'skill', type: 'popup', required: true },
  { name: 'wantingToLearn', type: 'popup', required: true },
].map(i => ({ ...i, required: i.required || false }))

const fields = [{ name: 'contacts', required: true }].concat(groupProfiles, groupTags)

const Profile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(ContextStore)
  const { formatMessage } = useIntl()
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    birthday: null,
    job: '',
    interest: [],
    skill: [],
    wantingToLearn: [],
    contacts: []
  })
  const [tagsDialog, setTagsDialog] = useState('');

  function onTagsChanged(tags) {
    setProfileData(profile => {
      const newProfile = { ...profile, [tagsDialog]: tags }
      if (tags.length > 0) {
        newProfile[`${tagsDialog}_err`] = ''
      }
      return newProfile
    })
  }

  function validateField(field, value) {
    if (field.required &&
      ((typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0))) {
      return formatMessage({ id: 'form.isRequired' })
    }

    if (field.name === 'birthday') {
      if (value === null) {
        return formatMessage({ id: 'form.isRequired' })
      } else if (value.toString() === 'Invalid Date') {
        return formatMessage({ id: 'form.dateFormatError' })
      } else {
        if (dayjs(value).format('YYYY-MM-DD') > dayjs().format('YYYY-MM-DD')) {
          return formatMessage({ id: 'form.dateAfterToday' })
        }
      }
    }

    return ''
  }

  function updateProfileData(field, value) {
    const { name, allowCharacter, maxLength } = field
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

      let err = validateField(field, value)
      return { ...profile, [name]: newValue, [`${name}_err`]: err }
    })
  }

  function createField(field) {
    const { type, name: filedName, options, required = false } = field
    const { [filedName]: value, [`${filedName}_err`]: err } = profileData

    if (type === 'text') {
      return <TextField
        key={filedName}
        required={required}
        type="text"
        variant="outlined"
        label={formatMessage({ id: `profile.${filedName}` })}
        onChange={e => { updateProfileData(field, e.target.value) }}
        value={value}
        error={!!err}
        helperText={err}
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
        error={!!err}
        helperText={err}
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
        <InputLabel error={!!err} required={required} sx={{ backgroundColor: '#fff', paddingLeft: .5, paddingRight: .5 }}>{formatMessage({ id: `profile.${filedName}` })}</InputLabel>
        <Select
          multiple
          value={value.map(v => v.name)}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTagsDialog(filedName) }}
          input={<OutlinedInput error={!!err} />}
          SelectDisplayProps={{ onMouseDown: (e) => { e.preventDefault() } }}
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
        {!!err && <FormHelperText error={!!err}>{err}</FormHelperText>}
      </FormControl>
    } else if (type === 'date') {
      return <MuiDatePicker
        key={filedName}
        fullWidth
        label={formatMessage({ id: `profile.${filedName}` })}
        value={value}
        onChange={date => updateProfileData(field, date)}
        invalidDateMessage={formatMessage({ id: 'form.dateFormatError' })}
        maxDateMessage={formatMessage({ id: 'form.dateAfterToday' })}
        maxDate={new Date()}
      />
    }
    return null
  }

  function updateContactData(index, field, value) {
    setProfileData(profile => {
      const newContacts = [...profile.contacts]
      newContacts[index][field] = value
      const newProfileData = { ...profile, contacts: newContacts }

      // 檢查是否有至少一種聯絡方式
      for (const contact of newContacts) {
        const contactName = contact.contactName.trim()
        const contactData = contact.contactData.trim()
        if (contactName && contactData) {
          delete newProfileData.contacts_err
          break
        }
      }
      return newProfileData
    })
  }

  function addContact() {
    setProfileData(profile => ({ ...profile, contacts: [...profile.contacts, { contactName: '', contactData: '' }] }))
  }

  function onApply() {
    // 檢查必填欄位, 整理欄位資料, 呼叫 backend API

    // 先清掉沒有完整設定的 contact
    // const data = structuredClone(profileData)
    const data = JSON.parse(JSON.stringify(profileData))
    for (let i = data.contacts.length - 1; i >= 0; --i) {
      const contact = data.contacts[i]
      const contactName = contact.contactName.trim()
      const contactData = contact.contactData.trim()
      if (!contactName || !contactData) {
        data.contacts.splice(i, 1)
      }
    }

    // 檢查必填欄位是否都填了值
    const errors = {}
    for (const field of fields) {
      const err = validateField(field, data[field.name])
      if (err) {
        errors[`${field.name}_err`] = formatMessage({ id: 'form.isRequired' })
      }
    }
    if (Object.keys(errors).length > 0) {
      setProfileData({ ...profileData, ...errors })
    }
    for (const field of fields) {
      if (data[`${field.name}_err`] !== undefined && data[`${field.name}_err`] !== '') {
        return
      }
    }

    // 整理 tags 欄位的資料
    for (const field of groupTags) {
      data[field.name] = data[field.name].map(tag => tag.name)
    }

    // 移除 error message
    Object.keys(data).forEach(key => {
      if (key.endsWith('_err')) {
        delete data[key]
      }
    })

    // 到這邊已經可以 call API 把資料存下來了, 然後把使用者導向到 HOME 頁面.
    UserService.setUserProfile(data).then(profile => {
      setCurrentUser(profile)
      navigate('/', { replace: true });
    }).catch(error => {
      console.log(error)
    })
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
              <div style={{ display: 'flex' }}>
                <Typography component="h1" variant="h5">
                  <FormattedMessage id={'profile.contacts'} />
                </Typography>
                {!!profileData.contacts_err ?
                  <FormHelperText error={!!profileData.contacts_err} sx={{ flexGrow: 1 }}>
                    {formatMessage({ id: 'form.needContact' })}
                  </FormHelperText> :
                  <div style={{ flexGrow: 1 }}> </div>
                }
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
                    onInputChange={(e, v) => { updateContactData(index, 'contactName', v) }}
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
                    onChange={e => { updateContactData(index, 'contactData', e.target.value) }}
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
