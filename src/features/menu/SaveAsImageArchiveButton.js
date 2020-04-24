import React from 'react';
import PropTypes from 'prop-types';

import { FaImages } from 'react-icons/fa';
import { MdFiberManualRecord } from 'react-icons/md';

import { IconButton } from '@chakra-ui/core';

export const SaveAsImageArchiveButton = React.memo(
  ({
    isRecordingArchive,
    handleStopRecordingArchive,
    handleStartRecordingArchive,
  }) => {
    return (
      <IconButton
        icon={isRecordingArchive ? MdFiberManualRecord : FaImages}
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr="0.5rem"
        variant="link"
        variantColor={isRecordingArchive ? 'red' : 'blue'}
        aria-label="save grid as image"
        onClick={
          isRecordingArchive
            ? handleStopRecordingArchive
            : handleStartRecordingArchive
        }
      />
    );
  }
);

SaveAsImageArchiveButton.propTypes = {
  isRecordingArchive: PropTypes.bool.isRequired,
  handleStopRecordingArchive: PropTypes.func.isRequired,
  handleStartRecordingArchive: PropTypes.func.isRequired,
};
