import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@chakra-ui/core';

export const Canvas = ({
  canvasRef,
  canvasWidth,
  canvasHeight,
  canvasContainerRef,
  canvasContainerWidth,
  canvasContainerHeight,
  canvasOverlayRef,
  mousePositionRef,
}) => {
  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      mt="1rem"
      ml="0.5rem"
      w={canvasContainerWidth || '100%'}
      h={canvasContainerHeight || '100%'}
      ref={canvasContainerRef}
      position="relative"
    >
      <div
        ref={mousePositionRef}
        style={{ height: '100%', width: '100%', padding: '0', margin: '0' }}
      >
        <canvas
          ref={canvasRef}
          style={{
            padding: '0.5rem',
            width: canvasWidth || '100%',
            height: canvasHeight || '100%',
            boxSizing: 'initial',
          }}
        ></canvas>
        <canvas
          ref={canvasOverlayRef}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '1',
            padding: '0.5rem',
            width: canvasWidth || '100%',
            height: canvasHeight || '100%',
            boxSizing: 'initial',
          }}
        ></canvas>
      </div>
    </Box>
  );
};

Canvas.propTypes = {
  canvasRef: PropTypes.object.isRequired,
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
  canvasContainerRef: PropTypes.object.isRequired,
  canvasContainerWidth: PropTypes.number,
  canvasContainerHeight: PropTypes.number,
  canvasOverlayRef: PropTypes.object.isRequired,
  mousePositionRef: PropTypes.object.isRequired,
};
