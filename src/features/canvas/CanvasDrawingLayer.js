import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasDrawingLayer = React.memo(({ canvasDrawLayerRef }) => {
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);

  const isInDrawMode = useSelector((state) => state.drawing.isInDrawMode);
  const isInTranslateMode = useSelector(
    (state) => state.drawing.isInTranslateMode
  );

  const cursor = isInTranslateMode ? 'move' : isInDrawMode ? 'none' : 'initial';

  return (
    <canvas
      ref={canvasDrawLayerRef}
      style={{
        cursor: cursor,
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '5',
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
