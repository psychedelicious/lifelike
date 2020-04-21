import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasGridLayer = React.memo(({ canvasGridLayerRef }) => {
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);

  return (
    <canvas
      ref={canvasGridLayerRef}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '1',
        width: canvasWidth || '100%',
        height: canvasHeight || '100%',
      }}
    ></canvas>
  );
});

CanvasGridLayer.propTypes = {
  canvasGridLayerRef: PropTypes.object.isRequired,
};

export default CanvasGridLayer;
