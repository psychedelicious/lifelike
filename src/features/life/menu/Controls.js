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
import { Flex, IconButton } from '@chakra-ui/core';

import { IconButtonModalConfirm } from './IconButtonModalConfirm';

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
        <IconButton
          icon={isRunning ? FaPause : FaPlay}
          variant="solid"
          aria-label="start/stop"
          onClick={onClickStartStop}
        />
        <IconButton
          isDisabled={isRunning}
          icon={FaForward}
          variant="solid"
          aria-label="tick once"
          onClick={onClickTick}
        />
        <IconButtonModalConfirm
          icon={FaTrash}
          header="clear all cells"
          body="for real?"
          confirmText="yeah clear 'em"
          onConfirmCallback={onClickClearCells}
        />
        <IconButtonModalConfirm
          icon={FaRandom}
          header="randomize all cells"
          body="for real?"
          confirmText="yeah shuffle 'em"
          onConfirmCallback={onClickRandomizeCells}
        />
        <IconButtonModalConfirm
          isDisabled={isRunning}
          icon={FaExpand}
          header="fit cell grid to window"
          body="if the cell grid needs to expand to fill the window, extra empty space will be added. if the cell grid need to shrink to fit, cells will be lost!"
          confirmText="yeah resize 'em"
          onConfirmCallback={onClickFitCellsToCanvas}
        />
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
