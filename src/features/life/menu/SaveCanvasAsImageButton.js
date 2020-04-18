import React from 'react';
import PropTypes from 'prop-types';

import { IoMdImage } from 'react-icons/io';
import { IconButton } from '@chakra-ui/core';

import { useCanvas } from '../canvas/useCanvas';

export const SaveCanvasAsImageButton = React.memo(
  ({ canvas, canvasGridOverlay }) => {
    const { saveCanvasAsImage } = useCanvas();

    const handleClick = React.useCallback(() => {
      saveCanvasAsImage({
        canvas,
        canvasGridOverlay,
      });
    }, [canvas, canvasGridOverlay]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <IconButton
        icon={IoMdImage}
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr="0.5rem"
        variant="unstyled"
        aria-label="save grid as image"
        onClick={handleClick}
      />
    );
  }
);

SaveCanvasAsImageButton.propTypes = {
  canvas: PropTypes.object,
  canvasGridOverlay: PropTypes.object,
};
