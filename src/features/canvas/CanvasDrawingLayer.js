import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasDrawingLayer = React.memo(({ canvasDrawLayerRef }) => {
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);

  const isInDrawMode = useSelector((state) => state.drawing.isInDrawMode);

  return (
    <canvas
      ref={canvasDrawLayerRef}
      style={{
        cursor: isInDrawMode ? 'none' : 'initial',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '3',
        width: canvasWidth || '100%',
        height: canvasHeight || '100%',
      }}
    ></canvas>
  );
});

CanvasDrawingLayer.propTypes = {
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default CanvasDrawingLayer;
