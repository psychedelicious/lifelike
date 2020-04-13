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
    onCellWidthChange,
    cellHeight,
    onCellHeightChange,
    cellSize,
    onCellSizeChange,
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
                onChange={onCellWidthChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnWidth}
              />

              <NumberSlider
                value={cellHeight}
                min={minMaxLimits.cellHeight.min}
                max={minMaxLimits.cellHeight.max}
                onChange={onCellHeightChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnHeight}
              />
            </>
          )}

          <NumberSlider
            value={cellSize}
            min={minMaxLimits.cellSize.min}
            max={minMaxLimits.cellSize.max}
            onChange={onCellSizeChange}
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
  onCellWidthChange: PropTypes.func.isRequired,
  cellHeight: PropTypes.number.isRequired,
  onCellHeightChange: PropTypes.func.isRequired,
  cellSize: PropTypes.number.isRequired,
  onCellSizeChange: PropTypes.func.isRequired,
  minMaxLimits: PropTypes.object.isRequired,
  isRunning: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
