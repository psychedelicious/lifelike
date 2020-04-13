import React from 'react';
import { clamp } from 'lodash';
// import useMousePosition from '@react-hook/mouse-position';

// Chakra UI
import { Grid, useTheme } from '@chakra-ui/core';

// Components
import { Canvas } from './canvas/Canvas';
import { Header } from './menu/Header';
import { MainControls } from './menu/MainControls';
import { SliderControls } from './menu/SliderControls';
import { NeighborhoodRadio } from './menu/NeighborhoodRadio';
import { RuleCheckboxRow } from './menu/RuleCheckboxRow';
import { Monitor } from './menu/Monitor';
import { SpeedSlider } from './menu/SpeedSlider';
import { StyledCheckbox } from './menu/StyledCheckbox';

// Functions
import { createCells } from './createCells';
import { getNextCells } from './getNextCells';
import { Neighborhoods } from './neighborhoods';
import { drawCells } from './canvas/drawCells';
import { drawGridLines } from './canvas/drawGridLines';
import { clearCanvas } from './canvas/clearCanvas';

// Hooks
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useGlobalKeyDown } from '../../hooks/useWindowEvent';

const gridTemplateRows = {
  base: '2rem 1fr 3rem auto 2rem 2rem 2rem 2rem 2rem 4rem',
  md: 'auto',
};

const gridTemplateColumns = { base: 'auto', md: '18.5rem auto' };

const gridTemplateAreas = {
  base: `"header"
    "canvas"
    "maincontrols"
    "slidercontrols"
    "speedslider"
    "bornrule"
    "surviverule"
    "neighborhoodradio"
    "gridlineswrap"
    "monitor"`,
  md: `"header canvas"
    "maincontrols canvas"
    "slidercontrols canvas"
    "speedslider canvas"
    "bornrule canvas"
    "surviverule canvas"
    "neighborhoodradio canvas"
    "gridlineswrap canvas"
    "monitor canvas"
    ". canvas"`,
};

const minMaxLimits = {
  cellWidth: {
    min: 1,
    max: 2000,
  },
  cellHeight: {
    min: 1,
    max: 2000,
  },
  cellSize: {
    min: 1,
    max: 25,
  },
  interval: {
    min: 0,
    max: 100,
  },
};

const CHANGE_CELLS = 'CHANGE_CELLS';
const POPULATE_CELLS_RANDOM = 'POPULATE_CELLS_RANDOM';
const CHANGE_CELLSIZE = 'CHANGE_CELLSIZE';
const CHANGE_CELLHEIGHT = 'CHANGE_CELLHEIGHT';
const CHANGE_CELLWIDTH = 'CHANGE_CELLWIDTH';

const gridReducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CELLSIZE:
      return {
        ...state,
        px: action.payload.px,
      };
    case CHANGE_CELLHEIGHT:
      return {
        ...state,
        height: action.payload.height,
      };
    case CHANGE_CELLWIDTH:
      return {
        ...state,
        width: action.payload.width,
      };
    case CHANGE_CELLS:
      return {
        ...state,
        cells: action.payload.cells,
      };
    case POPULATE_CELLS_RANDOM:
      return {
        ...state,
        cells: createCells({
          cellWidth: state.width,
          cellHeight: state.height,
        }),
      };
    default:
      throw new Error(`Action type ${action.type} unrecognized`);
  }
};

