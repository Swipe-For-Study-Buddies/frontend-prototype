import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

import TextField from '@mui/material/TextField';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import MuiPickersDay from '@mui/lab/PickersDay';

dayjs.locale('zh-tw');

function MuiDatePicker({ label, value = null, required = false, fullWidth = false, disabled = false, shouldDisableDate, onChange, ...props }) {
  const { formatMessage } = useIntl();
  const [textProps, setTextProps] = useState({});

  const limit = {};
  if (props.minDate) {
    limit.minDate = dayjs(props.minDate);
  }
  if (props.maxDate) {
    limit.maxDate = dayjs(props.maxDate);
  }
  if (shouldDisableDate) {
    limit.renderDay = function PickersDay(day, _value, DayComponentProps) { return <MuiPickersDay {...DayComponentProps} disabled={shouldDisableDate(day)} />;};
  }

  function onError(err) {
    if (err === 'minDate') {
      setTextProps({ helperText: props.minDateMessage });
    } else if (err === 'maxDate') {
      setTextProps({ helperText: props.maxDateMessage });
    } else if (err) {
      setTextProps({ helperText: props.invalidDateMessage });
    } else {
      if (required && value === null) {
        setTextProps({ error: true, helperText: formatMessage({ id: 'form.isRequired' }) });
      } else {
        setTextProps({});
      }
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={disabled}
        mask="____-__-__"
        inputFormat="YYYY-MM-DD"
        label={label}
        value={value}
        onChange={onChange}
        onError={onError}
        onAccept={() => setTextProps({})}
        leftArrowButtonText={formatMessage({ id: 'datePicker.previousMonth' })}
        rightArrowButtonText={formatMessage({ id: 'datePicker.nextMonth' })}
        allowSameDateSelection
        {...limit}
        componentsProps={{ error: true }}
        renderInput={(params) => <TextField
          required={required}
          fullWidth={fullWidth}
          onCompositionStart={
            e => {
              e.target.addEventListener('input', e2 => {
                if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e2.data)) {
                  e2.preventDefault();
                  e2.stopPropagation();
                  e2.stopImmediatePropagation();
                }
              }, { once: true });
            }
          }
          {...params}
          {...textProps}
        />}
      />
    </LocalizationProvider>
  );
};

export default MuiDatePicker;
