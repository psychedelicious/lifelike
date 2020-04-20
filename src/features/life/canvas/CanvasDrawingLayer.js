import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasDrawingLayer = React.memo(({ canvasDrawLayerRef }) => {
  const isRunning = useSelector((state) => state.life.isRunning);
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);

  const inEditMode = useSelector((state) => state.drawing.inEditMode);

  return (
    <canvas
      ref={canvasDrawLayerRef}
      style={{
        cursor: !isRunning && inEditMode ? 'none' : 'initial',
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
