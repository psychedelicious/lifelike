import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

// Chakra UI
import { Grid, useColorMode, Button } from '@chakra-ui/core';

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
  setColorMode,
  setPreviousFrameTime,
  toggleIsRunning,
  setFps,
} from 'store/reducers/life';

import MainAccordion from 'features/menu/MainAccordion';
// const CCapture = require('ccapture.js');

import CCapture from 'ccapture.js';

const Lifelike = ({ isMobile }) => {
  const {
    drawCells,
    drawGridlines,
    clearCanvas,
    changeCanvasSize,
  } = useCanvas();

  const { colorMode } = useColorMode();
  const dispatch = useDispatch();

  const cells = useSelector((state) => state.life.cells);
  const cellsChanged = useSelector((state) => state.life.cellsChanged);
  const shouldPauseOnStableState = useSelector(
    (state) => state.life.shouldPauseOnStableState
  );
  const height = useSelector((state) => state.life.height);
  const isRunning = useSelector((state) => state.life.isRunning);

  const { aliveCellColor, deadCellColor, gridlineColor } = useSelector(
    (state) => state.life.colors,
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
  const shouldShowGridlines = useSelector(
    (state) => state.life.shouldShowGridlines
  );
  const width = useSelector((state) => state.life.width);
  const [lastTick, setLastTick] = React.useState(0);
  const [now, setNow] = React.useState(0);
  const [lastFpsUpdate, setLastFpsUpdate] = React.useState(0);

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

  const [isRecording, setIsRecording] = React.useState(false);
  const recorder = React.useRef();
  const stream = React.useRef();
  // console.log(recorder.current);

  function startRecording() {
    const chunks = []; // here we will store our recorded media chunks (Blobs)
    stream.current = canvasBaseLayerRef.current.captureStream(); // grab our canvas MediaStream
    recorder.current = new MediaRecorder(stream.current, {
      videoBitsPerSecond: 2500000,
    }); // init the recorder
    // every time the recorder has new data, we will store it in our array
    recorder.current.ondataavailable = (e) => chunks.push(e.data);
    // only when the recorder stops, we construct a complete Blob from all the chunks
    recorder.current.onstop = (e) =>
      exportVid(new Blob(chunks, { type: 'video/webm' }));

    recorder.current.start();
  }

  function exportVid(blob) {
    const a = document.createElement('a');
    a.download = 'myvid.webm';
    a.href = URL.createObjectURL(blob);
    a.click();
  }

  const handleStartCapture = () => {
    startRecording();
    setIsRecording(true);
  };

  const handleStopCapture = () => {
    setIsRecording(false);
    recorder.current.stop();
  };

  useAnimationFrame(() => {
    if (isRunning && window.performance.now() - previousFrameTime > msDelay) {
      setNow(window.performance.now());

      dispatch(setPreviousFrameTime(window.performance.now()));

      dispatch(getNextCells());

      if (now - lastFpsUpdate > 200) {
        dispatch(setFps(Math.round(1000 / (now - lastTick))));
        setLastFpsUpdate(now);
      }

      setLastTick(now);

      !cellsChanged && shouldPauseOnStableState && dispatch(toggleIsRunning());
    }
  });

  React.useLayoutEffect(() => {
    dispatch(setColorMode({ colorMode }));
  }, [dispatch, colorMode]);

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
  }, [
    aliveCellColor,
    cells,
    deadCellColor,
    drawCells,
    height,
    px,
    width,
    isRecording,
  ]);

  React.useLayoutEffect(() => {
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
        isRecording={isRecording}
        handleStartCapture={handleStartCapture}
        handleStopCapture={handleStopCapture}
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
