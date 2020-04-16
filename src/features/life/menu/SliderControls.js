import React from 'react';
import PropTypes from 'prop-types';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';

import { Flex, Collapse } from '@chakra-ui/core';

import { NumberSlider } from './NumberSlider';
import { MobilePxSlider } from './MobilePxSlider';

export const SliderControls = React.memo(
  ({
    isMobile,
    width,
    onWidthChange,
    height,
    onHeightChange,
    px,
    onPxChange,
    minMaxLimits,
    isRunning,
    isOpen,
    ...rest
  }) => {
    return (
      <Collapse isOpen={isOpen}>
        <Flex {...rest} direction="column">
          {!isMobile ? (
            <>
              <NumberSlider
                value={width}
                min={minMaxLimits.width.min}
                max={minMaxLimits.width.max}
                onChange={onWidthChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnWidth}
              />

              <NumberSlider
                value={height}
                min={minMaxLimits.height.min}
                max={minMaxLimits.height.max}
                onChange={onHeightChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnHeight}
              />

              <NumberSlider
                value={px}
                min={minMaxLimits.px.min}
                max={minMaxLimits.px.max}
                onChange={onPxChange}
                isDisabled={isRunning}
                icon={GiResize}
              />
            </>
          ) : (
            <>
              <MobilePxSlider
                px={px}
                min={minMaxLimits.px.min}
                max={minMaxLimits.px.max}
                onChange={onPxChange}
                isDisabled={isRunning}
              />
            </>
          )}
        </Flex>
      </Collapse>
    );
  }
);

SliderControls.propTypes = {
  width: PropTypes.number.isRequired,
  onWidthChange: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  px: PropTypes.number.isRequired,
  onPxChange: PropTypes.func.isRequired,
  minMaxLimits: PropTypes.object.isRequired,
  isRunning: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
