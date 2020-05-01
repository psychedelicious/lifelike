import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasDrawingLayer = ({ canvasBaseLayerRef }) => {
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);
  const theme = useSelector((state) => state.theme.theme);

  return (
    <canvas
      ref={canvasBaseLayerRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        borderRadius: '2px',
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
