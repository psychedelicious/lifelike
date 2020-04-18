import React from 'react';
import { connect } from 'react-redux';

import { clamp } from 'lodash';

// Chakra UI
import { Grid, useColorMode } from '@chakra-ui/core';

// Components
import { Canvas } from './canvas/Canvas';
import { Header } from './menu/Header';
import { MainControls } from './menu/MainControls';
import { Monitor } from './menu/Monitor';
import { NeighborhoodRadio } from './menu/NeighborhoodRadio';
import { RuleCheckboxRow } from './menu/RuleCheckboxRow';
import { OptionsCollapsibles } from './menu/OptionsCollapsible';
import { SpeedSlider } from './menu/SpeedSlider';
import { StyledCheckbox } from './menu/StyledCheckbox';

// Hooks
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useGlobalKeyDown } from '../../hooks/useWindowEvent';
import { useCanvas } from './canvas/useCanvas';

import { getPointsOnLine } from '../../geometry/getPointsOnLine';

import {
  toggleIsRunning,
  toggleWrap,
  toggleShowStats,
  setGrid,
  toggleShowGridlines,
  setSpeed,
  setNeighborhood,
  setBorn,
  setSurvive,
  clearCells,
  randomizeCells,
  setPreviousFrameTime,
  getNextCells,
  setColors,
  toggleLayout,
  setArrayOfCells,
  setCanvasOverlayText,
  setBrush,
  toggleInEditMode,
  toggleIsInvertDraw,
} from '../../redux/actions';

const gridTemplateColumnsLeft = {
  base: 'auto',
  md: '20rem auto',
};

const gridTemplateColumnsRight = {
  base: 'auto',
  md: 'auto 20rem',
};

const gridTemplateAreasBase = `"."
  "canvas"
  "."
  "."
  "."
  "."
  "."
  "."
  "."
  "."`;

