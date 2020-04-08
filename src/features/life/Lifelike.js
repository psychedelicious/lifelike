import React from 'react';
import { clamp } from 'lodash';

// Chakra UI
import { Box, Flex, useColorMode } from '@chakra-ui/core';

// Components
import { Canvas } from './Canvas';
import { Controls } from '../menu/Controls';
import { Menu } from '../menu/Menu';
import { Monitor } from '../menu/Monitor';
import { Nav } from '../menu/Nav';

// Functions
import { createCells } from './createCells';
import { drawCells } from './drawCells';
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
  const [canvasWidth, setCanvasWidth] = React.useState(0);
  const [canvasHeight, setCanvasHeight] = React.useState(0);
  const [generations, setGenerations] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  const [maxFps, setMaxFps] = React.useState(60);
  const [fpsInterval, setFpsInterval] = React.useState(1000 / 60);
  const [currentFps, setCurrentFps] = React.useState(0);
  const [previousFrameTime, setPreviousFrameTime] = React.useState(0);

  const [lastFpsUpdate, setLastFpsUpdate] = React.useState(0);

  const fpsLog = React.useRef([]);
  const canvasRef = React.useRef(null);

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

  const handleCellWidthChange = React.useCallback(
    (val) => {
      const newCellWidth = clamp(val, 5, 500);

      setCellWidth(newCellWidth);
      setCanvasWidth(newCellWidth * cellSize);

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
    [isRunning] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCellHeightChange = React.useCallback(
    (newCellHeight) => {
      setCellHeight(newCellHeight);
      setCanvasHeight(newCellHeight * cellSize);

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
    [isRunning] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCellSizeChange = React.useCallback(
    (newCellSize) => {
      setCellSize(newCellSize);
      setCanvasWidth(cellWidth * newCellSize);
      setCanvasHeight(cellHeight * newCellSize);

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
    [isRunning] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleMaxFpsChange = React.useCallback((val) => {
    const newMaxFps = clamp(val, 1, 120);
    setMaxFps(newMaxFps);
    setFpsInterval(1000 / newMaxFps);
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

  React.useLayoutEffect(() => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newCellHeight = Math.trunc(canvasRect.height / cellSize);
    const newCellWidth = Math.trunc(canvasRect.width / cellSize);
    const newCanvasHeight = newCellHeight * cellSize;
    const newCanvasWidth = newCellWidth * cellSize;

    setCellWidth(newCellWidth);
    setCellHeight(newCellHeight);
    setCanvasWidth(newCanvasWidth);
    canvasRef.current.width = newCanvasWidth;
    setCanvasHeight(newCanvasHeight);
    canvasRef.current.height = newCanvasHeight;

    const newCells = createCells({
      cellWidth: newCellWidth,
      cellHeight: newCellHeight,
    });

    setCells(newCells);

    drawCells({
      canvas: canvasRef.current,
      cells: newCells,
      cellSize: cellSize,
      cellWidth: newCellWidth,
      cellHeight: newCellHeight,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useAnimationFrame(() => {
    if (
      isRunning &&
      window.performance.now() - previousFrameTime > fpsInterval
    ) {
      fpsLog.current.push(
        1000 / (window.performance.now() - previousFrameTime)
      );

      if (window.performance.now() - lastFpsUpdate > 100) {
        setCurrentFps(
          Math.trunc(
            (fpsLog.current.reduce((acc, val) => acc + val) * 10) /
              fpsLog.current.length
          ) / 10
        );
        setLastFpsUpdate(window.performance.now());
      }

      if (fpsLog.current.length > maxFps) fpsLog.current.shift();

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
        <Box mr="2" mt="4">
          <Controls
            isRunning={isRunning}
            onClickStartStop={handleToggleIsRunning}
            onClickTick={tick}
            onRandomizeCells={handleRandomizeCells}
            onClearCells={handleClearCells}
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
            maxFps={maxFps}
            onMaxFpsChange={handleMaxFpsChange}
            isRunning={isRunning}
          />
          <Monitor generations={generations} currentFps={currentFps} />
        </Box>
        <Box ml="2" mt="4" h="100%" w="100%">
          <Canvas
            canvasRef={canvasRef}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
        </Box>
      </Flex>
    </Box>
  );
};
