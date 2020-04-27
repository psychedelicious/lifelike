import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

// Components
import Header from 'features/menu/Header';
import Canvas from 'features/canvas/Canvas';
import MainControls from 'features/menu/MainControls';
import MainAccordion from 'features/menu/MainAccordion';

// Hooks
import { useAnimationFrame } from 'hooks/useAnimationFrame';
import { useCanvas } from 'features/canvas/useCanvas';
import { getCellDimensions } from 'features/life/getCellDimensions';
import { useKeyboardShortcuts } from 'features/life/useKeyboardShortcuts';

import { getNextCells, toggleIsRunning } from 'store/reducers/life';
import { setFps } from 'store/reducers/performance';
import { setColorMode } from 'store/reducers/theme';

const Lifelike = ({ isMobile, colorMode }) => {
  const {
    drawCells,
    drawGridlines,
    clearCanvas,
    changeCanvasSize,
  } = useCanvas();

  const dispatch = useDispatch();

  const cells = useSelector((state) => state.life.cells);
  const didAnyCellsChange = useSelector(
    (state) => state.life.didAnyCellsChange
  );

  const redrawCellList = useSelector((state) => state.life.redrawCellList);
  const shouldDrawAllCells = useSelector(
    (state) => state.life.shouldDrawAllCells
  );
  const shouldPauseOnStableState = useSelector(
    (state) => state.life.shouldPauseOnStableState
  );
  const height = useSelector((state) => state.life.height);
  const isRunning = useSelector((state) => state.life.isRunning);

  const { aliveCellColor, deadCellColor, gridlineColor } = useSelector(
    (state) => state.theme.colors,
    shallowEqual
  );
  const maxHeight = useSelector((state) => state.life.maxHeight);
  const maxWidth = useSelector((state) => state.life.maxWidth);
  const minHeight = useSelector((state) => state.life.minHeight);
  const minWidth = useSelector((state) => state.life.minWidth);
  const msDelay = useSelector((state) => state.performance.msDelay);
  const px = useSelector((state) => state.life.px);
  const shouldShowGridlines = useSelector(
    (state) => state.life.shouldShowGridlines
  );
  const width = useSelector((state) => state.life.width);

  const now = React.useRef(0);
  const lastTick = React.useRef(0);
  const lastFpsUpdate = React.useRef(0);
  const frametimeLog = React.useRef([]);
  const lastFps = React.useRef(0);

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
    if (isRunning && window.performance.now() - lastTick.current > msDelay) {
      dispatch(getNextCells());

      !didAnyCellsChange &&
        shouldPauseOnStableState &&
        dispatch(toggleIsRunning());

      now.current = window.performance.now();

      frametimeLog.current.push(now.current - lastTick.current);

      frametimeLog.current.length > lastFps.current &&
        frametimeLog.current.splice(
          0,
          frametimeLog.current.length - lastFps.current
        );

      if (now.current - lastFpsUpdate.current > 200) {
        lastFps.current = Math.round(
          1000 /
            (frametimeLog.current.reduce((total, val) => total + val, 0) /
              frametimeLog.current.length)
        );

        dispatch(setFps(lastFps.current));
        lastFpsUpdate.current = now.current;
      }
      lastTick.current = now.current;
    }
  });

  React.useEffect(() => {
    dispatch(setColorMode({ colorMode }));
  }, [dispatch, colorMode]);

  React.useEffect(() => {
    drawCells({
      aliveCellColor,
      canvasBaseLayer: canvasBaseLayerRef.current,
      cells,
      deadCellColor,
      height,
      px,
      width,
      redrawCellList,
      shouldDrawAllCells,
    });
  }, [
    aliveCellColor,
    cells,
    deadCellColor,
    height,
    drawCells,
    px,
    width,
    shouldDrawAllCells,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    clearCanvas({ canvas: canvasGridLayerRef.current });
    shouldShowGridlines &&
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
    shouldShowGridlines,
    width,
  ]);

  React.useEffect(() => {
    fitCellsToCanvas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gridStyle = React.useMemo(
    () => ({
      display: 'grid',
      width: '100%',
      height: '100%',
      columnGap: '1rem',
      alignItems: 'center',
      gridTemplateColumns: isMobile ? 'auto' : '22rem auto',
      gridTemplateAreas: isMobile
        ? `"."
"canvas"
"."
"."
"."
"."
"."
"."
"."
"."`
        : `". canvas"
". canvas"
". canvas"
". canvas"
". canvas"
". canvas"
". canvas"
". canvas"
". canvas"
". canvas"`,
      userSelect: 'none',
      touchAction: 'manipulation',
    }),
    [isMobile]
  );

  return (
    <div style={gridStyle}>
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
    </div>
  );
};

Lifelike.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default React.memo(Lifelike);
