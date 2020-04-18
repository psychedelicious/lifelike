import React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import { clamp } from 'lodash';

import { IoIosSpeedometer } from 'react-icons/io';
import { setSpeed } from '../../../redux/actions';

import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  useColorMode,
} from '@chakra-ui/core';

const SpeedSlider = React.memo(({ ...rest }) => {
  const { speed, msDelay, min, max } = useSelector(
    (state) => ({
      speed: state.life.speed,
      msDelay: state.life.msDelay,
      min: state.life.minMaxLimits.speed.min,
      max: state.life.minMaxLimits.speed.max,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const { colorMode } = useColorMode();

  const handleSpeedChange = React.useCallback(
    (val) => {
      const speed = clamp(val, min, max);
      dispatch(setSpeed({ speed }));
    },
    [min, max, dispatch]
  );

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
      onChange={handleSpeedChange}
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
          size="1.5rem"
          borderRadius="sm"
          border="1px "
          bg={colorMode === 'light' ? 'white' : 'white'}
        >
          <Box
            as={IoIosSpeedometer}
            color={colorMode === 'light' ? 'blue.600' : 'blue.800'}
          />
        </SliderThumb>
      </Tooltip>
    </Slider>
  );
});

export default SpeedSlider;
