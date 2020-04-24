import React from 'react';
import PropTypes from 'prop-types';

import { IoMdVideocam } from 'react-icons/io';
import { MdFiberManualRecord } from 'react-icons/md';

import { IconButton } from '@chakra-ui/core';

export const SaveAsVideoButton = React.memo(
  ({ isRecording, handleStartCapture, handleStopCapture }) => {
    return (
      <IconButton
        icon={isRecording ? MdFiberManualRecord : IoMdVideocam}
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr="0.5rem"
        variant="link"
        variantColor={isRecording ? 'red' : 'blue'}
        aria-label="save grid as image"
        onClick={isRecording ? handleStopCapture : handleStartCapture}
      />
    );
  }
);

SaveAsVideoButton.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  handleStartCapture: PropTypes.func.isRequired,
  handleStopCapture: PropTypes.func.isRequired,
};
