import React from 'react';
import PropTypes from 'prop-types';
import {
  FaPlay,
  FaPause,
  FaForward,
  FaTrash,
  FaRandom,
  FaExpandArrowsAlt,
  FaWrench,
} from 'react-icons/fa';
import { Flex, IconButton, Tooltip } from '@chakra-ui/core';

export const MainControls = React.memo(
  ({
    isRunning,
    onClickStartStop,
    onClickTick,
    onClickRandomizeCells,
    onClickClearCells,
    onClickFitCellsToCanvas,
    onClickToggleOptions,
  }) => {
    return (
      <Flex justify="space-between">
        <Tooltip hasArrow label="start/stop [spacebar]" placement="top">
          <IconButton
            icon={isRunning ? FaPause : FaPlay}
            variant="solid"
            aria-label="start/stop"
            onClick={onClickStartStop}
          />
        </Tooltip>

        <Tooltip hasArrow label="tick [->]" placement="top">
          <IconButton
            isDisabled={isRunning}
            icon={FaForward}
            variant="solid"
            aria-label="tick"
            onClick={onClickTick}
          />
        </Tooltip>

        <Tooltip hasArrow label="clear all cells [c]" placement="top">
          <IconButton
            isDisabled={isRunning}
            icon={FaTrash}
            variant="solid"
            aria-label="clear all cells"
            onClick={onClickClearCells}
          />
        </Tooltip>

        <Tooltip hasArrow label="randomize all cells [r]" placement="top">
          <IconButton
            isDisabled={isRunning}
            icon={FaRandom}
            variant="solid"
            aria-label="randomize all cells"
            onClick={onClickRandomizeCells}
          />
        </Tooltip>

        <Tooltip hasArrow label="expand/shrink grid to fit [f]" placement="top">
          <IconButton
            isDisabled={isRunning}
            icon={FaExpandArrowsAlt}
            variant="solid"
            aria-label="expand/shrink grid to fit"
            onClick={onClickFitCellsToCanvas}
          />
        </Tooltip>

        <Tooltip hasArrow label="show/hide options" placement="top">
          <IconButton
            icon={FaWrench}
            variant="solid"
            aria-label="show/hide options"
            onClick={onClickToggleOptions}
          />
        </Tooltip>
      </Flex>
    );
  }
);

MainControls.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  onClickStartStop: PropTypes.func.isRequired,
  onClickTick: PropTypes.func.isRequired,
  onClickClearCells: PropTypes.func.isRequired,
  onClickRandomizeCells: PropTypes.func.isRequired,
  onClickFitCellsToCanvas: PropTypes.func.isRequired,
  onClickToggleOptions: PropTypes.func.isRequired,
};

export default MainControls;
