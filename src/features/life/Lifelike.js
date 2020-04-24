import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

// Chakra UI
import { useColorMode } from '@chakra-ui/core';

// Components
import Canvas from 'features/canvas/Canvas';
import Header from 'features/menu/Header';
import MainControls from 'features/menu/MainControls';

import { saveAs } from 'file-saver';

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

import JSZip from 'jszip';

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

  const [isRecordingArchive, setIsRecordingArchive] = React.useState(false);
  const zip = React.useRef();
  const recordingArchiveFileIndex = React.useRef(0);

  const getCanvasBlob = (canvasLayer1, canvasLayer2, callback) => {
    if (canvasLayer2) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasLayer1.width;
      tempCanvas.height = canvasLayer1.height;

      const tempContext = tempCanvas.getContext('2d');

      tempContext.drawImage(canvasLayer1, 0, 0);
      tempContext.drawImage(canvasLayer2, 0, 0);

      return tempCanvas.toBlob(callback);
    } else {
      return canvasLayer1.toBlob(callback);
    }
  };

  const handleStartRecordingArchive = React.useCallback(() => {
    setIsRecordingArchive(true);
    recordingArchiveFileIndex.current = 0;
    zip.current = new JSZip();
  }, []);

  const handleStopRecordingArchive = React.useCallback(() => {
    setIsRecordingArchive(false);
    zip.current.generateAsync({ type: 'blob' }).then(function (blob) {
      saveAs(blob, 'lifelike.zip');
    });
  }, []);

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

  const exportVid = React.useCallback((blob) => {
    const a = document.createElement('a');
    a.download = 'myvid.mp4';
    a.href = URL.createObjectURL(blob);
    a.click();
  }, []);

  const startRecording = React.useCallback(() => {
    const chunks = []; // here we will store our recorded media chunks (Blobs)
    stream.current = canvasBaseLayerRef.current.captureStream(); // grab our canvas MediaStream
    recorder.current = new MediaRecorder(stream.current, {
      videoBitsPerSecond: 10000000,
    }); // init the recorder
    // every time the recorder has new data, we will store it in our array
    recorder.current.ondataavailable = (e) =>
      e.data && e.data.size > 0 && chunks.push(e.data);
    // only when the recorder stops, we construct a complete Blob from all the chunks
    recorder.current.onstop = (e) =>
      exportVid(new Blob(chunks, { type: 'video/mp4' }));

    // console.log(recorder.current, stream.current)
    recorder.current.start();
    // recorder.current.pause();
  }, [exportVid]);

  const handleStartCapture = React.useCallback(() => {
    startRecording();
    setIsRecording(true);
  }, [startRecording]);

  const handleStopCapture = React.useCallback(() => {
    setIsRecording(false);
    recorder.current.stop();
  }, []);

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
    if (isRecordingArchive) {
      getCanvasBlob(
        canvasBaseLayerRef.current,
        canvasGridLayerRef.current,
        (blob) =>
          zip.current.file(`${recordingArchiveFileIndex.current}.png`, blob)
      );
      recordingArchiveFileIndex.current++;
    }
  }, [
    aliveCellColor,
    cells,
    deadCellColor,
    height,
    drawCells,
    px,
    width,
    isRecordingArchive,
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

  React.useLayoutEffect(() => {
    fitCellsToCanvas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React.useLayoutEffect(() => {
  //   if (isRecordingArchive) {
  //     getCanvasBlob(
  //       canvasBaseLayerRef.current,
  //       canvasGridLayerRef.current,
  //       (blob) =>
  //         zip.current.file(`${recordingArchiveFileIndex.current}.png`, blob)
  //     );
  //     recordingArchiveFileIndex.current++;
  //   }
  // }, [cells]);

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
        isRecording={isRecording}
        handleStartCapture={handleStartCapture}
        handleStopCapture={handleStopCapture}
        isRecordingArchive={isRecordingArchive}
        handleStopRecordingArchive={handleStopRecordingArchive}
        handleStartRecordingArchive={handleStartRecordingArchive}
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

export default React.memo(Lifelike, (prevProps, nextProps) => {
  console.log('Prev:', prevProps);
  console.log('Next:', nextProps);
  return prevProps === nextProps;
});
