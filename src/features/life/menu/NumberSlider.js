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
          <Tooltip hasArrow label={tooltipLabel} placement="top" zIndex="2">
            <SliderThumb size={6} borderRadius="sm">
              <Box color="gray.800" as={icon} />
            </SliderThumb>
          </Tooltip>
        </Slider>
        <Tooltip hasArrow label={tooltipLabel} placement="top" zIndex="2">
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
