import React from 'react';
import PropTypes from 'prop-types';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';
import { IoIosSpeedometer } from 'react-icons/io';

import { Checkbox, Flex, Tooltip, Text } from '@chakra-ui/core';

import { NeighborhoodRadio } from './NeighborhoodRadio';
import { NumberSlider } from './NumberSlider';
import { RuleCheckboxes } from './RuleCheckboxes';

export const Menu = React.memo(
  ({
    neighborhood,
    onNeighborhoodChange,
    born,
    onBornChange,
    survive,
    onSurviveChange,
    wrap,
    onWrapChange,
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
    showGridLines,
    onToggleGridLines,
  }) => {
    return (
      <Flex direction="column" align="left" w="18.5rem">
        <Flex direction="column">
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

        <Flex direction="column">
          <RuleCheckboxes
            ruleArray={born}
            ruleType="born"
            onChange={onBornChange}
          />

          <RuleCheckboxes
            ruleArray={survive}
            ruleType="survive"
            onChange={onSurviveChange}
          />
        </Flex>

        <NeighborhoodRadio
          neighborhood={neighborhood}
          onChange={onNeighborhoodChange}
        />

        <Flex justify="left">
          <Checkbox
            isChecked={showGridLines}
            onChange={onToggleGridLines}
            mr="0.5rem"
          >
            <Tooltip hasArrow label="toggle grid lines" placement="top">
              <Text fontSize="sm">grid lines</Text>
            </Tooltip>
          </Checkbox>

          <Checkbox isChecked={wrap} onChange={onWrapChange}>
            <Tooltip
              hasArrow
              label="toggle edge wrapping"
              placement="top"
            >
              <Text fontSize="sm">wrap</Text>
            </Tooltip>
          </Checkbox>
        </Flex>
      </Flex>
    );
  }
);

Menu.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  onNeighborhoodChange: PropTypes.func.isRequired,
  born: PropTypes.array.isRequired,
  onBornChange: PropTypes.func.isRequired,
  survive: PropTypes.array.isRequired,
  onSurviveChange: PropTypes.func.isRequired,
  wrap: PropTypes.bool.isRequired,
  onWrapChange: PropTypes.func.isRequired,
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
  showGridLines: PropTypes.bool.isRequired,
  onToggleGridLines: PropTypes.func.isRequired,
};
