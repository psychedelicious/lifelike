import React from 'react';
import { clamp } from 'lodash';

// Chakra UI
import { Box, Flex, useColorMode } from '@chakra-ui/core';

// Components
import { Canvas } from './canvas/Canvas';

import { Controls } from './menu/Controls';
import { Menu } from './menu/Menu';
import { Monitor } from './menu/Monitor';
import { Nav } from './menu/Nav';

// Functions
import { createCells } from './createCells';
import { drawCells } from './canvas/drawCells';
import { getNextCells } from './getNextCells';
import { Neighborhoods } from './neighborhoods';

// Hooks
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useGlobalKeyDown } from '../../hooks/useWindowEvent';

export const Lifelike = () => {
  const { colorMode } = useColorMode();

  const [cells, setCells] = React.useState([]);
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

  const [cellWidth, setCellWidth] = React.useState(0);
  const [cellHeight, setCellHeight] = React.useState(0);
  const [cellSize, setCellSize] = React.useState(5);

  const minMaxLimits = React.useRef({
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
    maxFps: {
      min: 1,
      max: 120,
    },
  });

  const [canvasWidth, setCanvasWidth] = React.useState(0);
  const [canvasHeight, setCanvasHeight] = React.useState(0);

  const [canvasContainerWidth, setCanvasContainerWidth] = React.useState(0);
  const [canvasContainerHeight, setCanvasContainerHeight] = React.useState(0);

  const [generations, setGenerations] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [maxFps, setMaxFps] = React.useState(60);
  const [fpsInterval, setFpsInterval] = React.useState(1000 / 60);
  const [currentFps, setCurrentFps] = React.useState(0);
  const [previousFrameTime, setPreviousFrameTime] = React.useState(0);
  const [lastFpsUpdate, setLastFpsUpdate] = React.useState(0);

  const fpsLogRef = React.useRef([]);
  const canvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);

  useGlobalKeyDown(
    React.useCallback(
      (e) => {
        switch (e.key) {
          case ' ':
            e.preventDefault();
            handleToggleIsRunning();
            break;
          case 'ArrowRight':
            !isRunning && tick();
            break;
          default:
            return;
        }
      },
      [isRunning, cells] // eslint-disable-line react-hooks/exhaustive-deps
    )
  );

  const handleToggleIsRunning = React.useCallback(() => {
    setIsRunning((isRunning) => !isRunning);
  }, []);

  const handleWrapChange = React.useCallback(
    (e) => {
      const newWrap = !wrap;
      setWrap(newWrap);
    },
    [wrap]
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

      // newCellSize = clamp(newCellSize, minMaxLimits.current.cellHeight.min, minMaxLimits.current.cellHeight.max,);
      // newCellWidth = clamp(newCellWidth, minMaxLimits.current.cellHeight.min, minMaxLimits.current.cellHeight.max,);
      // newCellHeight = clamp(newCellHeight, minMaxLimits.current.cellHeight.min, minMaxLimits.current.cellHeight.max,);

      const newCanvasHeight = newCellHeight * newCellSize;
      const newCanvasWidth = newCellWidth * newCellSize;

      setCellSize(newCellSize);
      setCellWidth(newCellWidth);
      setCellHeight(newCellHeight);
      setCanvasWidth(newCanvasWidth);
      setCanvasHeight(newCanvasHeight);

      canvasRef.current.width = newCanvasWidth;
      canvasRef.current.height = newCanvasHeight;

      setCanvasContainerWidth(newCanvasWidth + rem + 2);
      setCanvasContainerHeight(newCanvasHeight + rem + 2);
    },
    [cellHeight, cellWidth, cellSize]
  );

  const handleCellWidthChange = React.useCallback(
    (val) => {
      const newCellWidth = clamp(
        val,
        minMaxLimits.current.cellWidth.min,
        minMaxLimits.current.cellWidth.max
      );

      handleCanvasSizeChange({ newCellWidth });

      const newCells = createCells({
        cellHeight,
        cellWidth: newCellWidth,
        fill: cells,
      });

      setCells(newCells);

      window.requestAnimationFrame(() =>
        drawCells({
          colorMode,
          cellSize,
          cellHeight,
          canvas: canvasRef.current,
          cells: newCells,
          cellWidth: newCellWidth,
        })
      );
    },
    [isRunning, cellHeight, cellSize] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCellHeightChange = React.useCallback(
    (val) => {
      const newCellHeight = clamp(
        val,
        minMaxLimits.current.cellHeight.min,
        minMaxLimits.current.cellHeight.max
      );

      handleCanvasSizeChange({ newCellHeight });

      const newCells = createCells({
        cellWidth,
        cellHeight: newCellHeight,
        fill: cells,
      });

      setCells(newCells);

      window.requestAnimationFrame(() =>
        drawCells({
          colorMode,
          cellSize,
          cellWidth,
          canvas: canvasRef.current,
          cells: newCells,
          cellHeight: newCellHeight,
        })
      );
    },
    [isRunning, cellWidth, cellSize] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCellSizeChange = React.useCallback(
    (val) => {
      const newCellSize = clamp(
        val,
        minMaxLimits.current.cellSize.min,
        minMaxLimits.current.cellSize.max
      );

      handleCanvasSizeChange({ newCellSize });

      window.requestAnimationFrame(() =>
        drawCells({
          colorMode,
          cells,
          cellWidth,
          cellHeight,
          cellSize: newCellSize,
          canvas: canvasRef.current,
        })
      );
    },
    [isRunning, cellHeight, cellWidth] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleMaxFpsChange = React.useCallback((val) => {
    const newMaxFps = clamp(
      val,
      minMaxLimits.current.maxFps.min,
      minMaxLimits.current.maxFps.max
    );
    setMaxFps(newMaxFps);
    setFpsInterval(1000 / newMaxFps);
    fpsLogRef.current = [];
  }, []);

  const handleNeighborhoodChange = React.useCallback((e) => {
    const newNeighborhood = Neighborhoods[e.target.value];
    setNeighborhood(newNeighborhood);
  }, []);

  const handleRuleChange = React.useCallback(
    (ruleType, index) => {
      ruleType === 'born'
        ? setBorn(born.map((val, i) => (i === index ? !val : val)))
        : setSurvive(survive.map((val, i) => (i === index ? !val : val)));
    },
    [born, survive]
  );

  const handleClearCells = React.useCallback(() => {
    const newCells = createCells({ cellHeight, cellWidth, fill: 0 });

    setCells(newCells);
    setGenerations(0);
    setCurrentFps(0);
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        colorMode,
        cellSize,
        cellWidth,
        cellHeight,
        canvas: canvasRef.current,
        cells: newCells,
      })
    );
  }, [cellWidth, cellHeight, cellSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRandomizeCells = React.useCallback(() => {
    const newCells = createCells({ cellHeight, cellWidth });

    setCells(newCells);
    setGenerations(0);
    setCurrentFps(0);
    fpsLogRef.current = [];

    window.requestAnimationFrame(() =>
      drawCells({
        colorMode,
        cellSize,
        cellWidth,
        cellHeight,
        canvas: canvasRef.current,
        cells: newCells,
      })
    );
  }, [cellWidth, cellHeight, cellSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const fitCellsToCanvas = React.useCallback(
    (currentCells) => {
      // calculate 1 rem in px
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const canvasRect = canvasRef.current.getBoundingClientRect();

      // TODO: get this dynamically - currently hardcoded from padding and border widths *sigh*
      const widthOffset = rem * 2 + 2;
      const heightOffset = rem * 2 + 2;

      const newCellWidth = Math.trunc(
        (window.innerWidth - canvasRect.left - widthOffset) / cellSize
      );

      const newCellHeight = Math.trunc(
        (window.innerHeight - canvasRect.top - heightOffset) / cellSize
      );

      handleCanvasSizeChange({ newCellWidth, newCellHeight });

      const newCells = createCells({
        cellWidth: newCellWidth,
        cellHeight: newCellHeight,
        fill: currentCells ?? 'random',
      });

      setCells(newCells);

      drawCells({
        canvas: canvasRef.current,
        cells: newCells,
        cellSize: cellSize,
        cellWidth: newCellWidth,
        cellHeight: newCellHeight,
      });
    },
    [cellSize, handleCanvasSizeChange]
  );

  React.useLayoutEffect(fitCellsToCanvas, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            fpsLogRef.current.reduce((acc, val) => acc + val) /
              fpsLogRef.current.length
          )
        );
        setLastFpsUpdate(window.performance.now());
      }

      if (fpsLogRef.current.length > maxFps) fpsLogRef.current.shift();

      setPreviousFrameTime(window.performance.now());
      tick();
    }
  });

  const tick = () => {
    const newCells = getNextCells({
      cells,
      cellWidth,
      cellHeight,
      born,
      survive,
      wrap,
      neighborhood,
    });
    setCells(newCells);
    setGenerations((generations) => generations + 1);
    drawCells({
      colorMode,
      cellSize,
      cellWidth,
      cellHeight,
      canvas: canvasRef.current,
      cells: newCells,
    });
  };

  return (
    <Box w="100%" h="100%">
      <Nav />
      <Flex w="100%" h="calc(100vh - 6rem)">
        <Box mr="0.5rem" mt="1rem">
          <Controls
            isRunning={isRunning}
            onClickStartStop={handleToggleIsRunning}
            onClickTick={tick}
            onClickRandomizeCells={handleRandomizeCells}
            onClickClearCells={handleClearCells}
            onClickFitCellsToCanvas={() => fitCellsToCanvas(cells)}
          />
          <Menu
            neighborhood={neighborhood}
            onNeighborhoodChange={handleNeighborhoodChange}
            born={born}
            onBornChange={handleRuleChange}
            survive={survive}
            onSurviveChange={handleRuleChange}
            wrap={wrap}
            onWrapChange={handleWrapChange}
            cellWidth={cellWidth}
            onCellWidthChange={handleCellWidthChange}
            cellHeight={cellHeight}
            onCellHeightChange={handleCellHeightChange}
            cellSize={cellSize}
            onCellSizeChange={handleCellSizeChange}
            minMaxLimits={minMaxLimits}
            maxFps={maxFps}
            onMaxFpsChange={handleMaxFpsChange}
            isRunning={isRunning}
          />
          <Monitor generations={generations} currentFps={currentFps} />
        </Box>
        <Canvas
          canvasContainerRef={canvasContainerRef}
          canvasContainerWidth={canvasContainerWidth}
          canvasContainerHeight={canvasContainerHeight}
          canvasRef={canvasRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      </Flex>
    </Box>
  );
};
