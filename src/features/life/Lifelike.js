import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Chakra UI
import { Grid, useColorMode } from '@chakra-ui/core';

// Components
import Canvas from './canvas/Canvas';
import Header from './menu/Header';
import MainControls from './menu/MainControls';
import Monitor from './menu/Monitor';
import NeighborhoodRadio from './menu/NeighborhoodRadio';
import OptionsCheckboxes from './menu/OptionsCheckboxes';
import OptionsCollapsible from './menu/OptionsCollapsible';
import RuleCheckboxes from './menu/RuleCheckboxes';
import SpeedSlider from './menu/SpeedSlider';

// Hooks
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useCanvas } from './canvas/useCanvas';
import { useCanvasSizeChange } from './canvas/useCanvasSizeChange';
import { useCellDimensions } from './canvas/useCellDimensions';
import { useGlobalKeyDown } from '../../hooks/useWindowEvent';

import {
  clearCells,
  getNextCells,
  randomizeCells,
  setBrush,
  setColors,
  setNeighborhood,
  setPreviousFrameTime,
  setSpeed,
  toggleIsRunning,
  toggleShowGridlines,
  toggleShowStats,
  toggleWrap,
} from '../../redux/actions';

const gridTemplateColumns = {
  base: 'auto',
  md: '20rem auto',
};

const gridTemplateAreas = {
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
};

const withModifiers = (e) => {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
};

const Lifelike = ({ isMobile }) => {
  const {
    drawCells,
    drawGridlines,
    clearCanvas,
    saveCanvasAsImage,
  } = useCanvas();

  const { colorMode, toggleColorMode } = useColorMode();
  const changeCanvasSize = useCanvasSizeChange();
  const getCellDimensions = useCellDimensions();

  const {
    aliveCellColor,
    brushFill,
    brushRadius,
    brushShape,
    cells,
    darkModeColors,
    deadCellColor,
    gridlineColor,
    height,
    isRunning,
    lightModeColors,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    msDelay,
    previousFrameTime,
    px,
    showGridlines,
    showStats,
    speed,
    width,
  } = useSelector((state) => ({
    aliveCellColor: state.life.aliveCellColor,
    brushFill: state.life.brushFill,
    brushRadius: state.life.brushRadius,
    brushShape: state.life.brushShape,
    cells: state.life.cells,
    darkModeColors: state.life.darkModeColors,
    deadCellColor: state.life.deadCellColor,
    gridlineColor: state.life.gridlineColor,
    height: state.life.height,
    isRunning: state.life.isRunning,
    lightModeColors: state.life.lightModeColors,
    maxHeight: state.life.maxHeight,
    maxWidth: state.life.maxWidth,
    minHeight: state.life.minHeight,
    minWidth: state.life.minWidth,
    msDelay: state.life.msDelay,
    previousFrameTime: state.life.previousFrameTime,
    px: state.life.px,
    showGridlines: state.life.showGridlines,
    showStats: state.life.showStats,
    speed: state.life.speed,
    width: state.life.width,
  }));

  const dispatch = useDispatch();

  useGlobalKeyDown((e) => {
    switch (e.key) {
      case ' ':
        if (!withModifiers(e)) {
          e.preventDefault();
          e.target.blur();
          dispatch(toggleIsRunning());
        }
        break;
      case 'c':
        if (!withModifiers(e)) {
          dispatch(clearCells());
        }
        break;
      case 'r':
        if (!withModifiers(e)) {
          dispatch(randomizeCells());
        }
        break;
      case 'f':
        if (!isRunning && !withModifiers(e)) {
          fitCellsToCanvas();
        }
        break;
      case 'g':
        if (!withModifiers(e)) {
          dispatch(toggleShowGridlines());
        }
        break;
      case 'w':
        if (!withModifiers(e)) {
          dispatch(toggleWrap());
        }
        break;
      case 's':
        if (!withModifiers(e)) {
          saveCanvasAsImage({
            canvasBaseLayer: canvasBaseLayerRef.current,
            canvasGridLayer: canvasGridLayerRef.current,
          });
        }
        break;
      case 'i':
        if (!withModifiers(e)) {
          dispatch(toggleShowStats());
        }
        break;
      case '8':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood('MOORE'));
        }
        break;
      case '4':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood('VONNEUMANN'));
        }
        break;
      case '6':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood('HEXAGONAL'));
        }
        break;
      case 'd':
        if (!withModifiers(e)) {
          e.preventDefault();
          dispatch(toggleColorMode());
        }
        break;
      case 'ArrowUp':
        if (!withModifiers(e)) {
          e.preventDefault();
          dispatch(setSpeed({ speed: speed + 1 }));
        }
        break;
      case 'ArrowDown':
        if (!withModifiers(e)) {
          e.preventDefault();
          dispatch(setSpeed({ speed: speed - 1 }));
        }
        break;
      case 'ArrowRight':
        if (!withModifiers(e) && !isRunning) {
          e.preventDefault();
          dispatch(getNextCells());
        }
        break;
      default:
        break;
    }
  });

  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);

  const canvasBaseLayerRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
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
    getCellDimensions,
    isMobile,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    px,
  ]);

  useAnimationFrame(() => {
    if (isRunning && window.performance.now() - previousFrameTime > msDelay) {
      dispatch(setPreviousFrameTime());
      dispatch(getNextCells());
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
    clearCanvas({ canvasBaseLayer: canvasGridLayerRef.current });
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
    dispatch(setBrush({ brushShape, brushRadius, brushFill }));
  }, [brushFill, brushRadius, brushShape, dispatch]);

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
      gridTemplateColumns={gridTemplateColumns}
      gridTemplateAreas={gridTemplateAreas}
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
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        canvasBaseLayerRef={canvasBaseLayerRef}
        canvasGridLayerRef={canvasGridLayerRef}
        canvasDrawLayerRef={canvasDrawLayerRef}
      />

      <OptionsCollapsible
        mt="0.5rem"
        isMobile={isMobile}
        isOpen={isOptionsOpen}
        canvasBaseLayerRef={canvasBaseLayerRef}
        canvasGridLayerRef={canvasGridLayerRef}
        canvasDrawLayerRef={canvasDrawLayerRef}
      />

      <RuleCheckboxes />

      <NeighborhoodRadio mt="0.5rem" direction="row" />

      <OptionsCheckboxes
        display="flex"
        justifyContent="space-between"
        direction="row"
        marginTop="0.5rem"
      />

      <SpeedSlider mt="0.5rem" justifySelf="center" />

      {showStats && <Monitor mt="0.5rem" />}

      <Canvas
        gridArea="canvas"
        alignSelf="start"
        p={0}
        m={0}
        mt={isMobile ? '0.5rem' : '0'}
        canvasContainerRef={canvasContainerRef}
        canvasBaseLayerRef={canvasBaseLayerRef}
        canvasGridLayerRef={canvasGridLayerRef}
        canvasDrawLayerRef={canvasDrawLayerRef}
      />
    </Grid>
  );
};

export default Lifelike;
