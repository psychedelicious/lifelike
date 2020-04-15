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
  useColorMode,
} from '@chakra-ui/core';

export const SpeedSlider = React.memo(
  ({ speed, msDelay, min, max, onChange, ...rest }) => {
    const { colorMode } = useColorMode();

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
          bg={colorMode === 'light' ? 'gray.50' : 'blue.100'}
          color={colorMode === 'light' ? 'blue.600' : 'blue.800'}
        >
          <SliderThumb
            size={6}
            borderRadius="sm"
            border="1px "
            bg={colorMode === 'light' ? 'gray.50' : 'blue.100'}
          >
            <Box
              as={IoIosSpeedometer}
              color={colorMode === 'light' ? 'blue.600' : 'blue.800'}
            />
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