const gridTemplateAreasLeft = {
  base: gridTemplateAreasBase,
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

const gridTemplateAreasRight = {
  base: gridTemplateAreasBase,
  md: `"canvas ."
    "canvas ."
    "canvas ."
    "canvas ."
    "canvas ."
    "canvas ."
    "canvas ."
    "canvas ."
    "canvas ."
    "canvas ."`,
};

const minMaxLimits = {
  width: {
    min: 1,
    max: 2000,
  },
  height: {
    min: 1,
    max: 2000,
  },
  px: {
    min: 1,
    max: 25,
  },
  speed: {
    min: 0,
    max: 100,
  },
};

const withModifiers = (e) => {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
};

const Lifelike = ({
  isMobile, // state values
  cells,
  width,
  height,
  px,
  neighborhood,
  born,
  survive,
  wrap,
  showGridlines,
  isRunning,
  showStats,
  generation,
  population,
  density,
  canvasWidth,
  canvasHeight,
  canvasContainerWidth,
  canvasContainerHeight,
  previousFrameTime,
  speed,
  msDelay,
  lightModeColors,
  darkModeColors,
  layout,
  canvasOverlayText,
  brushShape,
  brushRadius,
  brushPoints,
  brushFill,
  inEditMode,
  isInvertDraw,
  deadCellColor,
  aliveCellColor,
  gridlineColor,
  // state setters
  toggleIsRunning,
  toggleWrap,
  toggleShowStats,
  setGrid,
  toggleShowGridlines,
  setSpeed,
  setNeighborhood,
  setBorn,
  setSurvive,
  clearCells,
  randomizeCells,
  setPreviousFrameTime,
  getNextCells,
  setColors,
  toggleLayout,
  setArrayOfCells,
  setCanvasOverlayText,
  setBrush,
  toggleInEditMode,
  toggleIsInvertDraw,
}) => {
  const { drawCells, drawGridlines, clearCanvas } = useCanvas();

  const { colorMode, toggleColorMode } = useColorMode();

  useGlobalKeyDown((e) => {
    switch (e.key) {
      case ' ':
        if (!withModifiers(e)) {
          e.originalTarget.blur();
          e.preventDefault();
          e.target.blur();
          handleToggleIsRunning();
        }
        break;
      case 'c':
        if (!withModifiers(e)) {
          handleClearCells();
        }
        break;
      case 'r':
        if (!withModifiers(e)) {
          handleRandomizeCells();
        }
        break;
      case 'f':
        if (!isRunning && !withModifiers(e)) {
          fitCellsToCanvas();
        }
        break;
      case 'g':
        if (!withModifiers(e)) {
          handleToggleGridlines();
        }
        break;
      case 'w':
        if (!withModifiers(e)) {
          handleToggleWrap();
        }
        break;
      case 's':
        if (!withModifiers(e)) {
          // handleSaveImage();
        }
        break;
      case 'i':
        if (!withModifiers(e)) {
          handleToggleShowStats();
        }
        break;
      case '8':
        if (!withModifiers(e)) {
          handleNeighborhoodChange('MOORE');
        }
        break;
      case '4':
        if (!withModifiers(e)) {
          handleNeighborhoodChange('VONNEUMANN');
        }
        break;
      case '6':
        if (!withModifiers(e)) {
          handleNeighborhoodChange('HEXAGONAL');
        }
        break;
      case 'ArrowUp':
        if (!withModifiers(e)) {
          e.preventDefault();
          handleSpeedChange(speed + 1);
        }
        break;
      case 'd':
        if (!withModifiers(e)) {
          e.preventDefault();
          handleToggleColorMode();
        }
        break;
      case 'ArrowDown':
        if (!withModifiers(e)) {
          e.preventDefault();
          handleSpeedChange(speed - 1);
        }
        break;
      case 'ArrowRight':
        if (!withModifiers(e) && !isRunning) {
          e.preventDefault();
          handleClickTick();
        }
        break;
      default:
        break;
    }
  });

  const [lastConfigChange, setLastConfigChange] = React.useState(0);

  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);

  const canvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
  const canvasGridOverlayRef = React.useRef(null);
  const canvasDrawOverlayRef = React.useRef(null);

  const canvasMousePos = React.useRef({ x: null, y: null });
  const cellMousePos = React.useRef({ x: null, y: null });

  const handleToggleColorMode = React.useCallback(() => {
    toggleColorMode();
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleLayout = React.useCallback(() => {
    toggleLayout();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleIsRunning = React.useCallback(() => {
    toggleIsRunning();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleWrap = React.useCallback(() => {
    toggleWrap();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleShowStats = React.useCallback(() => {
    toggleShowStats();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCanvasSizeChange = React.useCallback(
    ({ newWidth = width, newHeight = height, newPx = px }) => {
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const newCanvasHeight = newHeight * newPx;
      const newCanvasWidth = newWidth * newPx;

      canvasRef.current.width = newCanvasWidth;
      canvasRef.current.height = newCanvasHeight;

      canvasGridOverlayRef.current.width = newCanvasWidth;
      canvasGridOverlayRef.current.height = newCanvasHeight;

      canvasDrawOverlayRef.current.width = newCanvasWidth;
      canvasDrawOverlayRef.current.height = newCanvasHeight;

      setGrid({
        width: newWidth,
        height: newHeight,
        px: newPx,
        canvasWidth: newCanvasWidth,
        canvasHeight: newCanvasHeight,
        canvasContainerWidth: newCanvasWidth + rem + 2,
        canvasContainerHeight: newCanvasHeight + rem + 2,
      });

      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleToggleGridlines = React.useCallback(() => {
    toggleShowGridlines();

    !showGridlines
      ? drawGridlines({
          canvas: canvasGridOverlayRef.current,
          gridlineColor,
          width,
          height,
          px,
        })
      : clearCanvas({ canvas: canvasGridOverlayRef.current });

    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWidthChange = React.useCallback(
    (val) => {
      const newWidth = clamp(
        val,
        minMaxLimits.width.min,
        minMaxLimits.width.max
      );

      handleCanvasSizeChange({ newWidth });
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleHeightChange = React.useCallback(
    (val) => {
      const newHeight = clamp(
        val,
        minMaxLimits.height.min,
        minMaxLimits.height.max
      );

      handleCanvasSizeChange({ newHeight });
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handlePxChange = React.useCallback(
    (val) => {
      if (val === 'increment') {
        val = px + 1;
      } else if (val === 'decrement') {
        val = px - 1;
      }

      const newPx = clamp(val, minMaxLimits.px.min, minMaxLimits.px.max);
      if (isMobile) {
        const { newWidth, newHeight } = getCellDimensions(newPx);
        handleCanvasSizeChange({ newWidth, newHeight, newPx });
      } else {
        handleCanvasSizeChange({ newPx });
      }
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSpeedChange = React.useCallback(
    (val) => {
      const speed = clamp(val, minMaxLimits.speed.min, minMaxLimits.speed.max);

      setSpeed({ speed });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleBrushShapeChange = React.useCallback(
    (newShape) => {
      setBrush({
        brushShape: newShape,
        brushRadius,
        brushFill,
      });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleBrushRadiusChange = React.useCallback(
    (val) => {
      const newRadius = clamp(val, 1, 25);
      setBrush({
        brushShape,
        brushRadius: newRadius,
        brushFill,
      });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleBrushFillChange = React.useCallback(
    (newFill) => {
      setBrush({
        brushShape,
        brushRadius,
        brushFill: newFill,
      });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleNeighborhoodChange = React.useCallback(
    (neighborhood) => {
      setNeighborhood({ neighborhood });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleRuleChange = React.useCallback(
    (ruleType, index) => {
      ruleType === 'born' ? setBorn({ index }) : setSurvive({ index });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleClearCells = React.useCallback(() => {
    clearCells();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRandomizeCells = React.useCallback(() => {
    randomizeCells();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleOptions = React.useCallback(() => {
    setIsOptionsOpen((isOptionsOpen) => !isOptionsOpen);
  }, []);

  const handleClickTick = React.useCallback(() => {
    getNextCells();
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCellDimensions = React.useCallback(
    (newPx = px) => {
      // calculate 1 rem in px
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const canvasRect = canvasRef.current.getBoundingClientRect();

      // TODO: get the offsets dynamically
      const widthOffset = isMobile ? 0.5 * rem : rem;
      const heightOffset = isMobile ? 17 * rem : rem;

      // the canvas has a 1px border * 2 for each x and y
      const borderWidth = 2;

      const newWidth = clamp(
        Math.trunc(
          (window.innerWidth - canvasRect.left - widthOffset - borderWidth) /
            newPx
        ),
        minMaxLimits.width.min,
        minMaxLimits.width.max
      );

      const newHeight = clamp(
        Math.trunc(
          (window.innerHeight - canvasRect.top - heightOffset - borderWidth) /
            newPx
        ),
        minMaxLimits.height.min,
        minMaxLimits.height.max
      );

      return { newWidth, newHeight };
    },
    [lastConfigChange, isMobile] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleToggleEditMode = React.useCallback(() => {
    toggleInEditMode();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const fitCellsToCanvas = React.useCallback(() => {
    const { newWidth, newHeight } = getCellDimensions();
    handleCanvasSizeChange({ newWidth, newHeight });
  }, [lastConfigChange, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  useAnimationFrame(() => {
    if (isRunning && window.performance.now() - previousFrameTime > msDelay) {
      setPreviousFrameTime();
      getNextCells();
    }
  });

  React.useLayoutEffect(() => {
    colorMode === 'light'
      ? setColors(lightModeColors)
      : setColors(darkModeColors);
    setLastConfigChange(window.performance.now());
  }, [colorMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [cells, lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

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

          setCanvasOverlayText({
            text: [
              `width: ${width}`,
              `height: ${height}`,
              `x: ${x}`,
              `y: ${y}`,
            ],
          });

          if (e.buttons) {
            setArrayOfCells({
              arrayOfCells: brushCells,
              invertState: isAltKey !== isInvertDraw,
            });
            canvasMousePos.current = { x: canvasX, y: canvasY };
            cellMousePos.current = { x, y };
          }
        }
      }
    },
    [lastConfigChange]
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

          setArrayOfCells({
            arrayOfCells: points,
            invertState: isAltKey !== isInvertDraw,
          });
          canvasMousePos.current = { x: canvasX, y: canvasY };
          cellMousePos.current = { x, y };
        }
      }
    },
    [lastConfigChange]
  );

  const handleCanvasPointerLeave = React.useCallback(() => {
    if (inEditMode) {
      const context = canvasDrawOverlayRef.current.getContext('2d');
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      setCanvasOverlayText({ text: [] });
    }
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleIsInvertDraw = React.useCallback(() => {
    toggleIsInvertDraw();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

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
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useLayoutEffect(() => {
    fitCellsToCanvas();
    setBrush({ brushShape, brushRadius, brushFill });
  }, []);

  return (
    <Grid
      w="100%"
      h="100%"
      columnGap="1rem"
      alignItems="center"
      gridTemplateColumns={
        layout === 'left' ? gridTemplateColumnsLeft : gridTemplateColumnsRight
      }
      gridTemplateAreas={
        layout === 'left' ? gridTemplateAreasLeft : gridTemplateAreasRight
      }
    >
      <Header
        justify="space-between"
        alignItems="center"
        isMobile={isMobile}
        colorMode={colorMode}
        handleToggleColorMode={handleToggleColorMode}
        handleToggleLayout={handleToggleLayout}
        canvasRef={canvasRef}
        canvasGridOverlayRef={canvasGridOverlayRef}
      />

      <MainControls
        mt="0.5rem"
        justify="space-between"
        isRunning={isRunning}
        onClickStartStop={handleToggleIsRunning}
        onClickTick={handleClickTick}
        onClickRandomizeCells={handleRandomizeCells}
        onClickClearCells={handleClearCells}
        onClickFitCellsToCanvas={fitCellsToCanvas}
        onClickToggleOptions={handleToggleOptions}
        isOptionsOpen={isOptionsOpen}
        inEditMode={inEditMode}
        onClickToggleEditMode={handleToggleEditMode}
      />

      <OptionsCollapsibles
        mt="0.5rem"
        isMobile={isMobile}
        isOpen={isOptionsOpen}
        width={width}
        onWidthChange={handleWidthChange}
        height={height}
        onHeightChange={handleHeightChange}
        px={px}
        onPxChange={handlePxChange}
        brushShape={brushShape}
        onBrushShapeChange={handleBrushShapeChange}
        brushRadius={brushRadius}
        onBrushRadiusChange={handleBrushRadiusChange}
        brushFill={brushFill}
        onBrushFillChange={handleBrushFillChange}
        isInvertDraw={isInvertDraw}
        onToggleIsInvertDraw={handleToggleIsInvertDraw}
        minMaxLimits={minMaxLimits}
        isRunning={isRunning}
        inEditMode={inEditMode}
      />

      <RuleCheckboxRow
        mt="0.5rem"
        ruleArray={born}
        ruleType="born"
        onChange={handleRuleChange}
      />

      <RuleCheckboxRow
        mt="0.5rem"
        ruleArray={survive}
        ruleType="survive"
        onChange={handleRuleChange}
      />

      <NeighborhoodRadio
        mt="0.5rem"
        direction="row"
        neighborhood={neighborhood}
        onChange={handleNeighborhoodChange}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          direction: 'row',
          marginTop: '0.5rem',
        }}
      >
        <StyledCheckbox
          isChecked={showGridlines}
          onChange={handleToggleGridlines}
          label="gridlines"
        />

        <StyledCheckbox
          isChecked={wrap}
          onChange={handleToggleWrap}
          label="wrap"
        />

        <StyledCheckbox
          isChecked={showStats}
          onChange={handleToggleShowStats}
          label="stats"
        />
      </div>

      <SpeedSlider
        mt="0.5rem"
        justifySelf="center"
        // w="calc(100% - 2rem)"
        speed={speed}
        msDelay={msDelay}
        min={minMaxLimits.speed.min}
        max={minMaxLimits.speed.max}
        onChange={handleSpeedChange}
      />

      {showStats && (
        <Monitor
          mt="0.5rem"
          generation={generation}
          population={population}
          density={density}
        />
      )}

      <Canvas
        gridArea="canvas"
        alignSelf="start"
        p={0}
        m={0}
        mt={isMobile ? '0.5rem' : '0'}
        canvasContainerRef={canvasContainerRef}
        canvasContainerWidth={canvasContainerWidth}
        canvasContainerHeight={canvasContainerHeight}
        canvasRef={canvasRef}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        canvasGridOverlayRef={canvasGridOverlayRef}
        canvasDrawOverlayRef={canvasDrawOverlayRef}
        canvasOverlayText={canvasOverlayText}
        isRunning={isRunning}
      />
    </Grid>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isMobile: ownProps.isMobile,
    cells: state.life.cells,
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
    generation: state.life.generation,
    population: state.life.population,
    density: state.life.density,
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
  };
};

const mapDispatchToProps = {
  toggleIsRunning,
  toggleWrap,
  toggleShowStats,
  setGrid,
  toggleShowGridlines,
  setSpeed,
  setNeighborhood,
  setBorn,
  setSurvive,
  clearCells,
  randomizeCells,
  setPreviousFrameTime,
  getNextCells,
  setColors,
  toggleLayout,
  setArrayOfCells,
  setCanvasOverlayText,
  setBrush,
  toggleInEditMode,
  toggleIsInvertDraw,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lifelike);
