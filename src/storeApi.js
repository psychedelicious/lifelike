// storeApi.js
import {
  useStore,
  CLEAR_CELLS,
  GET_NEXT_CELLS,
  RANDOMIZE_CELLS,
  SET_BORN,
  SET_GRID,
  SET_SPEED,
  SET_CELL,
  SET_NEIGHBORHOOD,
  SET_PREVIOUSFRAMETIME,
  SET_SURVIVE,
  TOGGLE_ISRUNNING,
  TOGGLE_SHOWGRIDLINES,
  TOGGLE_SHOWSTATS,
  TOGGLE_WRAP,
  SET_COLORS,
  TOGGLE_LAYOUT,
  SET_ARRAYOFCELLS,
  SET_CANVASOVERLAYTEXT,
  SET_CANVASMOUSEPOS,
  SET_CELLMOUSEPOS,
  SET_ISALTHELDDOWN,
  SET_BRUSH,
  TOGGLE_INEDITMODE,
  TOGGLE_ISINVERTDRAW,
} from './store';

export const useLife = () => {
  const { state, dispatch } = useStore();
  return {
    cells: state.cells,
    width: state.width,
    height: state.height,
    px: state.px,
    neighborhood: state.neighborhood,
    born: state.born,
    survive: state.survive,
    wrap: state.wrap,
    showGridlines: state.showGridlines,
    isRunning: state.isRunning,
    showStats: state.showStats,
    generation: state.generation,
    population: state.population,
    density: state.density,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    canvasContainerWidth: state.canvasContainerWidth,
    canvasContainerHeight: state.canvasContainerHeight,
    canvasOverlayText: state.canvasOverlayText,
    cellMousePos: state.cellMousePos,
    canvasMousePos: state.canvasMousePos,
    isAltHeldDown: state.isAltHeldDown,
    brushShape: state.brushShape,
    brushRadius: state.brushRadius,
    brushPoints: state.brushPoints,
    brushFill: state.brushFill,
    previousFrameTime: state.previousFrameTime,
    speed: state.speed,
    msDelay: state.msDelay,
    lightModeColors: state.lightModeColors,
    darkModeColors: state.darkModeColors,
    deadCellColor: state.deadCellColor,
    aliveCellColor: state.aliveCellColor,
    gridlineColor: state.gridlineColor,
    layout: state.layout,
    inEditMode: state.inEditMode,
    isInvertDraw: state.isInvertDraw,
    toggleIsRunning: () => dispatch({ type: TOGGLE_ISRUNNING }),
    toggleWrap: () => dispatch({ type: TOGGLE_WRAP }),
    toggleShowStats: () => dispatch({ type: TOGGLE_SHOWSTATS }),
    setGrid: ({
      width,
      height,
      px,
      canvasWidth,
      canvasHeight,
      canvasContainerWidth,
      canvasContainerHeight,
    }) =>
      dispatch({
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
      }),
    toggleShowGridlines: () => dispatch({ type: TOGGLE_SHOWGRIDLINES }),
    setSpeed: ({ speed }) => dispatch({ type: SET_SPEED, speed }),
    setNeighborhood: ({ neighborhood }) =>
      dispatch({
        type: SET_NEIGHBORHOOD,
        neighborhood,
      }),
    setBorn: ({ index }) => dispatch({ type: SET_BORN, index }),
    setSurvive: ({ index }) => dispatch({ type: SET_SURVIVE, index }),
    clearCells: () => dispatch({ type: CLEAR_CELLS }),
    randomizeCells: () => dispatch({ type: RANDOMIZE_CELLS }),
    setPreviousFrameTime: () =>
      dispatch({
        type: SET_PREVIOUSFRAMETIME,
        previousFrameTime: window.performance.now(),
      }),
    getNextCells: () => dispatch({ type: GET_NEXT_CELLS }),
    setColors: ({ aliveCellColor, deadCellColor, gridlineColor }) =>
      dispatch({
        type: SET_COLORS,
        payload: { aliveCellColor, deadCellColor, gridlineColor },
      }),
    toggleLayout: () => dispatch({ type: TOGGLE_LAYOUT }),
    setCell: ({ x, y, state }) =>
      dispatch({ type: SET_CELL, payload: { x, y, state } }),
    setArrayOfCells: ({ arrayOfCells, invertState }) =>
      dispatch({
        type: SET_ARRAYOFCELLS,
        payload: { arrayOfCells, invertState },
      }),
    setCanvasOverlayText: ({ text }) =>
      dispatch({ type: SET_CANVASOVERLAYTEXT, payload: { text } }),
    setCanvasMousePos: ({ x, y }) =>
      dispatch({ type: SET_CANVASMOUSEPOS, payload: { x, y } }),
    setCellMousePos: ({ x, y }) =>
      dispatch({ type: SET_CELLMOUSEPOS, payload: { x, y } }),
    setIsAltHeldDown: ({ isAltHeldDown }) =>
      dispatch({ type: SET_ISALTHELDDOWN, payload: { isAltHeldDown } }),
    setBrush: ({ brushShape, brushRadius, brushFill }) =>
      dispatch({
        type: SET_BRUSH,
        payload: { brushShape, brushRadius, brushFill },
      }),
    toggleInEditMode: () => dispatch({ type: TOGGLE_INEDITMODE }),
    toggleIsInvertDraw: () => dispatch({ type: TOGGLE_ISINVERTDRAW }),
  };
};
