import React from 'react';
import PropTypes from 'prop-types';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';
import { IoIosSpeedometer } from 'react-icons/io';

import { Flex } from '@chakra-ui/core';

import { NumberSlider } from './NumberSlider';

export const SliderControls = ({
  cellWidth,
  onCellWidthChange,
  cellHeight,
  onCellHeightChange,
  cellSize,
  onCellSizeChange,
  minMaxLimits,
  maxFps,
  onMaxFpsChange,
  isRunning,
  gridArea,
}) => {
  return (
      <Flex gridArea={gridArea} direction="column">
        <NumberSlider
          value={cellWidth}
          min={minMaxLimits.current.cellWidth.min}
          max={minMaxLimits.current.cellWidth.max}
          onChange={onCellWidthChange}
          isDisabled={isRunning}
          icon={AiOutlineColumnWidth}
          tooltipLabel="width (cells)"
        />

        <NumberSlider
          value={cellHeight}
          min={minMaxLimits.current.cellHeight.min}
          max={minMaxLimits.current.cellHeight.max}
          onChange={onCellHeightChange}
          isDisabled={isRunning}
          icon={AiOutlineColumnHeight}
          tooltipLabel="height (cells)"
        />

        <NumberSlider
          value={cellSize}
          min={minMaxLimits.current.cellSize.min}
          max={minMaxLimits.current.cellSize.max}
          onChange={onCellSizeChange}
          isDisabled={isRunning}
          icon={GiResize}
          tooltipLabel="cell size (px)"
        />

        <NumberSlider
          value={maxFps}
          min={minMaxLimits.current.maxFps.min}
          max={minMaxLimits.current.maxFps.max}
          onChange={onMaxFpsChange}
          icon={IoIosSpeedometer}
          tooltipLabel="target ticks per second"
        />
      </Flex>
  );
};

SliderControls.propTypes = {
  gridArea: PropTypes.string.isRequired,
  cellWidth: PropTypes.number.isRequired,
  onCellWidthChange: PropTypes.func.isRequired,
  cellHeight: PropTypes.number.isRequired,
  onCellHeightChange: PropTypes.func.isRequired,
  cellSize: PropTypes.number.isRequired,
  onCellSizeChange: PropTypes.func.isRequired,
  minMaxLimits: PropTypes.object.isRequired,
  maxFps: PropTypes.number.isRequired,
  onMaxFpsChange: PropTypes.func.isRequired,
  isRunning: PropTypes.bool.isRequired,
};
