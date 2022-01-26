import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const Item = styled('div')(({ theme }) => ({
  borderBottom: 'solid 1px #000',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#eee'
  }
}));

function MenuItem({ path, text }) {
  return (
    <Link to={path} style={{ textDecoration: 'none', color: '#000' }}>
      <Item>
        <Typography variant="h5" gutterBottom component="div">
          {text}
        </Typography>
      </Item>
    </Link>
  );
}

const SettingPage = () => {
  const { formatMessage } = useIntl();

  const items = [
    { text: formatMessage({ id: 'setting.modifyPassword' }), path: '/modifyPassword' },
    { text: formatMessage({ id: 'setting.deleteAccount' }), path: '/deleteAccount' }
  ];

  return (
    <div className="container" style={{ borderTop: 'solid 1px #000' }}>
      {items.map(i => (
        <MenuItem key={i.text} {...i} />
      ))}
    </div>
  );
};

export default SettingPage;
