import { lifelikeTheme } from 'theme';

import { Neighborhoods } from 'features/life/neighborhoods';

import { createCells } from 'store/reducers/life/createCells';
import { getNextCells as stepCells } from 'store/reducers/life/getNextCells';
import { getDensity } from 'store/reducers/performance/utilities';

const CLEAR_CELLS = 'CLEAR_CELLS';
const GET_NEXT_CELLS = 'GET_NEXT_CELLS';
const RANDOMIZE_CELLS = 'RANDOMIZE_CELLS';
const SET_ARRAY_OF_CELLS = 'SET_ARRAY_OF_CELLS';
const TRANSLATE_CELLS = 'TRANSLATE_CELLS';
const SET_BORN = 'SET_BORN';
const SET_GRID = 'SET_GRID';
const SET_NEIGHBORHOOD = 'SET_NEIGHBORHOOD';
const SET_SURVIVE = 'SET_SURVIVE';
const TOGGLE_IS_RUNNING = 'TOGGLE_IS_RUNNING';
const TOGGLE_SHOULD_SHOW_GRIDLINES = 'TOGGLE_SHOULD_SHOW_GRIDLINES';
const TOGGLE_SHOULD_SHOW_HUD = 'TOGGLE_SHOULD_SHOW_HUD';
const TOGGLE_SHOULD_PAUSE_ON_STABLE_STATE =
  'TOGGLE_SHOULD_PAUSE_ON_STABLE_STATE';
const TOGGLE_SHOULD_WRAP = 'TOGGLE_SHOULD_WRAP';

const initialState = {
  cells: [],
  width: 0,
  height: 0,
  px: window.matchMedia(`(max-width: ${lifelikeTheme.breakpoints.md})`).matches
    ? 3
    : 5,
  neighborhood: Neighborhoods.MOORE,
  born: [false, false, false, true, false, false, false, false, false],
  survive: [false, false, true, true, false, false, false, false, false],
  shouldWrap: true,
  shouldShowGridlines: false,
  isRunning: false,
  shouldPauseOnStableState: false,
  shouldShowHUD: false,
  generation: 0,
  population: 0,
  density: 0,
  cellsChanged: true,
  canvasWidth: 0,
  canvasHeight: 0,
  canvasContainerWidth: 0,
  canvasContainerHeight: 0,
  minWidth: 1,
  maxWidth: 2000,
  minHeight: 1,
  maxHeight: 2000,
  minPx: 1,
  maxPx: 25,
};

