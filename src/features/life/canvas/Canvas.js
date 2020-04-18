import React from 'react';
import PropTypes from 'prop-types';

import { Flex } from '@chakra-ui/core';
import { shallowEqual, useSelector } from 'react-redux';

const Canvas = React.memo(
  ({
    canvasRef,
    canvasContainerRef,
    canvasGridOverlayRef,
    canvasDrawOverlayRef,
    ...rest
  }) => {
    const {
      canvasWidth,
      canvasHeight,
      canvasOverlayText,
      isRunning,
      inEditMode,
    } = useSelector(
      (state) => ({
        canvasWidth: state.life.canvasWidth,
        canvasHeight: state.life.canvasHeight,
        canvasOverlayText: state.life.canvasOverlayText,
        isRunning: state.life.isRunning,
        inEditMode: state.life.inEditMode,
      }),
      shallowEqual
    );

    console.log(inEditMode);

    return (
      <Flex
        {...rest}
        ref={canvasContainerRef}
        position="relative"
        justify="center"
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            padding: '0',
            margin: '0',
            display: 'flex',
            justifyContent: 'stretch',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: canvasWidth || '100%',
              height: canvasHeight || '100%',
            }}
          ></canvas>
          <canvas
            ref={canvasGridOverlayRef}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: '1',
              width: canvasWidth || '100%',
              height: canvasHeight || '100%',
            }}
          ></canvas>
          <canvas
            ref={canvasDrawOverlayRef}
            style={{
              touchAction: 'none',
              cursor: !isRunning && inEditMode ? 'none' : 'not-allowed',
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: '3',
              width: canvasWidth || '100%',
              height: canvasHeight || '100%',
            }}
          ></canvas>
          <div
            style={{
              display:
                !isRunning && canvasOverlayText.length ? 'block' : 'none',
              touchAction: 'none',
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: '2',
              padding: '0.25rem',
              margin: '0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'rgb(255,255,255)',
              fontSize: '0.875rem',
            }}
          >
            {canvasOverlayText.map((text, i) => (
              <div key={`canvasOverlayText${i}`}>{text}</div>
            ))}
          </div>
        </div>
      </Flex>
    );
  }
);

Canvas.propTypes = {
  canvasRef: PropTypes.object.isRequired,
  canvasContainerRef: PropTypes.object.isRequired,
  canvasGridOverlayRef: PropTypes.object.isRequired,
  canvasDrawOverlayRef: PropTypes.object.isRequired,
};

export default Canvas;
