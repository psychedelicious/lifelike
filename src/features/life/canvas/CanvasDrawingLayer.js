import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasDrawingLayer = React.memo(({ canvasDrawLayerRef }) => {
  const { isRunning, inEditMode, canvasWidth, canvasHeight } = useSelector(
    (state) => ({
      isRunning: state.life.isRunning,
      inEditMode: state.life.inEditMode,
      canvasWidth: state.life.canvasWidth,
      canvasHeight: state.life.canvasHeight,
    })
  );

  return (
    <canvas
      ref={canvasDrawLayerRef}
      style={{
        touchAction: 'none',
        cursor: !isRunning && inEditMode ? 'none' : 'not-allowed',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '2',
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
