import React from 'react';
import { clamp } from 'lodash';
// import useMousePosition from '@react-hook/mouse-position';

// Chakra UI
import { Grid } from '@chakra-ui/core';

// Components
import { Canvas } from './canvas/Canvas';
import { Header } from './menu/Header';
import { MainControls } from './menu/MainControls';
import { Monitor } from './menu/Monitor';
import { NeighborhoodRadio } from './menu/NeighborhoodRadio';
import { RuleCheckboxRow } from './menu/RuleCheckboxRow';
import { SliderControls } from './menu/SliderControls';
import { SpeedSlider } from './menu/SpeedSlider';
import { StyledCheckbox } from './menu/StyledCheckbox';

// Hooks
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useGlobalKeyDown } from '../../hooks/useWindowEvent';
import { useLifeCanvas } from './canvas/useLifeCanvas';

import {
  useStore,
  CLEAR_CELLS,
  GET_NEXT_CELLS,
  RANDOMIZE_CELLS,
  SET_BORN,
  SET_FPS,
  SET_GRID,
  SET_INTERVAL,
  SET_NEIGHBORHOOD,
  SET_PREVIOUSFRAMETIME,
  SET_SURVIVE,
  TOGGLE_ISRUNNING,
  TOGGLE_SHOWGRIDLINES,
  TOGGLE_SHOWSTATS,
  TOGGLE_WRAP,
  SET_LASTCONFIGCHANGE,
} from '../../store';

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

