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

import { useSelector } from 'react-redux';

export const NumberSlider = ({
  value,
  min,
  max,
  onChange,
  icon,
  isDisabled = false,
  showTextInput = true,
}) => {
  const {
    sliderThumbBgColor,
    sliderThumbColor,
    sliderDisabledThumbBgColor,
  } = useSelector((state) => state.theme);

  return (
    <Flex my="1">
      <Slider
        flex="1"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        isDisabled={isDisabled}
        style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      >
        <SliderTrack />
        <SliderFilledTrack />
        <SliderThumb
          size={6}
          borderRadius="sm"
          bg={sliderThumbBgColor}
          _disabled={{ bg: sliderDisabledThumbBgColor }}
        >
          <Box color={sliderThumbColor} as={icon} />
        </SliderThumb>
      </Slider>
      {showTextInput && (
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
      )}
    </Flex>
  );
};

NumberSlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default React.memo(NumberSlider);
