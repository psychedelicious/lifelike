import React from 'react';
import PropTypes from 'prop-types';

import { Flex } from '@chakra-ui/core';

export const Canvas = ({
  canvasRef,
  canvasWidth,
  canvasHeight,
  canvasContainerRef,
  canvasContainerWidth,
  canvasContainerHeight,
  canvasOverlayRef,
  isRunning,
  gridArea,
  // mousePositionRef,
}) => {
  return (
    <Flex
      gridArea={gridArea}
      p={0}
      m={0}
      // w={canvasContainerWidth || '100%'}
      // h={canvasContainerHeight || '100%'}
      ref={canvasContainerRef}
      position="relative"
      justify="center"
    >
      <div
        // ref={!isRunning ? mousePositionRef : null}
        style={{ height: '100%', width: '100%', padding: '0', margin: '0' }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: canvasWidth || '100%',
            height: canvasHeight || '100%',
            boxSizing: 'border-box',
            borderRadius: '1px',
          }}
        ></canvas>
        <canvas
          ref={canvasOverlayRef}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '1',
            width: canvasWidth || '100%',
            height: canvasHeight || '100%',
            boxSizing: 'border-box',
            borderRadius: '1px',
          }}
        ></canvas>
      </div>
    </Flex>
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
  isRunning: PropTypes.bool.isRequired,
  gridArea: PropTypes.string.isRequired,
  // mousePositionRef: PropTypes.object.isRequired,
};
