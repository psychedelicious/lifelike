import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Flex,
  NumberInput,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/core';

export const NumberSlider = React.memo(
  ({ value, min, max, onChange, icon, isDisabled = false }) => {
    return (
      <Flex my="1">
        <Slider
          flex="1"
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          isDisabled={isDisabled}
        >
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb size={6} borderRadius="sm">
            <Box color="gray.800" as={icon} />
          </SliderThumb>
        </Slider>
        <NumberInput
          size="sm"
          maxW="5rem"
          ml="1.5rem"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          type="number"
          isDisabled={isDisabled}
        />
      </Flex>
    );
  }
);

NumberSlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};
