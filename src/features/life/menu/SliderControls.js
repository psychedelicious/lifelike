import React from 'react';
import PropTypes from 'prop-types';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';

import { Flex, Collapse } from '@chakra-ui/core';

import { NumberSlider } from './NumberSlider';

export const SliderControls = React.memo(
  ({
    isMobile,
    cellWidth,
    onWidthChange,
    cellHeight,
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
          {!isMobile && (
            <>
              <NumberSlider
                value={cellWidth}
                min={minMaxLimits.cellWidth.min}
                max={minMaxLimits.cellWidth.max}
                onChange={onWidthChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnWidth}
              />

              <NumberSlider
                value={cellHeight}
                min={minMaxLimits.cellHeight.min}
                max={minMaxLimits.cellHeight.max}
                onChange={onHeightChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnHeight}
              />
            </>
          )}

          <NumberSlider
            value={px}
            min={minMaxLimits.px.min}
            max={minMaxLimits.px.max}
            onChange={onPxChange}
            isDisabled={isRunning}
            icon={GiResize}
          />
        </Flex>
      </Collapse>
    );
  }
);

SliderControls.propTypes = {
  cellWidth: PropTypes.number.isRequired,
  onWidthChange: PropTypes.func.isRequired,
  cellHeight: PropTypes.number.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  px: PropTypes.number.isRequired,
  onPxChange: PropTypes.func.isRequired,
  minMaxLimits: PropTypes.object.isRequired,
  isRunning: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