export const Lifelike = ({ isMobile }) => {
  const theme = useTheme();

  const [state, dispatch] = React.useReducer(gridReducer, {
    cells: [],
    width: 0,
    height: 0,
    px: 5,
  });

  const [population, setPopulation] = React.useState(0);
  const [neighborhood, setNeighborhood] = React.useState(Neighborhoods.MOORE);
  const [born, setBorn] = React.useState([
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [survive, setSurvive] = React.useState([
    false,
    false,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [wrap, setWrap] = React.useState(true);

  const [cellWidth, setCellWidth] = React.useState(1);
  const [cellHeight, setCellHeight] = React.useState(1);
  const [cellSize, setCellSize] = React.useState(5);

  const [lastConfigChange, setLastConfigChange] = React.useState(
    window.performance.now()
  );

  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);

  const [deadCellColor, setDeadCellColor] = React.useState(
    theme.colors.gray['100']
  );

  const [aliveCellColor, setAliveCellColor] = React.useState(
    theme.colors.gray['700']
  );

  const [gridLineColor, setGridLineColor] = React.useState(
    theme.colors.gray['300']
  );

  const [showStats, setShowStats] = React.useState(true);

  const [canvasWidth, setCanvasWidth] = React.useState(0);
  const [canvasHeight, setCanvasHeight] = React.useState(0);

  const [canvasContainerWidth, setCanvasContainerWidth] = React.useState(0);
  const [canvasContainerHeight, setCanvasContainerHeight] = React.useState(0);

  const [showGridLines, setShowGridLines] = React.useState(false);

  const [generations, setGenerations] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  const [currentFps, setCurrentFps] = React.useState(0);
  const [previousFrameTime, setPreviousFrameTime] = React.useState(0);
  const [lastFpsUpdate, setLastFpsUpdate] = React.useState(0);

  const [interval, setInterval] = React.useState(70);
  const [fpsInterval, setFpsInterval] = React.useState(
    Math.pow(100 - interval, 3) / 1000
  );

  // const [mousePosition, mousePositionRef] = useMousePosition(
  //   0, // enterDelay
  //   0, // leaveDelay
  //   10 // fps
  // );

  const fpsLogRef = React.useRef([]);
  const canvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
  const canvasOverlayRef = React.useRef(null);

  const handleToggleIsRunning = React.useCallback(() => {
    setIsRunning((isRunning) => !isRunning);
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleWrapChange = React.useCallback(
    (e) => {
      const newWrap = !wrap;
      setWrap(newWrap);
    },
    [wrap]
  );

  const handleToggleStats = React.useCallback(
    (e) => {
      const newShowStats = !showStats;
      setShowStats(newShowStats);
    },
    [showStats]
  );

  const handleCanvasSizeChange = React.useCallback(
    ({
      newCellWidth = cellWidth,
      newCellHeight = cellHeight,
      newCellSize = cellSize,
    }) => {
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const newCanvasHeight = newCellHeight * newCellSize;
      const newCanvasWidth = newCellWidth * newCellSize;

      setCellSize(newCellSize);
      setCellWidth(newCellWidth);
      setCellHeight(newCellHeight);
      setCanvasWidth(newCanvasWidth);
      setCanvasHeight(newCanvasHeight);

      canvasRef.current.width = newCanvasWidth;
      canvasRef.current.height = newCanvasHeight;

      canvasOverlayRef.current.width = newCanvasWidth;
      canvasOverlayRef.current.height = newCanvasHeight;

      setCanvasContainerWidth(newCanvasWidth + rem + 2);
      setCanvasContainerHeight(newCanvasHeight + rem + 2);

      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleToggleGridLines = React.useCallback(() => {
    const newShowGridLines = !showGridLines;

    setShowGridLines(newShowGridLines);
    clearCanvas({ canvas: canvasOverlayRef.current });

    if (newShowGridLines) {
      drawGridLines({
        gridLineColor,
        canvas: canvasOverlayRef.current,
        cellHeight,
        cellWidth,
        cellSize,
      });
    }
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleCellWidthChange = React.useCallback(
    (val) => {
      const newCellWidth = clamp(
        val,
        minMaxLimits.cellWidth.min,
        minMaxLimits.cellWidth.max
      );

      handleCanvasSizeChange({ newCellWidth });

      const [newCells, newPopulation] = createCells({
        cellHeight,
        cellWidth: newCellWidth,
        fill: state.cells,
      });

      // setCells(newCells);

      dispatch({ type: CHANGE_CELLS, payload: { cells: newCells } });

      setPopulation(newPopulation);

      clearCanvas({ canvas: canvasOverlayRef.current });

      if (showGridLines) {
        drawGridLines({
          gridLineColor,
          canvas: canvasOverlayRef.current,
          cellHeight,
          cellWidth: newCellWidth,
          cellSize,
        });
      }

      window.requestAnimationFrame(() =>
        drawCells({
          aliveCellColor,
          deadCellColor,
          cellSize,
          cellHeight,
          canvas: canvasRef.current,
          cells: newCells,
          cellWidth: newCellWidth,
        })
      );
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleCellHeightChange = React.useCallback(
    (val) => {
      const newCellHeight = clamp(
        val,
        minMaxLimits.cellHeight.min,
        minMaxLimits.cellHeight.max
      );

      handleCanvasSizeChange({ newCellHeight });

      const [newCells, newPopulation] = createCells({
        cellWidth,
        cellHeight: newCellHeight,
        fill: state.cells,
      });

      // setCells(newCells);
      dispatch({ type: CHANGE_CELLS, payload: { cells: newCells } });

      setPopulation(newPopulation);

      clearCanvas({ canvas: canvasOverlayRef.current });

      if (showGridLines) {
        drawGridLines({
          gridLineColor,
          canvas: canvasOverlayRef.current,
          cellHeight: newCellHeight,
          cellWidth,
          cellSize,
        });
      }

      window.requestAnimationFrame(() =>
        drawCells({
          aliveCellColor,
          deadCellColor,
          cellSize,
          cellWidth,
          canvas: canvasRef.current,
          cells: newCells,
          cellHeight: newCellHeight,
        })
      );
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleCellSizeChange = React.useCallback(
    (val) => {
      const newCellSize = clamp(
        val,
        minMaxLimits.cellSize.min,
        minMaxLimits.cellSize.max
      );

      setCellSize(newCellSize);

      handleCanvasSizeChange({ newCellSize });

      clearCanvas({ canvas: canvasOverlayRef.current });

      if (showGridLines) {
        drawGridLines({
          gridLineColor,
          canvas: canvasOverlayRef.current,
          cellHeight,
          cellWidth,
          cellSize: newCellSize,
        });
      }

      window.requestAnimationFrame(() =>
        drawCells({
          aliveCellColor,
          deadCellColor,
          cells: state.cells,
          cellWidth,
          cellHeight,
          cellSize: newCellSize,
          canvas: canvasRef.current,
        })
      );
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleIntervalChange = React.useCallback((val) => {
    const newInterval = clamp(
      val,
      minMaxLimits.interval.min,
      minMaxLimits.interval.max
    );
    setInterval(newInterval);
    setFpsInterval(Math.pow(100 - newInterval, 3) / 1000);
    fpsLogRef.current = [];
  }, []);

  const handleNeighborhoodChange = React.useCallback((val) => {
    const newNeighborhood = Neighborhoods[val];
    setNeighborhood(newNeighborhood);
  }, []);

  const handleRuleChange = React.useCallback(
    (ruleType, index) => {
      ruleType === 'born'
        ? setBorn(born.map((val, i) => (i === index ? !val : val)))
        : setSurvive(survive.map((val, i) => (i === index ? !val : val)));
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleClearCells = React.useCallback(() => {
    const [newCells, newPopulation] = createCells({
      cellHeight,
      cellWidth,
      fill: 0,
    });

    // setCells(newCells);
    dispatch({ type: CHANGE_CELLS, payload: { cells: newCells } });

    setPopulation(newPopulation);
    setGenerations(0);
    setCurrentFps(0);
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        aliveCellColor,
        deadCellColor,
        cellSize,
        cellWidth,
        cellHeight,
        canvas: canvasRef.current,
        cells: newCells,
      })
    );
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleRandomizeCells = React.useCallback(() => {
    const [newCells, newPopulation] = createCells({ cellHeight, cellWidth });

    // setCells(newCells);
    dispatch({ type: CHANGE_CELLS, payload: { cells: newCells } });

    setPopulation(newPopulation);
    setGenerations(0);
    setCurrentFps(0);
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        aliveCellColor,
        deadCellColor,
        cellSize,
        cellWidth,
        cellHeight,
        canvas: canvasRef.current,
        cells: newCells,
      })
    );
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleToggleOptions = React.useCallback(() => {
    setIsOptionsOpen((isOptionsOpen) => !isOptionsOpen);
  }, []);

  const fitCellsToCanvas = React.useCallback(() => {
    // calculate 1 rem in px
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const canvasRect = canvasRef.current.getBoundingClientRect();

    // TODO: get this dynamically - currently hardcoded from padding and border widths *sigh*
    const widthOffset = rem * 1;
    const heightOffset = rem * 1;

    const mobileHeightOffset = isMobile
      ? gridTemplateRows.base
          .split(' ')
          .reduce(
            (total, val) =>
              val.match(/rem/)
                ? total + parseInt(val.replace('rem', '')) * rem
                : total,
            0
          )
      : 0;

    const newCellWidth = clamp(
      Math.trunc(
        (window.innerWidth - canvasRect.left - widthOffset) / cellSize
      ),
      minMaxLimits.cellWidth.min,
      minMaxLimits.cellWidth.max
    );

    const newCellHeight = clamp(
      Math.trunc(
        (window.innerHeight -
          canvasRect.top -
          heightOffset -
          mobileHeightOffset) /
          cellSize
      ),
      minMaxLimits.cellHeight.min,
      minMaxLimits.cellHeight.max
    );

    handleCanvasSizeChange({ newCellWidth, newCellHeight });

    const [newCells, newPopulation] = createCells({
      cellWidth: newCellWidth,
      cellHeight: newCellHeight,
      fill: state.cells.length ? state.cells : 'random',
    });

    // setCells(newCells);
    dispatch({ type: CHANGE_CELLS, payload: { cells: newCells } });

    setPopulation(newPopulation);

    drawCells({
      canvas: canvasRef.current,
      cells: newCells,
      cellSize: cellSize,
      cellWidth: newCellWidth,
      cellHeight: newCellHeight,
      aliveCellColor,
      deadCellColor,
    });

    clearCanvas({ canvas: canvasOverlayRef.current });

    if (showGridLines) {
      drawGridLines({
        gridLineColor,
        canvas: canvasOverlayRef.current,
        cellHeight: newCellHeight,
        cellWidth: newCellWidth,
        cellSize: cellSize,
      });
    }

    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleClickTick = React.useCallback(() => {
    tick();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  React.useLayoutEffect(fitCellsToCanvas, []);

  useAnimationFrame(() => {
    if (
      isRunning &&
      window.performance.now() - previousFrameTime > fpsInterval
    ) {
      fpsLogRef.current.push(
        1000 / (window.performance.now() - previousFrameTime)
      );

      if (window.performance.now() - lastFpsUpdate > 200) {
        setCurrentFps(
          Math.round(
            (fpsLogRef.current.reduce((acc, val) => acc + val) /
              fpsLogRef.current.length) *
              10
          ) / 10
        );
        setLastFpsUpdate(window.performance.now());
      }

      if (fpsLogRef.current.length > currentFps) fpsLogRef.current.shift();

      setPreviousFrameTime(window.performance.now());

      tick();
    }
  });

  const tick = () => {
    const [newCells, newPopulation] = getNextCells({
      cells: state.cells,
      cellWidth,
      cellHeight,
      born,
      survive,
      wrap,
      neighborhood,
    });

    // setCells(newCells);
    dispatch({ type: CHANGE_CELLS, payload: { cells: newCells } });

    setPopulation(newPopulation);
    setGenerations((generations) => generations + 1);

    drawCells({
      aliveCellColor,
      deadCellColor,
      cellSize,
      cellWidth,
      cellHeight,
      canvas: canvasRef.current,
      cells: newCells,
    });
  };

  useGlobalKeyDown((e) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        handleToggleIsRunning();
        break;
      case 'c':
        !isRunning && handleClearCells();
        break;
      case 'r':
        !isRunning && handleRandomizeCells();
        break;
      case 'f':
        !isRunning && fitCellsToCanvas();
        break;
      case 'g':
        handleToggleGridLines();
        break;
      case 'w':
        handleWrapChange();
        break;
      case '8':
        handleNeighborhoodChange('MOORE');
        break;
      case '4':
        handleNeighborhoodChange('VONNEUMANN');
        break;
      case '6':
        handleNeighborhoodChange('HEXAGONAL');
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleIntervalChange(interval + 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleIntervalChange(interval - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        !isRunning && handleClickTick();
        break;
      default:
        break;
    }
  });

  return (
    <Grid
      w="100%"
      h="100%"
      rowGap="0.5rem"
      columnGap="1rem"
      alignItems="center"
      gridTemplateColumns={gridTemplateColumns}
      gridTemplateAreas={gridTemplateAreas}
    >
      <Header gridArea="header" justify="space-between" alignItems="center" />

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
      />

      <SliderControls
        gridArea="slidercontrols"
        isMobile={isMobile}
        isOpen={isOptionsOpen}
        cellWidth={cellWidth}
        onCellWidthChange={handleCellWidthChange}
        cellHeight={cellHeight}
        onCellHeightChange={handleCellHeightChange}
        cellSize={cellSize}
        onCellSizeChange={handleCellSizeChange}
        minMaxLimits={minMaxLimits}
        isRunning={isRunning}
      />

      <SpeedSlider
        gridArea={'speedslider'}
        justifySelf="center"
        w="calc(100% - 2rem)"
        interval={interval}
        fpsInterval={fpsInterval}
        min={minMaxLimits.interval.min}
        max={minMaxLimits.interval.max}
        onChange={handleIntervalChange}
      />

      <RuleCheckboxRow
        gridArea="born"
        ruleArray={born}
        ruleType="born"
        onChange={handleRuleChange}
      />

      <RuleCheckboxRow
        gridArea="surive"
        ruleArray={survive}
        ruleType="survive"
        onChange={handleRuleChange}
      />

      <NeighborhoodRadio
        direction="row"
        gridArea="neighborhoodradio"
        neighborhood={neighborhood}
        onChange={handleNeighborhoodChange}
      />

      <div
        style={{
          gridArea: 'gridlineswrap',
          display: 'flex',
          justifyContent: 'space-between',
          direction: 'row',
        }}
      >
        <StyledCheckbox
          isChecked={showGridLines}
          onChange={handleToggleGridLines}
          label="gridlines"
        />

        <StyledCheckbox
          isChecked={wrap}
          onChange={handleWrapChange}
          label="wrap"
        />

        <StyledCheckbox
          isChecked={showStats}
          onChange={handleToggleStats}
          label="stats"
        />
      </div>

      {showStats && (
        <Monitor
          gridArea="monitor"
          generations={generations}
          currentFps={currentFps}
          population={population}
        />
      )}

      <Canvas
        gridArea="canvas"
        alignSelf="start"
        p={0}
        m={0}
        canvasContainerRef={canvasContainerRef}
        canvasContainerWidth={canvasContainerWidth}
        canvasContainerHeight={canvasContainerHeight}
        canvasRef={canvasRef}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        canvasOverlayRef={canvasOverlayRef}
        isRunning={isRunning}
        // mousePositionRef={mousePositionRef}
      />
    </Grid>
  );
};
