import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';

function SelectTagsDialog({ handleSave, handleClose, tags = [], defaultSelectedItems = [] }) {
  const { formatMessage } = useIntl();
  const [selectedTags, setSelectedTags] = useState(defaultSelectedItems);
  const [filterText, setFilterText] = useState('');
  const queryText = filterText.trim().toLowerCase();

  const selectedTagsMapping = useRef(defaultSelectedItems.reduce((acc, cur) => {
    acc[cur.key] = true;
    return acc;
  }, {}));
  const onApply = () => {
    handleSave([...selectedTags]);
    handleClose();
  };

  function addTag(tag) {
    if (!selectedTagsMapping.current[tag.key] ) {
      selectedTagsMapping.current[tag.key] = true;
    }
    setSelectedTags(st => [...st, {...tag}]);
  }

  function removeTag(tag, index) {
    if (selectedTagsMapping.current[tag.key]) {
      delete selectedTagsMapping.current[tag.key];
      setSelectedTags(st => {
        const newArray = [...st];
        newArray.splice(index, 1);
        return newArray;
      });
    }
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'md'}
      open={true}
      onClose={handleClose}
      scroll={'paper'}
    >
      <DialogTitle sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ whiteSpace: 'nowrap', flexGrow: 1, flexShrink: 0 }}><FormattedMessage id="selectTagsDialog.title" /></div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
          <SearchIcon sx={{ marginRight: '8px' }} />
          <TextField
            label={formatMessage({ id: 'selectTagsDialog.search' })}
            variant="standard"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>
      </DialogTitle>
      <DialogContent dividers={true}>
        <div style={{ flexGrow: 1 }}>
          <FormattedMessage id="selectTagsDialog.selectedTags" />
          {selectedTags.map((tag, idx) => (
            <Chip
              sx={{ marginRight: 1, marginBottom: 0.5 }}
              label={tag.name}
              key={tag.key}
              variant="outlined"
              onDelete={() => removeTag(tag, idx)}
            />
          ))}
          <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
          {tags.filter(tag => !selectedTagsMapping.current[tag.key])
            .filter(tag => !queryText || tag.name.toLowerCase().includes(queryText)).map(tag => (
              <Chip
                sx={{ marginRight: 1, marginBottom: 0.5 }}
                label={tag.name}
                key={tag.key}
                variant="outlined"
                onClick={() => addTag(tag)}
              />
            ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="primary">
          <FormattedMessage id="button.cancel" />
        </Button>
        <Button variant="contained" onClick={onApply} color="primary">
          <FormattedMessage id="button.ok" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SelectTagsDialog;
