import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/core';

export const TooltipSlider = React.memo(
  ({
    value,
    min,
    max,
    onChange,
    icon,
    tooltipLabel,
    isDisabled = false,
    ...rest
  }) => {
    return (
      <Slider
        {...rest}
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
    );
  }
);

TooltipSlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.func.isRequired,
  tooltipLabel: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
};

export default TooltipSlider;
