import React from 'react';
import PropTypes from 'prop-types';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';
import { IoIosSpeedometer } from 'react-icons/io';

import { Flex, FormLabel, Switch } from '@chakra-ui/core';

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
  }) => {
    return (
      <Flex direction="column" align="left" w="18rem">
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
            tooltipLabel="max fps"
          />
        </Flex>

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

        <NeighborhoodRadio
          neighborhood={neighborhood}
          onChange={onNeighborhoodChange}
        />

        <Flex my="1" align="center" justify="left">
          <FormLabel htmlFor="wrap" fontSize="sm">
            wrap
          </FormLabel>
          <Switch
            isChecked={wrap}
            id="wrap"
            size="sm"
            onChange={onWrapChange}
          />
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
};
