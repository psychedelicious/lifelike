import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasDrawingLayer = React.memo(({ canvasBaseLayerRef }) => {
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);

  return (
    <canvas
      ref={canvasBaseLayerRef}
      style={{
        width: canvasWidth || '100%',
        height: canvasHeight || '100%',
      }}
    ></canvas>
  );
});

CanvasDrawingLayer.propTypes = {
  canvasBaseLayerRef: PropTypes.object.isRequired,
};

export default CanvasDrawingLayer;
