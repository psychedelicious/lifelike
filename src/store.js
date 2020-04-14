import React, { createContext, useContext, useReducer } from 'react';

import { Neighborhoods } from './features/life/neighborhoods';
import { createCells } from './features/life/createCells';
import { getNextCells } from './features/life/getNextCells';

import { lifelikeTheme } from './theme';

export const SET_PX = 'SET_PX';
export const SET_HEIGHT = 'SET_HEIGHT';
export const SET_WIDTH = 'SET_WIDTH';
export const SET_CELLS = 'SET_CELLS';
export const SET_GRID = 'SET_GRID';
export const SET_BORN = 'SET_BORN';
export const SET_SURVIVE = 'SET_SURVIVE';
export const SET_NEIGHBORHOOD = 'SET_NEIGHBORHOOD';
export const GET_NEXT_CELLS = 'GET_NEXT_CELLS';
export const RANDOMIZE_CELLS = 'RANDOMIZE_CELLS';
export const CLEAR_CELLS = 'CLEAR_CELLS';
export const SET_POPULATION = 'SET_POPULATION';
export const INCREMENT_GENERATIONS = 'INCREMENT_GENERATIONS';
export const TOGGLE_ISRUNNING = 'TOGGLE_ISRUNNING';
export const TOGGLE_WRAP = 'TOGGLE_WRAP';
export const TOGGLE_SHOWGRIDLINES = 'TOGGLE_SHOWGRIDLINES';
export const TOGGLE_SHOWSTATS = 'TOGGLE_SHOWSTATS';
export const SET_CANVASWIDTH = 'SET_CANVASWIDTH';
export const SET_CANVASHEIGHT = 'SET_CANVASHEIGHT';
export const SET_CANVASCONTAINERWIDTH = 'SET_CANVASCONTAINERWIDTH';
export const SET_CANVASCONTAINERHEIGHT = 'SET_CANVASCONTAINERHEIGHT';
export const SET_FPS = 'SET_FPS';
export const SET_PREVIOUSFRAMETIME = 'SET_PREVIOUSFRAMETIME';
export const SET_LASTFPSUPDATE = 'SET_LASTFPSUPDATE';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SET_LASTCONFIGCHANGE = 'SET_LASTCONFIGCHANGE';

const StoreContext = createContext();

export const initialState = {
  cells: [],
  width: 0,
  height: 0,
  px: 5,
  neighborhood: Neighborhoods.MOORE,
  born: [false, false, false, true, false, false, false, false, false],
  survive: [false, false, true, true, false, false, false, false, false],
  wrap: true,
  showGridlines: false,
  isRunning: false,
  showStats: true,
  population: 0,
  generations: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  canvasContainerWidth: 0,
  canvasContainerHeight: 0,
  fps: 0,
  previousFrameTime: 0,
  lastFpsUpdate: 0,
  interval: 70,
  fpsInterval: Math.pow(100 - 70, 3) / 1000,
  deadCellColor: lifelikeTheme.colors.gray['100'],
  aliveCellColor: lifelikeTheme.colors.gray['700'],
  gridlineColor: lifelikeTheme.colors.gray['300'],
  lastConfigChange: window.performance.now(),
};

