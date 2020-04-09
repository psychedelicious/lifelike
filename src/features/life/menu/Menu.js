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
    maxFps,
    onMaxFpsChange,
    isRunning,
  }) => {
    return (
      <Flex direction="column" align="left" w="18rem">
        <Flex direction="column">
          <NumberSlider
            value={cellWidth}
            min={5}
            max={500}
            onChange={onCellWidthChange}
            isDisabled={isRunning}
            icon={AiOutlineColumnWidth}
            tooltipLabel="width (cells)"
          />

          <NumberSlider
            value={cellHeight}
            min={5}
            max={500}
            onChange={onCellHeightChange}
            isDisabled={isRunning}
            icon={AiOutlineColumnHeight}
            tooltipLabel="height (cells)"
          />

          <NumberSlider
            value={cellSize}
            min={1}
            max={25}
            onChange={onCellSizeChange}
            isDisabled={isRunning}
            icon={GiResize}
            tooltipLabel="cell size (px)"
          />

          <NumberSlider
            value={maxFps}
            min={1}
            max={120}
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
  maxFps: PropTypes.number.isRequired,
  onMaxFpsChange: PropTypes.func.isRequired,
  isRunning: PropTypes.bool.isRequired,
};
