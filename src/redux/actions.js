import {
  CLEAR_CELLS,
  GET_NEXT_CELLS,
  RANDOMIZE_CELLS,
  SET_BORN,
  SET_GRID,
  SET_SPEED,
  SET_CELL,
  SET_ARRAYOFCELLS,
  SET_NEIGHBORHOOD,
  SET_PREVIOUSFRAMETIME,
  SET_SURVIVE,
  TOGGLE_ISRUNNING,
  TOGGLE_SHOWGRIDLINES,
  TOGGLE_SHOWSTATS,
  TOGGLE_WRAP,
  SET_COLORS,
  SET_CANVASOVERLAYTEXT,
  SET_ISALTHELDDOWN,
  SET_BRUSH,
  TOGGLE_INEDITMODE,
  TOGGLE_ISINVERTDRAW,
} from './actionTypes';

export const toggleIsRunning = () => ({ type: TOGGLE_ISRUNNING });

export const toggleWrap = () => ({ type: TOGGLE_WRAP });

export const toggleShowStats = () => ({ type: TOGGLE_SHOWSTATS });

export const toggleShowGridlines = () => ({ type: TOGGLE_SHOWGRIDLINES });

export const setGrid = ({
  width,
  height,
  px,
  canvasWidth,
  canvasHeight,
  canvasContainerWidth,
  canvasContainerHeight,
}) => ({
  type: SET_GRID,
  payload: {
    width,
    height,
    px,
    canvasWidth,
    canvasHeight,
    canvasContainerWidth,
    canvasContainerHeight,
  },
});

export const setSpeed = ({ speed }) => ({ type: SET_SPEED, speed });

export const setNeighborhood = ({ neighborhood }) => ({
  type: SET_NEIGHBORHOOD,
  neighborhood,
});

export const setBorn = ({ index }) => ({ type: SET_BORN, index });

export const setSurvive = ({ index }) => ({ type: SET_SURVIVE, index });

export const clearCells = () => ({ type: CLEAR_CELLS });

export const randomizeCells = () => ({ type: RANDOMIZE_CELLS });

export const setPreviousFrameTime = () => ({
  type: SET_PREVIOUSFRAMETIME,
  previousFrameTime: window.performance.now(),
});

export const getNextCells = () => ({ type: GET_NEXT_CELLS });

export const setColors = ({
  aliveCellColor,
  deadCellColor,
  gridlineColor,
}) => ({
  type: SET_COLORS,
  payload: { aliveCellColor, deadCellColor, gridlineColor },
});

export const setCell = ({ x, y, state }) => ({
  type: SET_CELL,
  payload: { x, y, state },
});

export const setArrayOfCells = ({ arrayOfCells, invertState }) => ({
  type: SET_ARRAYOFCELLS,
  payload: { arrayOfCells, invertState },
});

export const setCanvasOverlayText = ({ text }) => ({
  type: SET_CANVASOVERLAYTEXT,
  payload: { text },
});

export const setIsAltHeldDown = ({ isAltHeldDown }) => ({
  type: SET_ISALTHELDDOWN,
  payload: { isAltHeldDown },
});

export const setBrush = ({ brushShape, brushRadius, brushFill }) => ({
  type: SET_BRUSH,
  payload: { brushShape, brushRadius, brushFill },
});

export const toggleInEditMode = () => ({ type: TOGGLE_INEDITMODE });

export const toggleIsInvertDraw = () => ({ type: TOGGLE_ISINVERTDRAW });
