import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Chakra UI
import { Grid, useColorMode } from '@chakra-ui/core';

// Components
import Monitor from './menu/Monitor';
import NeighborhoodRadio from './menu/NeighborhoodRadio';
import SpeedSlider from './menu/SpeedSlider';
import Canvas from './canvas/Canvas';
import { Header } from './menu/Header';
import { MainControls } from './menu/MainControls';
import RuleCheckboxes from './menu/RuleCheckboxes';
import { OptionsCollapsible } from './menu/OptionsCollapsible';

// Hooks
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useGlobalKeyDown } from '../../hooks/useWindowEvent';
import { useCanvas } from './canvas/useCanvas';
import { useCanvasSizeChange } from './canvas/useCanvasSizeChange';
import { useCellDimensions } from './canvas/useCellDimensions';

import { getPointsOnLine } from '../../geometry/getPointsOnLine';

import {
  toggleIsRunning,
  toggleWrap,
  toggleShowStats,
  toggleShowGridlines,
  setSpeed,
  setNeighborhood,
  clearCells,
  randomizeCells,
  setPreviousFrameTime,
  getNextCells,
  setColors,
  setArrayOfCells,
  setCanvasOverlayText,
  setBrush,
} from '../../redux/actions';
import OptionsCheckboxes from './menu/OptionsCheckboxes';

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
    cells,
    width,
    height,
    px,
    showGridlines,
    isRunning,
    showStats,
    canvasWidth,
    canvasHeight,
    previousFrameTime,
    speed,
    msDelay,
    lightModeColors,
    darkModeColors,
    brushShape,
    brushRadius,
    brushPoints,
    brushFill,
    inEditMode,
    isInvertDraw,
    deadCellColor,
    aliveCellColor,
    gridlineColor,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
  } = useSelector((state) => ({
    cells: state.life.cells,
    cellsChanged: state.life.cellsChanged,
    width: state.life.width,
    height: state.life.height,
    px: state.life.px,
    neighborhood: state.life.neighborhood,
    born: state.life.born,
    survive: state.life.survive,
    wrap: state.life.wrap,
    showGridlines: state.life.showGridlines,
    isRunning: state.life.isRunning,
    showStats: state.life.showStats,
    canvasWidth: state.life.canvasWidth,
    canvasHeight: state.life.canvasHeight,
    canvasContainerWidth: state.life.canvasContainerWidth,
    canvasContainerHeight: state.life.canvasContainerHeight,
    previousFrameTime: state.life.previousFrameTime,
    speed: state.life.speed,
    msDelay: state.life.msDelay,
    lightModeColors: state.life.lightModeColors,
    darkModeColors: state.life.darkModeColors,
    layout: state.life.layout,
    canvasOverlayText: state.life.canvasOverlayText,
    brushShape: state.life.brushShape,
    brushRadius: state.life.brushRadius,
    brushPoints: state.life.brushPoints,
    brushFill: state.life.brushFill,
    inEditMode: state.life.inEditMode,
    isInvertDraw: state.life.isInvertDraw,
    deadCellColor: state.life.deadCellColor,
    aliveCellColor: state.life.aliveCellColor,
    gridlineColor: state.life.gridlineColor,
    minWidth: state.life.minMaxLimits.width.min,
    maxWidth: state.life.minMaxLimits.width.max,
    minHeight: state.life.minMaxLimits.height.min,
    maxHeight: state.life.minMaxLimits.height.max,
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
            canvas: canvasRef.current,
            canvasGridOverlay: canvasGridOverlayRef.current,
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

  const canvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
  const canvasGridOverlayRef = React.useRef(null);
  const canvasDrawOverlayRef = React.useRef(null);

  const canvasMousePos = React.useRef({ x: null, y: null });
  const cellMousePos = React.useRef({ x: null, y: null });

  const fitCellsToCanvas = React.useCallback(() => {
    const { newWidth, newHeight } = getCellDimensions({
      isMobile,
      canvasRef,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      px,
    });
    changeCanvasSize({
      canvasRef,
      canvasGridOverlayRef,
      canvasDrawOverlayRef,
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
    changeCanvasSize,
    getCellDimensions,
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
      canvas: canvasRef.current,
      deadCellColor,
      aliveCellColor,
      width,
      height,
      cells,
      px,
    });
  }, [cells, aliveCellColor, deadCellColor, drawCells, height, width, px]);

  React.useLayoutEffect(() => {
    clearCanvas({ canvas: canvasGridOverlayRef.current });
    showGridlines &&
      drawGridlines({
        canvas: canvasGridOverlayRef.current,
        gridlineColor,
        width,
        height,
        px,
      });
  }, [
    clearCanvas,
    gridlineColor,
    width,
    height,
    px,
    showGridlines,
    drawGridlines,
  ]);

  const handleCanvasPointerMove = React.useCallback(
    (e) => {
      e.preventDefault();
      if (inEditMode) {
        const canvasX = e.layerX - 1;
        const canvasY = e.layerY - 1;
        const x = Math.floor(canvasX / px);
        const y = Math.floor(canvasY / px);

        if (x >= 0 && x < width && y >= 0 && y < height) {
          const isAltKey = e.altKey;
          const context = canvasDrawOverlayRef.current.getContext('2d');
          const brushCells = brushPoints.map((point) => ({
            x: point.x + x,
            y: point.y + y,
            state: point.state,
          }));

          context.clearRect(0, 0, canvasWidth, canvasHeight);

          context.fillStyle =
            isAltKey !== isInvertDraw ? '#FF000075' : '#00FF0075';

          brushCells.forEach(
            (cell) =>
              cell.state && context.fillRect(cell.x * px, cell.y * px, px, px)
          );

          context.fillStyle = isAltKey !== isInvertDraw ? '#FF0000' : '#00FF00';
          context.fillRect(0, canvasY, canvasWidth, 1);
          context.fillRect(canvasX, 0, 1, canvasHeight);

          dispatch(
            setCanvasOverlayText({
              text: [
                `width: ${width}`,
                `height: ${height}`,
                `x: ${x}`,
                `y: ${y}`,
              ],
            })
          );

          if (e.buttons) {
            dispatch(
              setArrayOfCells({
                arrayOfCells: brushCells,
                invertState: isAltKey !== isInvertDraw,
              })
            );
            canvasMousePos.current = { x: canvasX, y: canvasY };
            cellMousePos.current = { x, y };
          }
        }
      }
    },
    [
      dispatch,
      brushPoints,
      canvasHeight,
      canvasWidth,
      height,
      inEditMode,
      isInvertDraw,
      px,
      width,
    ]
  );

  const handleCanvasPointerDown = React.useCallback(
    (e) => {
      e.preventDefault();
      if (inEditMode) {
        const canvasX = e.layerX - 1;
        const canvasY = e.layerY - 1;
        const x = Math.floor(canvasX / px);
        const y = Math.floor(canvasY / px);
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const isAltKey = e.altKey;

          let points;
          if (e.shiftKey && cellMousePos.current.x && cellMousePos.current.y) {
            let linePoints = getPointsOnLine(
              x,
              y,
              cellMousePos.current.x,
              cellMousePos.current.y
            );

            points = linePoints
              .map((linePoint) =>
                brushPoints.map((point) => ({
                  x: point.x + linePoint.x,
                  y: point.y + linePoint.y,
                  state: point.state,
                }))
              )
              .flat();
          } else {
            points = brushPoints.map((point) => ({
              x: point.x + x,
              y: point.y + y,
              state: point.state,
            }));
          }

          dispatch(
            setArrayOfCells({
              arrayOfCells: points,
              invertState: isAltKey !== isInvertDraw,
            })
          );
          canvasMousePos.current = { x: canvasX, y: canvasY };
          cellMousePos.current = { x, y };
        }
      }
    },
    [dispatch, brushPoints, height, inEditMode, isInvertDraw, px, width]
  );

  const handleCanvasPointerLeave = React.useCallback(() => {
    if (inEditMode) {
      const context = canvasDrawOverlayRef.current.getContext('2d');
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      dispatch(setCanvasOverlayText({ text: [] }));
    }
  }, [dispatch, canvasWidth, canvasHeight, inEditMode]);

  React.useLayoutEffect(() => {
    if (!isRunning) {
      const canvasDrawOverlay = canvasDrawOverlayRef.current;
      canvasDrawOverlay.addEventListener(
        'pointermove',
        handleCanvasPointerMove
      );
      canvasDrawOverlay.addEventListener(
        'pointerdown',
        handleCanvasPointerDown
      );
      canvasDrawOverlay.addEventListener(
        'pointerleave',
        handleCanvasPointerLeave
      );
      return () => {
        canvasDrawOverlay.removeEventListener(
          'pointermove',
          handleCanvasPointerMove
        );
        canvasDrawOverlay.removeEventListener(
          'pointerdown',
          handleCanvasPointerDown
        );
        canvasDrawOverlay.removeEventListener(
          'pointerleave',
          handleCanvasPointerLeave
        );
        const context = canvasDrawOverlay.getContext('2d');
        context.clearRect(0, 0, canvasWidth, canvasHeight);
      };
    }
  }, [
    handleCanvasPointerDown,
    handleCanvasPointerLeave,
    handleCanvasPointerMove,
    canvasWidth,
    canvasHeight,
    isRunning,
  ]);

  React.useLayoutEffect(() => {
    fitCellsToCanvas();
    dispatch(setBrush({ brushShape, brushRadius, brushFill }));
  }, [dispatch, brushShape, brushRadius, brushFill]); // eslint-disable-line react-hooks/exhaustive-deps

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
        canvasRef={canvasRef}
        canvasGridOverlayRef={canvasGridOverlayRef}
      />

      <MainControls
        mt="0.5rem"
        justify="space-between"
        isMobile={isMobile}
        isOptionsOpen={isOptionsOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        canvasRef={canvasRef}
        canvasGridOverlayRef={canvasGridOverlayRef}
        canvasDrawOverlayRef={canvasDrawOverlayRef}
      />

      <OptionsCollapsible
        mt="0.5rem"
        isMobile={isMobile}
        isOpen={isOptionsOpen}
        canvasRef={canvasRef}
        canvasGridOverlayRef={canvasGridOverlayRef}
        canvasDrawOverlayRef={canvasDrawOverlayRef}
      />

      <RuleCheckboxes />

      <NeighborhoodRadio mt="0.5rem" direction="row" />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          direction: 'row',
          marginTop: '0.5rem',
        }}
      >
        <OptionsCheckboxes />
      </div>

      <SpeedSlider mt="0.5rem" justifySelf="center" />

      {showStats && <Monitor mt="0.5rem" />}

      <Canvas
        gridArea="canvas"
        alignSelf="start"
        p={0}
        m={0}
        mt={isMobile ? '0.5rem' : '0'}
        canvasContainerRef={canvasContainerRef}
        canvasRef={canvasRef}
        canvasGridOverlayRef={canvasGridOverlayRef}
        canvasDrawOverlayRef={canvasDrawOverlayRef}
      />
    </Grid>
  );
};

export default Lifelike;