export const Lifelike = ({ isMobile }) => {
  const { drawCells, drawGridlines } = useLifeCanvas();

  const { state, dispatch } = useStore();

  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);

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
    dispatch({ type: TOGGLE_ISRUNNING });
  }, [state.lastConfigChange]);

  const handleToggleWrap = React.useCallback(() => {
    dispatch({ type: TOGGLE_WRAP });
  }, [state.lastConfigChange]);

  const handleToggleShowStats = React.useCallback(() => {
    dispatch({ type: TOGGLE_SHOWSTATS });
  }, [state.lastConfigChange]);

  const handleCanvasSizeChange = React.useCallback(
    ({
      newCellWidth = state.width,
      newCellHeight = state.height,
      newCellSize = state.px,
    }) => {
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const newCanvasHeight = newCellHeight * newCellSize;
      const newCanvasWidth = newCellWidth * newCellSize;

      canvasRef.current.width = newCanvasWidth;
      canvasRef.current.height = newCanvasHeight;

      canvasOverlayRef.current.width = newCanvasWidth;
      canvasOverlayRef.current.height = newCanvasHeight;

      dispatch({
        type: SET_GRID,
        payload: {
          width: newCellWidth,
          height: newCellHeight,
          px: newCellSize,
          canvasWidth: newCanvasWidth,
          canvasHeight: newCanvasHeight,
          canvasContainerWidth: newCanvasWidth + rem + 2,
          canvasContainerHeight: newCanvasHeight + rem + 2,
        },
      });

      // clearCanvas({ canvas: canvasOverlayRef.current });

      drawGridlines({ canvas: canvasOverlayRef.current });

      window.requestAnimationFrame(() =>
        drawCells({ canvas: canvasRef.current })
      );
    },
    [state.lastConfigChange]
  );

  const handleToggleGridlines = React.useCallback(() => {
    dispatch({ type: TOGGLE_SHOWGRIDLINES });
    drawGridlines({ canvas: canvasOverlayRef.current });
  }, [dispatch, drawGridlines]);

  const handleCellWidthChange = React.useCallback(
    (val) => {
      const newCellWidth = clamp(
        val,
        minMaxLimits.cellWidth.min,
        minMaxLimits.cellWidth.max
      );

      handleCanvasSizeChange({ newCellWidth });
    },
    [state.lastConfigChange]
  );

  const handleCellHeightChange = React.useCallback(
    (val) => {
      const newCellHeight = clamp(
        val,
        minMaxLimits.cellHeight.min,
        minMaxLimits.cellHeight.max
      );

      handleCanvasSizeChange({ newCellHeight });
    },
    [state.lastConfigChange]
  );

  const handleCellSizeChange = React.useCallback(
    (val) => {
      const newCellSize = clamp(
        val,
        minMaxLimits.cellSize.min,
        minMaxLimits.cellSize.max
      );

      handleCanvasSizeChange({ newCellSize });
    },
    [state.lastConfigChange]
  );

  const handleIntervalChange = React.useCallback(
    (val) => {
      const newInterval = clamp(
        val,
        minMaxLimits.interval.min,
        minMaxLimits.interval.max
      );

      dispatch({ type: SET_INTERVAL, interval: newInterval });
      fpsLogRef.current = [];
    },
    [state.lastConfigChange]
  );

  const handleNeighborhoodChange = React.useCallback(
    (val) => {
      dispatch({ type: SET_NEIGHBORHOOD, neighborhood: val });
    },
    [state.lastConfigChange]
  );

  const handleRuleChange = React.useCallback(
    (ruleType, index) => {
      ruleType === 'born'
        ? dispatch({ type: SET_BORN, index })
        : dispatch({ type: SET_SURVIVE, index });
    },
    [state.lastConfigChange]
  );

  const handleClearCells = React.useCallback(() => {
    dispatch({ type: CLEAR_CELLS });
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        canvas: canvasRef.current,
      })
    );
  }, [state.lastConfigChange]);

  const handleRandomizeCells = React.useCallback(() => {
    dispatch({ type: RANDOMIZE_CELLS });
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        canvas: canvasRef.current,
      })
    );
  }, [state.lastConfigChange]);

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
        (window.innerWidth - canvasRect.left - widthOffset) / state.px
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
          state.px
      ),
      minMaxLimits.cellHeight.min,
      minMaxLimits.cellHeight.max
    );

    handleCanvasSizeChange({ newCellWidth, newCellHeight });
  }, [state.lastConfigChange, isMobile]);

  React.useLayoutEffect(fitCellsToCanvas, []);

  useAnimationFrame(() => {
    if (
      state.isRunning &&
      window.performance.now() - state.previousFrameTime > state.fpsInterval
    ) {
      fpsLogRef.current.push(
        1000 / (window.performance.now() - state.previousFrameTime)
      );

      if (window.performance.now() - state.lastFpsUpdate > 200) {
        dispatch({
          type: SET_FPS,
          fps:
            Math.round(
              (fpsLogRef.current.reduce((acc, val) => acc + val) /
                fpsLogRef.current.length) *
                10
            ) / 10,
        });
      }

      if (fpsLogRef.current.length > state.fps) fpsLogRef.current.shift();

      dispatch({
        type: SET_PREVIOUSFRAMETIME,
        previousFrameTime: window.performance.now(),
      });

      tick();
    }
  });

  const tick = () => {
    dispatch({ type: GET_NEXT_CELLS });
    window.requestAnimationFrame(() =>
      drawCells({
        canvas: canvasRef.current,
      })
    );
  };

  const handleClickTick = React.useCallback(() => {
    tick();
  }, [state.lastConfigChange]);

  useGlobalKeyDown((e) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        handleToggleIsRunning();
        break;
      case 'c':
        !state.isRunning && handleClearCells();
        break;
      case 'r':
        !state.isRunning && handleRandomizeCells();
        break;
      case 'f':
        !state.isRunning && fitCellsToCanvas();
        break;
      case 'g':
        handleToggleGridlines();
        break;
      case 'w':
        handleToggleWrap();
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
        handleIntervalChange(state.interval + 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleIntervalChange(state.interval - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        !state.isRunning && handleClickTick();
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
        isRunning={state.isRunning}
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
        cellWidth={state.width}
        onCellWidthChange={handleCellWidthChange}
        cellHeight={state.height}
        onCellHeightChange={handleCellHeightChange}
        cellSize={state.px}
        onCellSizeChange={handleCellSizeChange}
        minMaxLimits={minMaxLimits}
        isRunning={state.isRunning}
      />

      <SpeedSlider
        gridArea={'speedslider'}
        justifySelf="center"
        w="calc(100% - 2rem)"
        interval={state.interval}
        fpsInterval={state.fpsInterval}
        min={minMaxLimits.interval.min}
        max={minMaxLimits.interval.max}
        onChange={handleIntervalChange}
      />

      <RuleCheckboxRow
        gridArea="born"
        ruleArray={state.born}
        ruleType="born"
        onChange={handleRuleChange}
      />

      <RuleCheckboxRow
        gridArea="surive"
        ruleArray={state.survive}
        ruleType="survive"
        onChange={handleRuleChange}
      />

      <NeighborhoodRadio
        direction="row"
        gridArea="neighborhoodradio"
        neighborhood={state.neighborhood}
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
          isChecked={state.showGridlines}
          onChange={handleToggleGridlines}
          label="gridlines"
        />

        <StyledCheckbox
          isChecked={state.wrap}
          onChange={handleToggleWrap}
          label="wrap"
        />

        <StyledCheckbox
          isChecked={state.showStats}
          onChange={handleToggleShowStats}
          label="stats"
        />
      </div>

      {state.showStats && (
        <Monitor
          gridArea="monitor"
          generations={state.generations}
          fps={state.fps}
          // population={population}
        />
      )}

      <Canvas
        gridArea="canvas"
        alignSelf="start"
        p={0}
        m={0}
        canvasContainerRef={canvasContainerRef}
        canvasContainerWidth={state.canvasContainerWidth}
        canvasContainerHeight={state.canvasContainerHeight}
        canvasRef={canvasRef}
        canvasWidth={state.canvasWidth}
        canvasHeight={state.canvasHeight}
        canvasOverlayRef={canvasOverlayRef}
        isRunning={state.isRunning}
        // mousePositionRef={mousePositionRef}
      />
    </Grid>
  );
};