export default function life(state = initialState, action) {
  switch (action.type) {
    case SET_BORN:
      return {
        ...state,
        born: state.born.map((val, i) => (i === action.index ? !val : val)),
      };
    case SET_SURVIVE:
      return {
        ...state,
        survive: state.survive.map((val, i) =>
          i === action.index ? !val : val
        ),
      };
    case RANDOMIZE_CELLS:
      const [randomizedCells, randomizedCellsPopulation] = createCells({
        width: state.width,
        height: state.height,
        fill: 'random',
      });
      return {
        ...state,
        generation: 0,
        cells: randomizedCells,
        cellsChanged: true,
        population: randomizedCellsPopulation,
        density: getDensity(
          randomizedCellsPopulation,
          state.width,
          state.height
        ),
      };
    case CLEAR_CELLS:
      const [clearedCells, clearedCellsPopulation] = createCells({
        width: state.width,
        height: state.height,
        fill: 0,
      });
      return {
        ...state,
        generation: 0,
        cells: clearedCells,
        population: clearedCellsPopulation,
        cellsChanged: true,
        density: getDensity(clearedCellsPopulation, state.width, state.height),
      };
    case TOGGLE_IS_RUNNING:
      return {
        ...state,
        isRunning: !state.isRunning,
      };
    case TOGGLE_SHOULD_WRAP:
      return {
        ...state,
        shouldWrap: !state.shouldWrap,
      };
    case TOGGLE_SHOULD_SHOW_GRIDLINES:
      return {
        ...state,
        shouldShowGridlines: !state.shouldShowGridlines,
      };
    case TOGGLE_SHOULD_SHOW_HUD:
      return {
        ...state,
        shouldShowHUD: !state.shouldShowHUD,
      };
    case TOGGLE_SHOULD_PAUSE_ON_STABLE_STATE:
      return {
        ...state,
        shouldPauseOnStableState: !state.shouldPauseOnStableState,
      };
    case SET_NEIGHBORHOOD:
      return {
        ...state,
        neighborhood: Neighborhoods[action.neighborhood],
      };
    case GET_NEXT_CELLS: {
      const [nextCells, nextPopulation, cellsChanged] = stepCells(
        state.cells,
        state.width,
        state.height,
        state.born,
        state.survive,
        state.shouldWrap,
        state.neighborhood
      );
      return {
        ...state,
        generation: state.generation + 1,
        cells: nextCells,
        population: nextPopulation,
        cellsChanged: cellsChanged,
        density: getDensity(nextPopulation, state.width, state.height),
      };
    }
    case SET_GRID: {
      const [setGridCells, setGridPopulation] = createCells({
        width: action.payload.width,
        height: action.payload.height,
        fill: state.cells.length ? state.cells : 'random',
      });
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
        px: action.payload.px,
        canvasWidth: action.payload.canvasWidth,
        canvasHeight: action.payload.canvasHeight,
        canvasContainerWidth: action.payload.canvasContainerWidth,
        canvasContainerHeight: action.payload.canvasContainerHeight,
        cells: setGridCells,
        cellsChanged: true,
        population: setGridPopulation,
        density: getDensity(
          setGridPopulation,
          action.payload.width,
          action.payload.height
        ),
      };
    }
    case SET_ARRAY_OF_CELLS: {
      let newArrayOfCells = [...state.cells];

      action.arrayOfCells.forEach(({ x, y }) => {
        if (state.shouldWrap) {
          if (x < 0) {
            x = state.width + x;
          } else if (x >= state.width) {
            x = x - state.width;
          }

          if (y < 0) {
            y = state.height + y;
          } else if (y >= state.height) {
            y = y - state.height;
          }

          newArrayOfCells[x][y] = action.invertState ? 0 : 1;
        } else {
          if (x >= 0 && x < state.width && y >= 0 && y < state.height) {
            newArrayOfCells[x][y] = action.invertState ? 0 : 1;
          }
        }
      });

      let newPopulation = newArrayOfCells
        .flat()
        .reduce((sum, val) => sum + val, 0);

      return {
        ...state,
        cells: newArrayOfCells,
        population: newPopulation,
        cellsChanged: true,
        density: getDensity(newPopulation, state.width, state.height),
      };
    }
    case TRANSLATE_CELLS: {
      const { width, height } = state;
      const { deltaX, deltaY } = action;

      let translatedCells = Array.from(Array(width), () => new Array(height));

      if (state.shouldWrap) {
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            let _x = x + deltaX;
            let _y = y + deltaY;

            if (x + deltaX < 0) {
              _x = state.width + x + deltaX;
            } else if (x + deltaX >= state.width) {
              _x = x + deltaX - state.width;
            }

            if (y + deltaY < 0) {
              _y = state.height + y + deltaY;
            } else if (y + deltaY >= state.height) {
              _y = y + deltaY - state.height;
            }

            translatedCells[_x][_y] = state.cells[x][y];
          }
        }
      } else {
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            let _x = x - deltaX;
            let _y = y - deltaY;

            translatedCells[x][y] =
              _x >= 0 && _x < width && _y >= 0 && _y < height
                ? state.cells[_x][_y]
                : 0;
          }
        }
      }
      return {
        ...state,
        cells: translatedCells,
        cellsChanged: true,
      };
    }
    default:
      return state;
  }
}

export const toggleIsRunning = () => ({ type: TOGGLE_IS_RUNNING });

export const toggleShouldWrap = () => ({ type: TOGGLE_SHOULD_WRAP });

export const toggleShouldShowHUD = () => ({ type: TOGGLE_SHOULD_SHOW_HUD });

export const toggleShouldShowGridlines = () => ({
  type: TOGGLE_SHOULD_SHOW_GRIDLINES,
});

export const toggleShouldPauseOnStableState = () => ({
  type: TOGGLE_SHOULD_PAUSE_ON_STABLE_STATE,
});

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

export const setNeighborhood = ({ neighborhood }) => ({
  type: SET_NEIGHBORHOOD,
  neighborhood,
});

export const setBorn = ({ index }) => ({ type: SET_BORN, index });

export const setSurvive = ({ index }) => ({ type: SET_SURVIVE, index });

export const clearCells = () => ({ type: CLEAR_CELLS });

export const randomizeCells = () => ({ type: RANDOMIZE_CELLS });

export const getNextCells = () => ({ type: GET_NEXT_CELLS });

export const setArrayOfCells = ({ arrayOfCells, invertState }) => ({
  type: SET_ARRAY_OF_CELLS,
  arrayOfCells,
  invertState,
});

export const translateCells = ({ deltaX, deltaY }) => ({
  type: TRANSLATE_CELLS,
  deltaX,
  deltaY,
});
