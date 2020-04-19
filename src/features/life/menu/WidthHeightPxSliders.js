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
  ({
    isMobile,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
  }) => {
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
        minWidth: state.life.minWidth,
        maxWidth: state.life.maxWidth,
        height: state.life.height,
        minHeight: state.life.minHeight,
        maxHeight: state.life.maxHeight,
        px: state.life.px,
        minPx: state.life.minPx,
        maxPx: state.life.maxPx,
      }),
      shallowEqual
    );

    const changeCanvasSize = useCanvasSizeChange();
    const getCellDimensions = useCellDimensions();

    const handleWidthChange = React.useCallback(
      (val) => {
        const newWidth = clamp(val, minWidth, maxWidth);

        changeCanvasSize({
          canvasBaseLayerRef,
          canvasGridLayerRef,
          canvasDrawLayerRef,
          height,
          width: newWidth,
          px,
        });
      },
      [
        canvasBaseLayerRef,
        canvasGridLayerRef,
        canvasDrawLayerRef,
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
          canvasBaseLayerRef,
          canvasGridLayerRef,
          canvasDrawLayerRef,
          height: newHeight,
          width,
          px,
        });
      },
      [
        canvasBaseLayerRef,
        canvasGridLayerRef,
        canvasDrawLayerRef,
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
              canvasBaseLayerRef,
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
          canvasBaseLayerRef,
          canvasGridLayerRef,
          canvasDrawLayerRef,
          height: newHeight,
          width: newWidth,
          px: newPx,
        });
      },
      [
        canvasBaseLayerRef,
        canvasGridLayerRef,
        canvasDrawLayerRef,
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
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default WidthHeightPxSliders;
