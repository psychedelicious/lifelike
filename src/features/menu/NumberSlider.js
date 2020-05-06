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
  Icon,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/core';

import { useSelector } from 'react-redux';
import StyledTooltip from './StyledTooltip';
import { useMediaQuery } from 'react-responsive';

export const NumberSlider = ({
  value,
  min,
  max,
  onChange,
  icon,
  step = 1,
  isDisabled = false,
  showTextInput = true,
  tooltip,
  ...rest
}) => {
  const {
    sliderThumbBgColor,
    sliderThumbColor,
    sliderDisabledThumbBgColor,
    theme,
  } = useSelector((state) => state.theme);

  const isMobile = useMediaQuery({ maxWidth: theme.breakpoints.md });

  return (
    <Flex my="1" {...rest}>
      <Slider
        flex="1"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        isDisabled={isDisabled}
        step={step}
        style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      >
        <SliderTrack />
        <SliderFilledTrack />
        <StyledTooltip label={tooltip}>
          <SliderThumb
            size={6}
            borderRadius="sm"
            bg={sliderThumbBgColor}
            _disabled={{ bg: sliderDisabledThumbBgColor }}
          >
            {typeof icon === 'string' ? (
              <Icon name={icon} />
            ) : (
              <Box color={sliderThumbColor} as={icon} />
            )}
          </SliderThumb>
        </StyledTooltip>
      </Slider>
      {showTextInput && (
        <StyledTooltip label={tooltip}>
          <NumberInput
            size="sm"
            maxW={isMobile ? '3rem' : '5rem'}
            ml="1.5rem"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            type="number"
            isDisabled={isDisabled}
            keepWithinRange={false}
          >
            <NumberInputField type="number" /> {/* <-- "type" here */}
            {!isMobile && (
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            )}
          </NumberInput>
        </StyledTooltip>
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
