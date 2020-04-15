// storeApi.js
import {
  useStore,
  CLEAR_CELLS,
  GET_NEXT_CELLS,
  RANDOMIZE_CELLS,
  SET_BORN,
  SET_GRID,
  SET_SPEED,
  SET_NEIGHBORHOOD,
  SET_PREVIOUSFRAMETIME,
  SET_SURVIVE,
  TOGGLE_ISRUNNING,
  TOGGLE_SHOWGRIDLINES,
  TOGGLE_SHOWSTATS,
  TOGGLE_WRAP,
  SET_COLORS,
  TOGGLE_LAYOUT,
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
    generations: state.generations,
    population: state.population,
    density: state.density,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    canvasContainerWidth: state.canvasContainerWidth,
    canvasContainerHeight: state.canvasContainerHeight,
    previousFrameTime: state.previousFrameTime,
    speed: state.speed,
    msDelay: state.msDelay,
    lightModeColors: state.lightModeColors,
    darkModeColors: state.darkModeColors,
    deadCellColor: state.deadCellColor,
    aliveCellColor: state.aliveCellColor,
    gridlinesColor: state.gridlinesColor,
    layout: state.layout,
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
    setColors: ({ aliveCellColor, deadCellColor, gridlinesColor }) =>
      dispatch({
        type: SET_COLORS,
        payload: { aliveCellColor, deadCellColor, gridlinesColor },
      }),
    toggleLayout: () => dispatch({ type: TOGGLE_LAYOUT }),
  };
};
