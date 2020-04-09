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
  Tooltip,
} from '@chakra-ui/core';

export const NumberSlider = React.memo(
  ({ value, min, max, onChange, icon, tooltipLabel, isDisabled = false }) => {
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
          <SliderThumb size={6}>
            <Box color="gray.900" as={icon} />
          </SliderThumb>
        </Slider>
        <Tooltip label={tooltipLabel} placement="top" zIndex="2">
          <NumberInput
            size="sm"
            maxW="5rem"
            ml="2rem"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            type="number"
            isDisabled={isDisabled}
          />
        </Tooltip>
      </Flex>
    );
  }
);

NumberSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.func.isRequired,
  tooltipLabel: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
};
