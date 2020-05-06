import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { clamp } from 'lodash';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';
import { Flex } from '@chakra-ui/core';

import NumberSlider from 'features/menu/NumberSlider';

import { useCanvas } from 'features/canvas/useCanvas';
import { getCellDimensions } from 'features/life/getCellDimensions';
import { FaExpand } from 'react-icons/fa';
import ConfirmDialogue from './ConfirmDialogue';

const GridAndCellSizeControls = ({
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
          <ConfirmDialogue
            style={{ touchAction: 'manipulation' }}
            icon={FaExpand}
            isDisabled={isRunning}
            header="fit grid to window"
            buttonText="fit grid to window"
            aria="fit grid to window"
            message={`are you sure you want to fit the grid to the window? if it is larger than the available space, it will be cropped!`}
            confirmedCallback={handleFitCellsToCanvas}
            shortcutKey="f"
            variantColor="blue"
            mr="0.5rem"
            flex="1 1 auto"
          />

          <NumberSlider
            value={width}
            min={minWidth}
            max={maxWidth}
            onChange={handleWidthChange}
            isDisabled={isRunning}
            icon={AiOutlineColumnWidth}
            tooltip={'grid width (cells)'}
          />

          <NumberSlider
            value={height}
            min={minHeight}
            max={maxHeight}
            onChange={handleHeightChange}
            isDisabled={isRunning}
            icon={AiOutlineColumnHeight}
            tooltip={'grid height (cells)'}
          />

          <NumberSlider
            value={px}
            min={minPx}
            max={maxPx}
            onChange={handlePxChange}
            isDisabled={isRunning}
            icon={GiResize}
            tooltip={'cell size (px)'}
          />
        </Flex>
      ) : (
        <NumberSlider
          value={px}
          min={minPx}
          max={maxPx}
          onChange={handlePxChange}
          isDisabled={isRunning}
          icon={GiResize}
        />
      )}
    </>
  );
};

GridAndCellSizeControls.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default React.memo(GridAndCellSizeControls);
