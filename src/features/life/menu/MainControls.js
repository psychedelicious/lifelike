import React from 'react';
import PropTypes from 'prop-types';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaTrash,
  FaRandom,
  FaExpandArrowsAlt,
  FaSlidersH,
} from 'react-icons/fa';
import { Flex, IconButton } from '@chakra-ui/core';

export const MainControls = React.memo(
  ({
    isRunning,
    onClickStartStop,
    onClickTick,
    onClickRandomizeCells,
    onClickClearCells,
    onClickFitCellsToCanvas,
    onClickToggleOptions,
    ...rest
  }) => {
    return (
      <Flex {...rest}>
        <IconButton
          icon={isRunning ? FaPause : FaPlay}
          variant="solid"
          aria-label="start/stop"
          onClick={onClickStartStop}
        />
        <IconButton
          isDisabled={isRunning}
          icon={FaStepForward}
          variant="solid"
          aria-label="tick"
          onClick={onClickTick}
        />
        <IconButton
          // isDisabled={isRunning}
          icon={FaTrash}
          variant="solid"
          aria-label="clear all cells"
          onClick={onClickClearCells}
        />
        <IconButton
          // isDisabled={isRunning}
          icon={FaRandom}
          variant="solid"
          aria-label="randomize all cells"
          onClick={onClickRandomizeCells}
        />
        <IconButton
          isDisabled={isRunning}
          icon={FaExpandArrowsAlt}
          variant="solid"
          aria-label="expand/shrink grid to fit"
          onClick={onClickFitCellsToCanvas}
        />
        <IconButton
          icon={FaSlidersH}
          variant="ghost"
          aria-label="show/hide options"
          onClick={onClickToggleOptions}
        />
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
