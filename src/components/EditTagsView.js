import React, { useState, useContext, useImperativeHandle, forwardRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

import SelectTagsDialog from './SelectTagsDialog';
import ContextStore from '../common/context';

const getHashKey = str => btoa(unescape(encodeURIComponent(str.toLocaleLowerCase())));

// TODO: 從 backend 把所有的 tag 撈回來
const interestTags = [
  '養魚', '爬山', '逛街', '旅行', '烹飪', '看電影', '健身'
].map(tag => ({ name: tag, key: getHashKey(tag) }));
const skillTags = [
  '養魚', '英文', '中文', '日文', '台語', 'C++', 'C#', 'Swift', 'Java', 'Javascript', 'Rust'
].map(tag => ({ name: tag, key: getHashKey(tag) }));

const tagMapping = { interest: interestTags, skill: skillTags, wantingToLearn: skillTags };

const groupTags = [
  { name: 'interest', type: 'popup' },
  { name: 'skill', type: 'popup', required: true },
  { name: 'wantingToLearn', type: 'popup', required: true },
].map(i => ({ ...i, required: i.required || false }));

const fields = [...groupTags];

const EditTagsView = forwardRef((props, ref) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useContext(ContextStore);

  const [tagsData, setTagsData] = useState({
    interest: Array.isArray(currentUser.interest) ?
      currentUser.interest.map(tag => ({ name: tag, key: getHashKey(tag) })) : [],
    skill: Array.isArray(currentUser.skill) ?
      currentUser.skill.map(tag => ({ name: tag, key: getHashKey(tag) })) : [],
    wantingToLearn: Array.isArray(currentUser.wantingToLearn) ?
      currentUser.wantingToLearn.map(tag => ({ name: tag, key: getHashKey(tag) })) : [],
  });
  const [tagsDialog, setTagsDialog] = useState('');

  useImperativeHandle(
    ref, () => ({
      getContent: () => {
        return _getContent();
      }
    }),
  );

  function onTagsChanged(tags) {
    setTagsData(profile => {
      const newProfile = { ...profile, [tagsDialog]: tags };
      if (tags.length > 0) {
        newProfile[`${tagsDialog}_err`] = '';
      }
      return newProfile;
    });
  }

  function validateField(field, value) {
    if (field.required &&
      ((typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0))) {
      return formatMessage({ id: 'form.isRequired' });
    }
    return '';
  }

  function createField(field) {
    const { type, name: filedName, required = false } = field;
    const { [filedName]: value, [`${filedName}_err`]: err } = tagsData;

    if (type === 'popup') {
      return <FormControl key={filedName} sx={{ m: 1 }}>
        <InputLabel error={!!err} required={required} sx={{ backgroundColor: '#fff', paddingLeft: .5, paddingRight: .5 }}>{formatMessage({ id: `profile.${filedName}` })}</InputLabel>
        <Select
          multiple
          value={value.map(v => v.name)}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTagsDialog(filedName); }}
          input={<OutlinedInput error={!!err} />}
          SelectDisplayProps={{ onMouseDown: (e) => { e.preventDefault(); } }}
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
      </FormControl>;
    }
    return null;
  }

  function _getContent() {
    // const data = structuredClone(tagsData)
    const data = JSON.parse(JSON.stringify(tagsData));

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
      setTagsData({ ...tagsData, ...errors });
    }
    for (const field of fields) {
      if (data[`${field.name}_err`] !== undefined && data[`${field.name}_err`] !== '') {
        return;
      }
    }

    // 整理 tags 欄位的資料
    for (const field of groupTags) {
      data[field.name] = data[field.name].map(tag => tag.name);
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
    <>
      {tagsDialog && <SelectTagsDialog
        defaultSelectedItems={tagsData[tagsDialog]}
        handleClose={() => setTagsDialog('')}
        handleSave={onTagsChanged}
        tags={tagMapping[tagsDialog]}
      />}
      <Paper elevation={3}>
        <Stack padding={2} spacing={2}>
          <Typography component="h1" variant="h5">
            <FormattedMessage id={'profile.tags'} />
          </Typography>
          {groupTags.map(field => (
            createField(field)
          ))}
        </Stack>
      </Paper>
    </>
  );
});

EditTagsView.displayName = 'EditTagsView';

export default EditTagsView;
