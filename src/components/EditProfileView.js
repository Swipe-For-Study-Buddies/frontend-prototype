import React, { useState, useContext, useImperativeHandle, forwardRef, useRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

import MuiDatePicker from './MuiDatePicker';
import ContextStore from '../common/context';

const IMAGE_SIZE = '75px';

const groupProfiles = [
  { name: 'avatar', type: 'image' },
  { name: 'name', type: 'text', required: true },
  { name: 'gender', type: 'select', options: ['male', 'female'] },
  { name: 'birthday', type: 'date', required: true },
  { name: 'job', type: 'text' },
].map(i => ({ ...i, required: i.required || false }));

const fields = [...groupProfiles];

const EditProfileView = forwardRef((props, ref) => {
  const fileSelector = useRef();
  const { formatMessage } = useIntl();
  const { currentUser } = useContext(ContextStore);
  const [profileData, setProfileData] = useState({
    avatar: currentUser.avatar ?? '',
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

  function selectPhoto() {
    fileSelector.current.click();
  }

  function onSelectFile(event) {
    // TODO: 這裡可能要把圖縮小一下, 應該有 200x200 左右的解析度就可以了
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = (event) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const max_size = 200;
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        updateProfileData({ name: 'avatar', type: 'image' }, dataUrl);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
    } else if (type === 'image') {
      return <div key={filedName} onClick={selectPhoto} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'underline' }}>
        {value ? (
          <div style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius:'50% 50%', backgroundSize: 'cover', backgroundImage: `url(${value})` }} />
        ) : (
          <Avatar sx={{ cursor: 'pointer', width: IMAGE_SIZE, height: IMAGE_SIZE, m: 1, bgcolor: 'secondary.main' }}>
            <PersonIcon sx={{ width: IMAGE_SIZE, height: IMAGE_SIZE }} />
          </Avatar>
        )}
        <Typography component="h1" variant="subtitle1" align={mdSize ? 'left' : 'center'} sx={{ cursor: 'pointer' }}>
          <FormattedMessage id={'profile.selectPhoto'} />
        </Typography>
        <input ref={fileSelector} type="file" accept="image/*" style={{ display: 'none' }} onChange={onSelectFile} />
      </div>;
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
    <Paper elevation={mdSize ? 3 : 0}>
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
