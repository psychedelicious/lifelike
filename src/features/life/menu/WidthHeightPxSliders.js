import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { clamp } from 'lodash';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';
import { Flex } from '@chakra-ui/core';

import { NumberSlider } from './NumberSlider';
import { MobilePxSlider } from './MobilePxSlider';
import { useCanvasSizeChange } from '../canvas/useCanvasSizeChange';
import { useCellDimensions } from '../canvas/useCellDimensions';

const WidthHeightPxSliders = React.memo(
  ({ isMobile, canvasRef, canvasGridOverlayRef, canvasDrawOverlayRef }) => {
    const {
      isRunning,
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      px,
      minPx,
      maxPx,
    } = useSelector(
      (state) => ({
        isRunning: state.life.isRunning,
        width: state.life.width,
        minWidth: state.life.minMaxLimits.width.min,
        maxWidth: state.life.minMaxLimits.width.max,
        height: state.life.height,
        minHeight: state.life.minMaxLimits.height.min,
        maxHeight: state.life.minMaxLimits.height.max,
        px: state.life.px,
        minPx: state.life.minMaxLimits.px.min,
        maxPx: state.life.minMaxLimits.px.max,
      }),
      shallowEqual
    );

    const changeCanvasSize = useCanvasSizeChange();
    const getCellDimensions = useCellDimensions();

    const handleWidthChange = React.useCallback(
      (val) => {
        const newWidth = clamp(val, minWidth, maxWidth);

        changeCanvasSize({
          canvasRef,
          canvasGridOverlayRef,
          canvasDrawOverlayRef,
          height,
          width: newWidth,
          px,
        });
      },
      [
        canvasRef,
        canvasGridOverlayRef,
        canvasDrawOverlayRef,
        minWidth,
        maxWidth,
        px,
        height,
        changeCanvasSize,
      ]
    );

    const handleHeightChange = React.useCallback(
      (val) => {
        const newHeight = clamp(val, minHeight, maxHeight);

        changeCanvasSize({
          canvasRef,
          canvasGridOverlayRef,
          canvasDrawOverlayRef,
          height: newHeight,
          width,
          px,
        });
      },
      [
        canvasRef,
        canvasGridOverlayRef,
        canvasDrawOverlayRef,
        minHeight,
        maxHeight,
        px,
        width,
        changeCanvasSize,
      ]
    );

    const handlePxChange = React.useCallback(
      (val) => {
        const newPx = clamp(val, minPx, maxPx);

        const { newWidth, newHeight } = isMobile
          ? getCellDimensions({
              isMobile,
              canvasRef,
              minWidth,
              maxWidth,
              minHeight,
              maxHeight,
              px: newPx,
            })
          : {
              newWidth: width,
              newHeight: height,
            };

        changeCanvasSize({
          canvasRef,
          canvasGridOverlayRef,
          canvasDrawOverlayRef,
          height: newHeight,
          width: newWidth,
          px: newPx,
        });
      },
      [
        canvasRef,
        canvasGridOverlayRef,
        canvasDrawOverlayRef,
        getCellDimensions,
        isMobile,
        maxPx,
        minPx,
        changeCanvasSize,
        height,
        width,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
      ]
    );

    return (
      <>
        {!isMobile ? (
          <Flex direction="column" justifySelf="stretch">
            <NumberSlider
              value={width}
              min={minWidth}
              max={maxWidth}
              onChange={handleWidthChange}
              isDisabled={isRunning}
              icon={AiOutlineColumnWidth}
            />

            <NumberSlider
              value={height}
              min={minHeight}
              max={maxHeight}
              onChange={handleHeightChange}
              isDisabled={isRunning}
              icon={AiOutlineColumnHeight}
            />

            <NumberSlider
              value={px}
              min={minPx}
              max={maxPx}
              onChange={handlePxChange}
              isDisabled={isRunning}
              icon={GiResize}
            />
          </Flex>
        ) : (
          <MobilePxSlider
            px={px}
            min={minPx}
            max={maxPx}
            onChange={handlePxChange}
            isDisabled={isRunning}
          />
        )}
      </>
    );
  }
);

WidthHeightPxSliders.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  canvasRef: PropTypes.object.isRequired,
  canvasGridOverlayRef: PropTypes.object.isRequired,
  canvasDrawOverlayRef: PropTypes.object.isRequired,
};

export default WidthHeightPxSliders;