const reducer = (state, action) => {
  // console.log(`dispatching action type ${action.type}`);
  // console.log(state);
  switch (action.type) {
    case SET_PX:
      return {
        ...state,
        px: action.px,
        lastConfigChange: window.performance.now()
      };
    case SET_HEIGHT:
      return {
        ...state,
        height: action.height,
        lastConfigChange: window.performance.now()
      };
    case SET_WIDTH:
      return {
        ...state,
        width: action.width,
        lastConfigChange: window.performance.now()
      };
    case SET_CELLS:
      return {
        ...state,
        cells: action.cells,
        lastConfigChange: window.performance.now()
      };
    case SET_BORN:
      return {
        ...state,
        born: state.born.map((val, i) => (i === action.index ? !val : val)),
        lastConfigChange: window.performance.now()
      };
    case SET_SURVIVE:
      return {
        ...state,
        survive: state.survive.map((val, i) =>
          i === action.index ? !val : val
        ),
        lastConfigChange: window.performance.now()
      };
    case RANDOMIZE_CELLS:
      return {
        ...state,
        population: 0,
        generation: 0,
        cells: createCells({ width: state.width, height: state.height }),
        lastConfigChange: window.performance.now()
      };
    case CLEAR_CELLS:
      return {
        ...state,
        population: 0,
        generation: 0,
        cells: createCells({
          width: state.width,
          height: state.height,
          fill: 0,
        }),
        lastConfigChange: window.performance.now()
      };
    case SET_POPULATION:
      return {
        ...state,
        population: action.population,
        
      };
    case INCREMENT_GENERATIONS:
      return {
        ...state,
        generations: state.generations + 1,
      };
    case TOGGLE_ISRUNNING:
      return {
        ...state,
        isRunning: !state.isRunning,
        lastConfigChange: window.performance.now()
      };
    case TOGGLE_WRAP:
      return {
        ...state,
        wrap: !state.wrap,
        lastConfigChange: window.performance.now()
      };
    case TOGGLE_SHOWGRIDLINES:
      return {
        ...state,
        showGridlines: !state.showGridlines,
        lastConfigChange: window.performance.now()
      };
    case TOGGLE_SHOWSTATS:
      return {
        ...state,
        showStats: !state.showStats,
      };
    case SET_NEIGHBORHOOD:
      return {
        ...state,
        neighborhood: Neighborhoods[action.neighborhood],
        lastConfigChange: window.performance.now()
      };
    case SET_CANVASWIDTH: {
      return {
        ...state,
        canvasWidth: action.canvasWidth,
        lastConfigChange: window.performance.now()
      };
    }
    case SET_CANVASHEIGHT: {
      return {
        ...state,
        canvasHeight: action.canvasHeight,
        lastConfigChange: window.performance.now()
      };
    }
    case SET_CANVASCONTAINERWIDTH: {
      return {
        ...state,
        canvasContainerWidth: action.canvasContainerWidth,
        lastConfigChange: window.performance.now()
      };
    }
    case SET_CANVASCONTAINERHEIGHT: {
      return {
        ...state,
        canvasContainerHeight: action.canvasContainerHeight,
        lastConfigChange: window.performance.now()
      };
    }
    case SET_FPS: {
      return {
        ...state,
        lastFpsUpdate: window.performance.now(),
        fps: action.fps,
      };
    }
    case SET_PREVIOUSFRAMETIME: {
      return {
        ...state,
        previousFrameTime: action.previousFrameTime,
      };
    }
    case SET_LASTFPSUPDATE: {
      return {
        ...state,
        lastFpsUpdate: action.lastFpsUpdate,
      };
    }
    case SET_INTERVAL: {
      return {
        ...state,
        interval: action.interval,
        fpsInterval: Math.pow(100 - action.interval, 3) / 1000,
      };
    }
    case GET_NEXT_CELLS: {
      return {
        ...state,
        generations: state.generations + 1,
        cells: getNextCells({
          cells: state.cells,
          width: state.width,
          height: state.height,
          born: state.born,
          survive: state.survive,
          wrap: state.wrap,
          neighborhood: state.neighborhood,
        }),
      };
    }
    case SET_GRID: {
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
        px: action.payload.px,
        canvasWidth: action.payload.canvasWidth,
        canvasHeight: action.payload.canvasHeight,
        canvasContainerWidth: action.payload.canvasContainerWidth,
        canvasContainerHeight: action.payload.canvasContainerHeight,
        cells: createCells({
          width: action.payload.width,
          height: action.payload.height,
          fill: state.cells,
        }),
        lastConfigChange: window.performance.now()
      };
    }
    case SET_LASTCONFIGCHANGE: {
      return {
        ...state,
        lastConfigChange: window.performance.now(),
      };
    }
    default:
      throw new Error(`Action type ${action.type} unrecognized`);
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
