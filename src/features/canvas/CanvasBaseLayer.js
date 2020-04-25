import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTheme } from '@chakra-ui/core';

const CanvasDrawingLayer = ({ canvasBaseLayerRef }) => {
  const theme = useTheme();
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);

  return (
    <canvas
      ref={canvasBaseLayerRef}
      style={{
        width: canvasWidth || '100%',
        height: canvasHeight || '100%',
        boxShadow: `0 0 1rem -.25rem ${theme.colors.blue[400]}`,
      }}
    ></canvas>
  );
};

CanvasDrawingLayer.propTypes = {
  canvasBaseLayerRef: PropTypes.object.isRequired,
};

export default React.memo(CanvasDrawingLayer);
