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
  useColorMode,
} from '@chakra-ui/core';

import { useSelector } from 'react-redux';

import { lightDarkenColor } from 'features/menu/utilities';
import StyledTooltip from './StyledTooltip';

export const NumberSlider = ({
  value,
  min,
  max,
  onChange,
  icon,
  tooltipLabel,
  isDisabled = false,
}) => {
  const { colorMode } = useColorMode();

  const { aliveCellColor, deadCellColor } = useSelector(
    (state) => state.theme[`${colorMode}ModeColors`]
  );

  const bgDisabled =
    colorMode === 'light' ? '#DDDDDD' : lightDarkenColor(deadCellColor, -100);

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
        <StyledTooltip label={tooltipLabel} placement="top" hasArrow>
          <SliderThumb
            size={6}
            borderRadius="sm"
            bg={deadCellColor}
            _disabled={{ bg: bgDisabled }}
          >
            <Box color={aliveCellColor} as={icon} />
          </SliderThumb>
        </StyledTooltip>
      </Slider>
      <StyledTooltip label={tooltipLabel} placement="top" hasArrow>
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
      </StyledTooltip>
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
