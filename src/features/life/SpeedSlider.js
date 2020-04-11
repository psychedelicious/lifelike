import React from 'react';
import PropTypes from 'prop-types';
import { IoIosSpeedometer } from 'react-icons/io';

import TooltipSlider from './menu/TooltipSlider';

export const SpeedSlider = React.memo(
  ({ interval, fpsInterval, min, max, onChange, ...rest }) => {
    const delayString =
      interval === 0
        ? '1s'
        : interval === 100
        ? 'no'
        : `${Math.round(fpsInterval * 100) / 100}ms`;

    return (
      <TooltipSlider
        {...rest}
        value={interval}
        min={min}
        max={max}
        onChange={onChange}
        icon={IoIosSpeedometer}
        tooltipLabel={`speed (${delayString} delay between ticks)`}
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

export default SpeedSlider;
