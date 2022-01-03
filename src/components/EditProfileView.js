import React, { useState, useContext, useImperativeHandle, forwardRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MuiDatePicker from './MuiDatePicker';
import ContextStore from '../common/context';

const groupProfiles = [
  { name: 'name', type: 'text', required: true },
  { name: 'gender', type: 'select', options: ['male', 'female'] },
  { name: 'birthday', type: 'date', required: true },
  { name: 'job', type: 'text' },
].map(i => ({ ...i, required: i.required || false }));

const fields = [...groupProfiles];

const EditProfileView = forwardRef((props, ref) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useContext(ContextStore);
  const [profileData, setProfileData] = useState({
    name: currentUser.name ?? '',
    gender: currentUser.gender ?? '',
    birthday: currentUser.birthday ?? null,
    job: currentUser.job ?? '',
  });

  const theme = useTheme();
  const mdSize = useMediaQuery(theme.breakpoints.up('md'));

  useImperativeHandle(
    ref, () => ({
      getContent: () => {
        return _getContent();
      }
    }),
  );

  function validateField(field, value) {
    if (field.required &&
      ((typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0))) {
      return formatMessage({ id: 'form.isRequired' });
    }

    if (field.name === 'birthday') {
      if (value === null) {
        return formatMessage({ id: 'form.isRequired' });
      } else if (value.toString() === 'Invalid Date') {
        return formatMessage({ id: 'form.dateFormatError' });
      } else {
        if (dayjs(value).format('YYYY-MM-DD') > dayjs().format('YYYY-MM-DD')) {
          return formatMessage({ id: 'form.dateAfterToday' });
        }
      }
    }
    return '';
  }

  function updateProfileData(field, value) {
    const { name, allowCharacter, maxLength } = field;
    setProfileData(profile => {
      let newValue = value;
      if (allowCharacter) {
        newValue = newValue.replace(allowCharacter, '');
      }
      if (maxLength) {
        newValue = newValue.substring(0, maxLength);
      }
      if (newValue === undefined || profile[name] === newValue) {
        return profile;
      }

      let err = validateField(field, value);
      return { ...profile, [name]: newValue, [`${name}_err`]: err };
    });
  }

  function createField(field) {
    const { type, name: filedName, options, required = false } = field;
    const { [filedName]: value, [`${filedName}_err`]: err } = profileData;

    if (type === 'text') {
      return <TextField
        key={filedName}
        required={required}
        type="text"
        variant="outlined"
        label={formatMessage({ id: `profile.${filedName}` })}
        onChange={e => { updateProfileData(field, e.target.value); }}
        value={value}
        error={!!err}
        helperText={err}
        fullWidth
      />;
    } else if (type === 'select') {
      return <TextField
        select
        key={filedName}
        required={required}
        type="text"
        variant="outlined"
        label={formatMessage({ id: `profile.${filedName}` })}
        onChange={e => { updateProfileData(field, e.target.value); }}
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
      </TextField>;
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
      />;
    }
    return null;
  }

  function _getContent() {
    // 檢查必填欄位, 整理欄位資料, 呼叫 backend API

    // const data = structuredClone(profileData)
    const data = JSON.parse(JSON.stringify(profileData));

    // 檢查必填欄位是否都填了值
    const errors = {};
    for (const field of fields) {
      const err = validateField(field, data[field.name]);
      if (err) {
        errors[`${field.name}_err`] = formatMessage({ id: 'form.isRequired' });
      }
    }
    if (Object.keys(errors).length > 0) {
      Object.assign(data, errors);
      setProfileData({ ...profileData, ...errors });
    }

    for (const field of fields) {
      if (data[`${field.name}_err`] !== undefined && data[`${field.name}_err`] !== '') {
        return;
      }
    }

    // 移除 error message
    Object.keys(data).forEach(key => {
      if (key.endsWith('_err')) {
        delete data[key];
      }
    });

    return data;
  }

  return (
    <Paper elevation={3}>
      <Stack padding={2} spacing={2}>
        <Typography component="h1" variant="h5" align={mdSize ? 'left' : 'center'}>
          <FormattedMessage id={'profile.title'} />
        </Typography>
        {groupProfiles.map(field => (
          createField(field)
        ))}
      </Stack>
    </Paper>
  );
});

EditProfileView.displayName = 'EditProfileView';

export default EditProfileView;
