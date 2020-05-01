import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '@chakra-ui/core';

import { useCanvas } from 'features/canvas/useCanvas';
import { IoMdImage } from 'react-icons/io';

export const SaveAsImageButton = ({
  canvasBaseLayerRef,
  canvasGridLayerRef,
  ...rest
}) => {
  const { saveCanvasAsImage } = useCanvas();

  const handleClick = React.useCallback(() => {
    saveCanvasAsImage({
      canvasBaseLayerRef,
      canvasGridLayerRef,
    });
  }, [canvasBaseLayerRef, canvasGridLayerRef, saveCanvasAsImage]);

  return (
    <IconButton
      {...rest}
      icon={IoMdImage}
      fontSize="1.5rem"
      p={0}
      h="unset"
      minW="unset"
      mr="0.5rem"
      variant="link"
      aria-label="download as image"
      onClick={handleClick}
    />
  );
};

SaveAsImageButton.propTypes = {
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
};

export default React.memo(SaveAsImageButton);
