import React from 'react';
import PropTypes from 'prop-types';

import { IoMdImage } from 'react-icons/io';
import { IconButton } from '@chakra-ui/core';

import { useCanvas } from 'features/canvas/useCanvas';

export const SaveCanvasAsImageButton = React.memo(
  ({ canvasBaseLayerRef, canvasGridLayerRef }) => {
    const { saveCanvasAsImage } = useCanvas();

    const handleClick = React.useCallback(() => {
      saveCanvasAsImage({
        canvasBaseLayerRef,
        canvasGridLayerRef,
      });
    }, [canvasBaseLayerRef, canvasGridLayerRef, saveCanvasAsImage]);

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
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
};
