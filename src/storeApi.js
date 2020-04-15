// storeApi.js
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
    population: state.population,
    generations: state.generations,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    canvasContainerWidth: state.canvasContainerWidth,
    canvasContainerHeight: state.canvasContainerHeight,
    fps: state.fps,
    previousFrameTime: state.previousFrameTime,
    lastFpsUpdate: state.lastFpsUpdate,
    interval: state.interval,
    fpsInterval: state.fpsInterval,
    deadCellColor: state.deadCellColor,
    aliveCellColor: state.aliveCellColor,
    gridlineColor: state.gridlineColor,
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
    setInterval: ({ interval }) => dispatch({ type: SET_INTERVAL, interval }),
    setNeighborhood: ({ neighborhood }) =>
      dispatch({
        type: SET_NEIGHBORHOOD,
        neighborhood,
      }),
    setBorn: ({ index }) => dispatch({ type: SET_BORN, index }),
    setSurvive: ({ index }) => dispatch({ type: SET_SURVIVE, index }),
    clearCells: () => dispatch({ type: CLEAR_CELLS }),
    randomizeCells: () => dispatch({ type: RANDOMIZE_CELLS }),
    setFps: ({ fps }) =>
      dispatch({
        type: SET_FPS,
        fps,
      }),
    setPreviousFrameTime: () =>
      dispatch({
        type: SET_PREVIOUSFRAMETIME,
        previousFrameTime: window.performance.now(),
      }),
    getNextCells: () => dispatch({ type: GET_NEXT_CELLS }),
  };
};
