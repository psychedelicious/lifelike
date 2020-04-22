import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { clamp } from 'lodash';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';
import { Flex, Button } from '@chakra-ui/core';

import { NumberSlider } from 'features/menu/NumberSlider';
import { MobilePxSlider } from 'features/menu/MobilePxSlider';
import { useCanvas } from 'features/canvas/useCanvas';
import { getCellDimensions } from 'features/life/getCellDimensions';
import { FaExpand } from 'react-icons/fa';

const WidthHeightPxSliders = React.memo(
  ({
    isMobile,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
  }) => {
    const isRunning = useSelector((state) => state.life.isRunning);
    const width = useSelector((state) => state.life.width);
    const minWidth = useSelector((state) => state.life.minWidth);
    const maxWidth = useSelector((state) => state.life.maxWidth);
    const height = useSelector((state) => state.life.height);
    const minHeight = useSelector((state) => state.life.minHeight);
    const maxHeight = useSelector((state) => state.life.maxHeight);
    const px = useSelector((state) => state.life.px);
    const minPx = useSelector((state) => state.life.minPx);
    const maxPx = useSelector((state) => state.life.maxPx);

    const { changeCanvasSize } = useCanvas();

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

    const handleFitCellsToCanvas = React.useCallback(() => {
      const { newWidth, newHeight } = getCellDimensions({
        isMobile,
        canvasBaseLayerRef,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        px,
      });
      changeCanvasSize({
        canvasBaseLayerRef,
        canvasGridLayerRef,
        canvasDrawLayerRef,
        height: newHeight,
        width: newWidth,
        px,
      });
    }, [
      isMobile,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      px,
      canvasBaseLayerRef,
      canvasGridLayerRef,
      canvasDrawLayerRef,
      changeCanvasSize,
    ]);

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

            <Button
              style={{ userSelect: 'none' }}
              leftIcon={FaExpand}
              isDisabled={isRunning}
              variant="solid"
              size="sm"
              my="0.25rem"
              aria-label="expand/shrink grid to fit"
              fontWeight="400"
              onClick={handleFitCellsToCanvas}
            >
              fit grid to screen
            </Button>
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
