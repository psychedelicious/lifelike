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
    </Box>
  );
};

Canvas.propTypes = {
  canvasRef: PropTypes.object.isRequired,
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
};
