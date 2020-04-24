import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

// Chakra UI
// import { useColorMode } from '@chakra-ui/core';

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
  toggleIsRunning,
  setFps,
  setIsRecordingVideo,
} from 'store/reducers/life';

import MainAccordion from 'features/menu/MainAccordion';

const Lifelike = ({ isMobile, colorMode }) => {
  const {
    drawCells,
    drawGridlines,
    clearCanvas,
    changeCanvasSize,
  } = useCanvas();

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
  const px = useSelector((state) => state.life.px);
  const shouldShowGridlines = useSelector(
    (state) => state.life.shouldShowGridlines
  );
  const width = useSelector((state) => state.life.width);

  const lastTick = React.useRef(0);
  const now = React.useRef(0);
  const lastFpsUpdate = React.useRef(0);

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

  const recorder = React.useRef();
  const stream = React.useRef();

  const exportVid = React.useCallback((blob) => {
    const a = document.createElement('a');
    const uid = Math.random().toString(36).substr(2, 9);
    a.download = `lifelike_${uid}.webm`;
    a.href = URL.createObjectURL(blob);
    a.click();
  }, []);

  const startRecording = React.useCallback(() => {
    const chunks = []; // here we will store our recorded media chunks (Blobs)
    let mimeType;
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      mimeType = 'video/webm;codecs=vp8';
    }

    stream.current = canvasBaseLayerRef.current.captureStream(); // grab our canvas MediaStream

    recorder.current = new MediaRecorder(stream.current, {
      videoBitsPerSecond: 10000000,
      mimeType,
    }); // init the recorder
    // every time the recorder has new data, we will store it in our array
    recorder.current.ondataavailable = (e) =>
      e.data && e.data.size > 0 && chunks.push(e.data);
    // only when the recorder stops, we construct a complete Blob from all the chunks
    recorder.current.onstop = (e) =>
      exportVid(new Blob(chunks, { type: 'video/webm' }));
    recorder.current.start();
  }, [exportVid]);

  const handleStartCapture = React.useCallback(() => {
    startRecording();
    dispatch(setIsRecordingVideo(true));
  }, [dispatch, startRecording]);

  const handleStopCapture = React.useCallback(() => {
    dispatch(setIsRecordingVideo(false));
    recorder.current.stop();
  }, [dispatch]);

  useAnimationFrame(() => {
    if (isRunning && window.performance.now() - lastTick.current > msDelay) {
      dispatch(getNextCells());

      !cellsChanged && shouldPauseOnStableState && dispatch(toggleIsRunning());

      now.current = window.performance.now();

      if (now.current - lastFpsUpdate.current > 200) {
        dispatch(setFps(Math.round(1000 / (now.current - lastTick.current))));
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
    });
  }, [aliveCellColor, cells, deadCellColor, height, drawCells, px, width]);

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
    </div>
  );
};

Lifelike.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default React.memo(Lifelike);
