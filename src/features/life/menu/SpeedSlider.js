import React from 'react';
import PropTypes from 'prop-types';
import { IoIosSpeedometer } from 'react-icons/io';

import TooltipSlider from './TooltipSlider';

export const SpeedSlider = React.memo(
  ({ interval, fpsInterval, min, max, onChange, ...rest }) => {
    let delayString;

    if (interval === 0) {
      delayString = '1s';
    } else if (interval === 100) {
      delayString = 'no';
    } else {
      let delayFormatted = Math.round(fpsInterval * 100) / 100;
      if (delayFormatted === 0) {
        delayFormatted = Math.round(fpsInterval * 1000) / 1000;
      }
      delayString = `${delayFormatted}ms`;
    }

    return (
      <TooltipSlider
        {...rest}
        value={interval}
        min={min}
        max={max}
        onChange={onChange}
        icon={IoIosSpeedometer}
        tooltipLabel={`${delayString} delay [↑|↓]`}
      />
    );
  }
);

SpeedSlider.propTypes = {
  interval: PropTypes.number.isRequired,
  fpsInterval: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
