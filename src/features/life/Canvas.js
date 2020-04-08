import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@chakra-ui/core';

export const Canvas = ({ canvasRef, canvasWidth, canvasHeight }) => {
  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      w={canvasWidth || '100%'}
      h={canvasHeight || '100%'}
    >
      <canvas
        ref={canvasRef}
        style={{
          padding: '0.5rem',
          width: canvasWidth || '100%',
          height: canvasHeight || '100%',
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
