import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

// Chakra UI
import { Grid, useColorMode } from '@chakra-ui/core';

// Components
import Canvas from 'features/canvas/Canvas';
import Header from 'features/menu/Header';
import MainControls from 'features/menu/MainControls';

// Hooks
import { useAnimationFrame } from 'hooks/useAnimationFrame';
import { useCanvas } from 'features/canvas/useCanvas';
import { getCellDimensions } from 'features/life/getCellDimensions';
import { useKeyboardShortcuts } from 'features/life/useKeyboardShortcuts';

import {
  getNextCells,
  setColors,
  setPreviousFrameTime,
  toggleIsRunning,
} from 'store/reducers/life';

import MainAccordion from 'features/menu/MainAccordion';

const Lifelike = ({ isMobile }) => {
  const {
    drawCells,
    drawGridlines,
    clearCanvas,
    changeCanvasSize,
  } = useCanvas();

  const { colorMode } = useColorMode();

  const cells = useSelector((state) => state.life.cells);
  const cellsChanged = useSelector((state) => state.life.cellsChanged);
  const stopOnStable = useSelector((state) => state.life.stopOnStable);

  const aliveCellColor = useSelector((state) => state.life.aliveCellColor);
  const darkModeColors = useSelector(
    (state) => state.life.darkModeColors,
    shallowEqual
  );
  const deadCellColor = useSelector((state) => state.life.deadCellColor);
  const gridlineColor = useSelector((state) => state.life.gridlineColor);
  const height = useSelector((state) => state.life.height);
  const isRunning = useSelector((state) => state.life.isRunning);
  const lightModeColors = useSelector(
    (state) => state.life.lightModeColors,
    shallowEqual
  );
  const maxHeight = useSelector((state) => state.life.maxHeight);
  const maxWidth = useSelector((state) => state.life.maxWidth);
  const minHeight = useSelector((state) => state.life.minHeight);
  const minWidth = useSelector((state) => state.life.minWidth);
  const msDelay = useSelector((state) => state.life.msDelay);
  const previousFrameTime = useSelector(
    (state) => state.life.previousFrameTime
  );
  const px = useSelector((state) => state.life.px);
  const showGridlines = useSelector((state) => state.life.showGridlines);
  const width = useSelector((state) => state.life.width);

  const dispatch = useDispatch();

  const canvasBaseLayerRef = React.useRef(null);
  const canvasGridLayerRef = React.useRef(null);
  const canvasDrawLayerRef = React.useRef(null);

  const fitCellsToCanvas = React.useCallback(() => {
    const { newWidth, newHeight } = getCellDimensions({
      canvasBaseLayerRef,
      isMobile,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      px,
    });
    changeCanvasSize({
      canvasBaseLayerRef,
      canvasDrawLayerRef,
      canvasGridLayerRef,
      height: newHeight,
      px,
      width: newWidth,
    });
  }, [
    changeCanvasSize,
    isMobile,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    px,
  ]);

  useKeyboardShortcuts({
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
    fitCellsToCanvas,
  });

  useAnimationFrame(() => {
    if (isRunning && window.performance.now() - previousFrameTime > msDelay) {
      dispatch(setPreviousFrameTime());
      dispatch(getNextCells());
      !cellsChanged && stopOnStable && dispatch(toggleIsRunning());
    }
  });

  React.useLayoutEffect(() => {
    colorMode === 'light'
      ? dispatch(setColors(lightModeColors))
      : dispatch(setColors(darkModeColors));
  }, [dispatch, darkModeColors, lightModeColors, colorMode]);

  React.useLayoutEffect(() => {
    drawCells({
      aliveCellColor,
      canvasBaseLayer: canvasBaseLayerRef.current,
      cells,
      deadCellColor,
      height,
      px,
      width,
    });
  }, [aliveCellColor, cells, deadCellColor, drawCells, height, px, width]);

  React.useLayoutEffect(() => {
    clearCanvas({ canvas: canvasGridLayerRef.current });
    showGridlines &&
      drawGridlines({
        canvasBaseLayer: canvasGridLayerRef.current,
        gridlineColor,
        width,
        height,
        px,
      });
  }, [
    clearCanvas,
    drawGridlines,
    gridlineColor,
    height,
    px,
    showGridlines,
    width,
  ]);

  React.useEffect(() => {
    // should only run on first render
    fitCellsToCanvas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid
      w="100%"
      h="100%"
      columnGap="1rem"
      alignItems="center"
      gridTemplateColumns={{
        base: 'auto',
        md: '22rem auto',
      }}
      gridTemplateAreas={{
        base: `"."
  "canvas"
  "."
  "."
  "."
  "."
  "."
  "."
  "."
  "."`,
        md: `". canvas"
    ". canvas"
    ". canvas"
    ". canvas"
    ". canvas"
    ". canvas"
    ". canvas"
    ". canvas"
    ". canvas"
    ". canvas"`,
      }}
      userSelect="none"
      style={{
        touchAction: 'manipulation',
      }}
    >
      <Header
        justify="space-between"
        alignItems="center"
        isMobile={isMobile}
        canvasBaseLayerRef={canvasBaseLayerRef}
        canvasGridLayerRef={canvasGridLayerRef}
      />

      <MainControls
        mt="0.5rem"
        justify="space-between"
        isMobile={isMobile}
        canvasBaseLayerRef={canvasBaseLayerRef}
        canvasGridLayerRef={canvasGridLayerRef}
        canvasDrawLayerRef={canvasDrawLayerRef}
      />

      <MainAccordion
        isMobile={isMobile}
        colorMode={colorMode}
        canvasBaseLayerRef={canvasBaseLayerRef}
        canvasGridLayerRef={canvasGridLayerRef}
        canvasDrawLayerRef={canvasDrawLayerRef}
      />

      <Canvas
        isMobile={isMobile}
        canvasBaseLayerRef={canvasBaseLayerRef}
        canvasGridLayerRef={canvasGridLayerRef}
        canvasDrawLayerRef={canvasDrawLayerRef}
      />
    </Grid>
  );
};

Lifelike.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default Lifelike;
