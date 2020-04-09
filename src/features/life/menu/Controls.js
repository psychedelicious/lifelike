import React from 'react';
import PropTypes from 'prop-types';
import {
  FaPlay,
  FaPause,
  FaForward,
  FaTrash,
  FaRandom,
  FaExpand,
} from 'react-icons/fa';
import { Flex, IconButton, Tooltip } from '@chakra-ui/core';

export const Controls = React.memo(
  ({
    isRunning,
    onClickStartStop,
    onClickTick,
    onClickRandomizeCells,
    onClickClearCells,
    onClickFitCellsToCanvas,
  }) => {
    return (
      <Flex mb="2" justify="space-between">
        <Tooltip hasArrow label={isRunning ? 'stop' : 'start'} placement="top">
          <IconButton
            icon={isRunning ? FaPause : FaPlay}
            variant="solid"
            aria-label="start/stop"
            onClick={onClickStartStop}
          />
        </Tooltip>

        <Tooltip hasArrow label="tick" placement="top">
          <IconButton
            isDisabled={isRunning}
            icon={FaForward}
            variant="solid"
            aria-label="tick"
            onClick={onClickTick}
          />
        </Tooltip>

        <Tooltip hasArrow label="clear all cells" placement="top">
          <IconButton
            icon={FaTrash}
            variant="solid"
            aria-label="clear all cells"
            onClick={onClickClearCells}
          />
        </Tooltip>

        <Tooltip hasArrow label="randomize all cells" placement="top">
          <IconButton
            icon={FaRandom}
            variant="solid"
            aria-label="randomize all cells"
            onClick={onClickRandomizeCells}
          />
        </Tooltip>

        <Tooltip hasArrow label="expand/shrink grid to fit" placement="top">
          <IconButton
            icon={FaExpand}
            variant="solid"
            aria-label="expand/shrink grid to fit"
            onClick={onClickFitCellsToCanvas}
          />
        </Tooltip>
      </Flex>
    );
  }
);

Controls.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  onClickStartStop: PropTypes.func.isRequired,
  onClickTick: PropTypes.func.isRequired,
  onClickClearCells: PropTypes.func.isRequired,
  onClickRandomizeCells: PropTypes.func.isRequired,
  onClickFitCellsToCanvas: PropTypes.func.isRequired,
};

export default Controls;
