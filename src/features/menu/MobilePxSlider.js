import React from 'react';
import PropTypes from 'prop-types';
import { GiResize } from 'react-icons/gi';

import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  // Tooltip,
  useColorMode,
} from '@chakra-ui/core';

export const MobilePxSlider = React.memo(
  ({ px, min, max, onChange, isDisabled, ...rest }) => {
    const { colorMode } = useColorMode();

    return (
      <Slider
        {...rest}
        flex="1"
        value={px}
        min={min}
        max={max}
        onChange={onChange}
        isDisabled={isDisabled}
        w="calc(100% - 2rem)"
        alignSelf="center"
      >
        <SliderTrack />
        <SliderFilledTrack />
        {/* <Tooltip
          hasArrow
          label={`${delayString} delay`}
          placement="top"
          zIndex="2"
          bg={colorMode === 'light' ? 'gray.50' : 'blue.100'}
          color={colorMode === 'light' ? 'blue.600' : 'blue.800'}
        > */}
        <SliderThumb
          size={6}
          borderRadius="sm"
          border="1px "
          bg={colorMode === 'light' ? 'gray.50' : 'blue.100'}
        >
          <Box
            as={GiResize}
            color={colorMode === 'light' ? 'blue.600' : 'blue.800'}
          />
        </SliderThumb>
        {/* </Tooltip> */}
      </Slider>
    );
  }
);

MobilePxSlider.propTypes = {
  px: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};
