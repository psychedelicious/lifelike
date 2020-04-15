import React from 'react';
import PropTypes from 'prop-types';
import { IoIosSpeedometer } from 'react-icons/io';

import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/core';

export const SpeedSlider = React.memo(
  ({ speed, msDelay, min, max, onChange, ...rest }) => {
    let delayString;

    if (speed === 0) {
      delayString = '1s';
    } else if (speed === 100) {
      delayString = 'no';
    } else {
      let delayFormatted = Math.round(msDelay * 100) / 100;
      if (delayFormatted === 0) {
        delayFormatted = Math.round(msDelay * 1000) / 1000;
      }
      delayString = `${delayFormatted}ms`;
    }

    return (
      <Slider
        {...rest}
        flex="1"
        value={speed}
        min={min}
        max={max}
        onChange={onChange}
      >
        <SliderTrack />
        <SliderFilledTrack />
        <Tooltip
          hasArrow
          label={`${delayString} delay`}
          placement="top"
          zIndex="2"
        >
          <SliderThumb size={6} borderRadius="sm">
            <Box color="gray.800" as={IoIosSpeedometer} />
          </SliderThumb>
        </Tooltip>
      </Slider>
    );
  }
);

SpeedSlider.propTypes = {
  speed: PropTypes.number.isRequired,
  msDelay: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
