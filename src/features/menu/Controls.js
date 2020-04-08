import React from 'react';
import PropTypes from 'prop-types';
import { FaPlay, FaPause, FaForward, FaTrash, FaRandom } from 'react-icons/fa';
import { Flex, IconButton } from '@chakra-ui/core';

import { IconButtonModalConfirm } from '../life/IconButtonModalConfirm';

export const Controls = React.memo(
  ({
    isRunning,
    onClickStartStop,
    onClickTick,
    onClearCells,
    onRandomizeCells,
    startStopRef,
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
          confirmText="yeh clear 'em"
          onConfirmCallback={onClearCells}
        />
        <IconButtonModalConfirm
          icon={FaRandom}
          header="randomize all cells"
          body="for real?"
          confirmText="yeh shuffle 'em"
          onConfirmCallback={onRandomizeCells}
        />
      </Flex>
    );
  }
);

Controls.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  onClickStartStop: PropTypes.func.isRequired,
  onClickTick: PropTypes.func.isRequired,
  onClearCells: PropTypes.func.isRequired,
  onRandomizeCells: PropTypes.func.isRequired,
};

export default Controls;
