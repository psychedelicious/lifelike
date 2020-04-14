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
import { useCanvas } from './canvas/useCanvas';

import { useLife } from '../../storeApi';

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
  px: {
    min: 1,
    max: 25,
  },
  interval: {
    min: 0,
    max: 100,
  },
};

export const Lifelike = ({ isMobile }) => {
  const { drawCells, drawGridlines } = useCanvas();

  const {
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
    generations,
    canvasWidth,
    canvasHeight,
    canvasContainerWidth,
    canvasContainerHeight,
    fps,
    previousFrameTime,
    lastFpsUpdate,
    interval,
    fpsInterval,
    toggleIsRunning,
    toggleWrap,
    toggleShowStats,
    setGrid,
    toggleShowGridlines,
    setInterval,
    setNeighborhood,
    setBorn,
    setSurvive,
    clearCells,
    randomizeCells,
    setFps,
    setPreviousFrameTime,
    getNextCells,
  } = useLife();

  const [lastConfigChange, setLastConfigChange] = React.useState(0);

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
    // dispatch({ type: TOGGLE_ISRUNNING });
    toggleIsRunning();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleToggleWrap = React.useCallback(() => {
    // dispatch({ type: TOGGLE_WRAP });
    toggleWrap();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleToggleShowStats = React.useCallback(() => {
    // dispatch({ type: TOGGLE_SHOWSTATS });
    toggleShowStats();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleCanvasSizeChange = React.useCallback(
    ({ newWidth = width, newHeight = height, newPx = px }) => {
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const newCanvasHeight = newHeight * newPx;
      const newCanvasWidth = newWidth * newPx;

      canvasRef.current.width = newCanvasWidth;
      canvasRef.current.height = newCanvasHeight;

      canvasOverlayRef.current.width = newCanvasWidth;
      canvasOverlayRef.current.height = newCanvasHeight;

      setGrid({
        width: newWidth,
        height: newHeight,
        px: newPx,
        canvasWidth: newCanvasWidth,
        canvasHeight: newCanvasHeight,
        canvasContainerWidth: newCanvasWidth + rem + 2,
        canvasContainerHeight: newCanvasHeight + rem + 2,
      });
      // dispatch({
      //   type: SET_GRID,
      //   payload: {
      //     width: newWidth,
      //     height: newHeight,
      //     px: newPx,
      //     canvasWidth: newCanvasWidth,
      //     canvasHeight: newCanvasHeight,
      //     canvasContainerWidth: newCanvasWidth + rem + 2,
      //     canvasContainerHeight: newCanvasHeight + rem + 2,
      //   },
      // });

      drawGridlines({ canvas: canvasOverlayRef.current });

      window.requestAnimationFrame(() =>
        drawCells({ canvas: canvasRef.current })
      );
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleToggleGridlines = React.useCallback(() => {
    // dispatch({ type: TOGGLE_SHOWGRIDLINES });
    toggleShowGridlines();
    drawGridlines({ canvas: canvasOverlayRef.current });
  }, []);

  const handleWidthChange = React.useCallback(
    (val) => {
      const newWidth = clamp(
        val,
        minMaxLimits.cellWidth.min,
        minMaxLimits.cellWidth.max
      );

      handleCanvasSizeChange({ newWidth });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleHeightChange = React.useCallback(
    (val) => {
      const newHeight = clamp(
        val,
        minMaxLimits.cellHeight.min,
        minMaxLimits.cellHeight.max
      );

      handleCanvasSizeChange({ newHeight });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handlePxChange = React.useCallback(
    (val) => {
      const newPx = clamp(val, minMaxLimits.px.min, minMaxLimits.px.max);

      handleCanvasSizeChange({ newPx });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleIntervalChange = React.useCallback(
    (val) => {
      const interval = clamp(
        val,
        minMaxLimits.interval.min,
        minMaxLimits.interval.max
      );

      // dispatch({ type: SET_INTERVAL, interval: newInterval });
      setInterval({ interval });
      fpsLogRef.current = [];
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleNeighborhoodChange = React.useCallback(
    (neighborhood) => {
      // dispatch({ type: SET_NEIGHBORHOOD, neighborhood: val });
      setNeighborhood(neighborhood);
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleRuleChange = React.useCallback(
    (ruleType, index) => {
      ruleType === 'born' ? setBorn({ index }) : setSurvive({ index });
      // ? dispatch({ type: SET_BORN, index })
      // : dispatch({ type: SET_SURVIVE, index });
      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange]
  );

  const handleClearCells = React.useCallback(() => {
    clearCells();
    // dispatch({ type: CLEAR_CELLS });
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        canvas: canvasRef.current,
      })
    );
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

  const handleRandomizeCells = React.useCallback(() => {
    randomizeCells();
    // dispatch({ type: RANDOMIZE_CELLS });
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        canvas: canvasRef.current,
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

    const newWidth = clamp(
      Math.trunc((window.innerWidth - canvasRect.left - widthOffset) / px),
      minMaxLimits.cellWidth.min,
      minMaxLimits.cellWidth.max
    );

    const newHeight = clamp(
      Math.trunc(
        (window.innerHeight -
          canvasRect.top -
          heightOffset -
          mobileHeightOffset) /
          px
      ),
      minMaxLimits.cellHeight.min,
      minMaxLimits.cellHeight.max
    );

    handleCanvasSizeChange({ newWidth, newHeight });
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange, isMobile]);

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
        setFps({
          fps:
            Math.round(
              (fpsLogRef.current.reduce((acc, val) => acc + val) /
                fpsLogRef.current.length) *
                10
            ) / 10,
        });
        // dispatch({
        //   type: SET_FPS,
        //   fps:
        //     Math.round(
        //       (fpsLogRef.current.reduce((acc, val) => acc + val) /
        //         fpsLogRef.current.length) *
        //         10
        //     ) / 10,
        // });
      }

      if (fpsLogRef.current.length > fps) fpsLogRef.current.shift();

      setPreviousFrameTime();
      // dispatch({
      //   type: SET_PREVIOUSFRAMETIME,
      //   previousFrameTime: window.performance.now(),
      // });

      tick();
    }
  });

  const tick = () => {
    getNextCells();
    // dispatch({ type: GET_NEXT_CELLS });
    window.requestAnimationFrame(() =>
      drawCells({
        canvas: canvasRef.current,
      })
    );
  };

  const handleClickTick = React.useCallback(() => {
    tick();
    setLastConfigChange(window.performance.now());
  }, [lastConfigChange]);

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
        cellWidth={width}
        onWidthChange={handleWidthChange}
        cellHeight={height}
        onHeightChange={handleHeightChange}
        px={px}
        onPxChange={handlePxChange}
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

      {showStats && (
        <Monitor
          gridArea="monitor"
          generations={generations}
          fps={fps}
          // population={population}
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
