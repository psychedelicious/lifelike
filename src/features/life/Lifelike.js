import React from 'react';
import { clamp } from 'lodash';
// import useMousePosition from '@react-hook/mouse-position';

// Chakra UI
import { Grid, useColorMode } from '@chakra-ui/core';

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

const gridTemplateColumnsBase = 'auto';

const gridTemplateColumnsLeft = {
  base: gridTemplateColumnsBase,
  md: '18.5rem auto',
};
const gridTemplateColumnsRight = {
  base: gridTemplateColumnsBase,
  md: 'auto 18.5rem',
};

const gridTemplateAreasBase = `"header"
  "canvas"
  "maincontrols"
  "slidercontrols"
  "speedslider"
  "bornrule"
  "surviverule"
  "neighborhoodradio"
  "gridlineswrap"
  "monitor"`;

const gridTemplateAreasLeft = {
  base: gridTemplateAreasBase,
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

const gridTemplateAreasRight = {
  base: gridTemplateAreasBase,
  md: `"canvas header"
    "canvas maincontrols"
    "canvas slidercontrols"
    "canvas speedslider"
    "canvas bornrule"
    "canvas surviverule"
    "canvas neighborhoodradio"
    "canvas gridlineswrap"
    "canvas monitor"
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

export const Lifelike = ({ isMobile }) => {
  const { drawCells, drawGridlines, clearCanvas } = useCanvas();
  const { colorMode, toggleColorMode } = useColorMode();

  const {
    // state values
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
    generations,
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
  } = useLife();

  useGlobalKeyDown((e) => {
    switch (e.key) {
      case ' ':
        if (!withModifiers(e)) {
          e.preventDefault();
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

  // const [mousePosition, mousePositionRef] = useMousePosition(
  //   0, // enterDelay
  //   0, // leaveDelay
  //   10 // fps
  // );

  const canvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
  const canvasOverlayRef = React.useRef(null);

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

      setLastConfigChange(window.performance.now());
    },
    [lastConfigChange] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleToggleGridlines = React.useCallback(() => {
    toggleShowGridlines();

    !showGridlines
      ? drawGridlines({ canvas: canvasOverlayRef.current })
      : clearCanvas({ canvas: canvasOverlayRef.current });

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
      const newPx = clamp(val, minMaxLimits.px.min, minMaxLimits.px.max);

      handleCanvasSizeChange({ newPx });
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
      minMaxLimits.width.min,
      minMaxLimits.width.max
    );

    const newHeight = clamp(
      Math.trunc(
        (window.innerHeight -
          canvasRect.top -
          heightOffset -
          mobileHeightOffset) /
          px
      ),
      minMaxLimits.height.min,
      minMaxLimits.height.max
    );

    handleCanvasSizeChange({ newWidth, newHeight });
  }, [lastConfigChange, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  useAnimationFrame(() => {
    if (isRunning && window.performance.now() - previousFrameTime > msDelay) {
      setPreviousFrameTime();
      getNextCells();
    }
  });

  React.useEffect(() => {
    colorMode === 'light'
      ? setColors(lightModeColors)
      : setColors(darkModeColors);
    setLastConfigChange(window.performance.now());
  }, [colorMode]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    drawCells({
      canvas: canvasRef.current,
    });
  }, [cells, lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    clearCanvas({ canvas: canvasOverlayRef.current });
    showGridlines && drawGridlines({ canvas: canvasOverlayRef.current });
  }, [lastConfigChange]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useLayoutEffect(fitCellsToCanvas, []);

  return (
    <Grid
      w="100%"
      h="100%"
      rowGap="0.5rem"
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
        isMobile={isMobile}
        colorMode={colorMode}
        handleToggleColorMode={handleToggleColorMode}
        handleToggleLayout={handleToggleLayout}
        gridArea="header"
        justify="space-between"
        alignItems="center"
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
      />

      <SliderControls
        gridArea="slidercontrols"
        isMobile={isMobile}
        isOpen={isOptionsOpen}
        width={width}
        onWidthChange={handleWidthChange}
        height={height}
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
        speed={speed}
        msDelay={msDelay}
        min={minMaxLimits.speed.min}
        max={minMaxLimits.speed.max}
        onChange={handleSpeedChange}
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
          population={population}
          density={density}
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
