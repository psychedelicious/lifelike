import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CanvasGridLayer = ({ canvasGridLayerRef }) => {
  const canvasWidth = useSelector((state) => state.life.canvasWidth);
  const canvasHeight = useSelector((state) => state.life.canvasHeight);

  return (
    <canvas
      ref={canvasGridLayerRef}
      width={canvasWidth}
      height={canvasHeight}
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
};

CanvasGridLayer.propTypes = {
  canvasGridLayerRef: PropTypes.object.isRequired,
};

export default React.memo(CanvasGridLayer);
