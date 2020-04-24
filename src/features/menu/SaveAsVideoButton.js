import React from 'react';
import PropTypes from 'prop-types';

import { IoMdVideocam } from 'react-icons/io';
import { MdFiberManualRecord } from 'react-icons/md';

import { IconButton } from '@chakra-ui/core';
import { useSelector } from 'react-redux';

export const SaveAsVideoButton = React.memo(
  ({ handleStartCapture, handleStopCapture }) => {
    const isRecordingVideo = useSelector(
      (state) => state.life.isRecordingVideo
    );
    return (
      <IconButton
        icon={isRecordingVideo ? MdFiberManualRecord : IoMdVideocam}
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr="0.5rem"
        variant="link"
        variantColor={isRecordingVideo ? 'red' : 'blue'}
        aria-label="save grid as image"
        onClick={isRecordingVideo ? handleStopCapture : handleStartCapture}
      />
    );
  }
);

SaveAsVideoButton.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  handleStartCapture: PropTypes.func.isRequired,
  handleStopCapture: PropTypes.func.isRequired,
};
