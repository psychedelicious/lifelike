import React from 'react';
import PropTypes from 'prop-types';

import { FaImage } from 'react-icons/fa';
import { IconButton } from '@chakra-ui/core';

import { useCanvas } from 'features/canvas/useCanvas';
import StyledTooltip from './StyledTooltip';

export const SaveAsImageButton = ({
  canvasBaseLayerRef,
  canvasGridLayerRef,
}) => {
  const { saveCanvasAsImage } = useCanvas();

  const handleClick = React.useCallback(() => {
    saveCanvasAsImage({
      canvasBaseLayerRef,
      canvasGridLayerRef,
    });
  }, [canvasBaseLayerRef, canvasGridLayerRef, saveCanvasAsImage]);

  return (
    <StyledTooltip label="download as image" placement="top" hasArrow>
      <IconButton
        icon={FaImage}
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr="0.5rem"
        variant="link"
        variantColor="blue"
        aria-label="download as image"
        onClick={handleClick}
      />
    </StyledTooltip>
  );
};

SaveAsImageButton.propTypes = {
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
};

export default React.memo(SaveAsImageButton);
