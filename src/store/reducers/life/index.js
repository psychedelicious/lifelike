import { omit } from 'lodash';

import { lifelikeTheme } from 'theme';

import { Neighborhoods } from 'features/life/neighborhoods';

import { createCells } from 'store/reducers/life/createCells';

import {
  getNextCells_shouldDrawAllCells,
  getNextCells_drawChangedCells,
} from 'store/reducers/life/getNextCells';

import { getDensity } from 'store/reducers/life/utilities';

const CLEAR_CELLS = 'CLEAR_CELLS';
const DELETE_BOOKMARK = 'DELETE_BOOKMARK';
const GET_NEXT_CELLS = 'GET_NEXT_CELLS';
const LOAD_BOOKMARK = 'LOAD_BOOKMARK';
const NEXT_DRAW_ALL_CELLS = 'NEXT_DRAW_ALL_CELLS';
const RANDOMIZE_CELLS = 'RANDOMIZE_CELLS';
const RENAME_BOOKMARK = 'RENAME_BOOKMARK';
const SAVE_BOOKMARK = 'SAVE_BOOKMARK';
const SET_ARRAY_OF_CELLS = 'SET_ARRAY_OF_CELLS';
const SET_BORN = 'SET_BORN';
const SET_GRID = 'SET_GRID';
const SET_NEIGHBORHOOD = 'SET_NEIGHBORHOOD';
const SET_SURVIVE = 'SET_SURVIVE';
const SET_WAS_BOOKMARK_JUST_LOADED = 'SET_WAS_BOOKMARK_JUST_LOADED';
const TOGGLE_IS_RUNNING = 'TOGGLE_IS_RUNNING';
const TOGGLE_SHOULD_DRAW_ALL_CELLS = 'TOGGLE_SHOULD_DRAW_ALL_CELLS';
const TOGGLE_SHOULD_PAUSE_ON_STABLE_STATE =
  'TOGGLE_SHOULD_PAUSE_ON_STABLE_STATE';
const TOGGLE_SHOULD_SHOW_GRIDLINES = 'TOGGLE_SHOULD_SHOW_GRIDLINES';
const TOGGLE_SHOULD_SHOW_HUD = 'TOGGLE_SHOULD_SHOW_HUD';
const TOGGLE_SHOULD_WRAP = 'TOGGLE_SHOULD_WRAP';
const TRANSLATE_CELLS = 'TRANSLATE_CELLS';

const initialState = {
  bookmarks: [],
  born: [false, false, false, true, false, false, false, false, false],
  canvasContainerHeight: 0,
  canvasContainerWidth: 0,
  canvasHeight: 0,
  canvasWidth: 0,
  cells: [],
  density: 0,
  didAnyCellsChange: true,
  generation: 0,
  height: 0,
  isRunning: false,
  maxHeight: 2000,
  maxPx: 25,
  maxWidth: 2000,
  minHeight: 1,
  minPx: 1,
  minWidth: 1,
  neighborhood: Neighborhoods.MOORE,
  population: 0,
  px: window.matchMedia(`(max-width: ${lifelikeTheme.breakpoints.md})`).matches
    ? 3
    : 5,
  redrawCellList: [[], []],
  shouldDrawAllCells: true,
  shouldNextDrawAllCells: false,
  shouldPauseOnStableState: false,
  shouldShowGridlines: false,
  shouldShowHUD: false,
  shouldWrap: true,
  survive: [false, false, true, true, false, false, false, false, false],
  wasBookmarkJustLoaded: false,
  width: 0,
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
      let [
        newRandomizedCells,
        newRandomizedPopulation,
        newRandomizedRedrawCellList,
      ] = createCells({
        width: state.width,
        height: state.height,
        fill: 'random',
      });
      return {
        ...state,
        generation: 0,
        cells: newRandomizedCells,
        didAnyCellsChange: true,
        population: newRandomizedPopulation,
        density: getDensity(newRandomizedPopulation, state.width, state.height),
        redrawCellList: newRandomizedRedrawCellList,
      };
    case CLEAR_CELLS:
      let [
        newClearedCells,
        newClearedPopulation,
        newClearedRedrawCellList,
      ] = createCells({
        width: state.width,
        height: state.height,
        fill: 0,
      });
      return {
        ...state,
        generation: 0,
        cells: newClearedCells,
        population: newClearedPopulation,
        didAnyCellsChange: true,
        density: getDensity(newClearedPopulation, state.width, state.height),
        redrawCellList: newClearedRedrawCellList,
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
      if (state.shouldDrawAllCells) {
        let [
          newCells,
          newPopulation,
          didAnyCellsChange,
        ] = getNextCells_shouldDrawAllCells(
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
          cells: newCells,
          population: newPopulation,
          didAnyCellsChange: didAnyCellsChange,
          shouldNextDrawAllCells: false,
          density: getDensity(newPopulation, state.width, state.height),
        };
      } else {
        let [
          newCells,
          newPopulation,
          didAnyCellsChange,
          newRedrawCellList,
        ] = getNextCells_drawChangedCells(
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
          cells: newCells,
          population: newPopulation,
          didAnyCellsChange: didAnyCellsChange,
          redrawCellList: newRedrawCellList,
          shouldNextDrawAllCells: false,
          density: getDensity(newPopulation, state.width, state.height),
        };
      }
    }
    case SET_GRID: {
      let [
        newSetGridCells,
        newSetGridPopulation,
        newSetGridRedrawCellList,
      ] = createCells({
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
        cells: newSetGridCells,
        didAnyCellsChange: true,
        population: newSetGridPopulation,
        density: getDensity(
          newSetGridPopulation,
          action.payload.width,
          action.payload.height
        ),
        redrawCellList: newSetGridRedrawCellList,
      };
    }
    case SET_ARRAY_OF_CELLS: {
      let newSetArrayCells = [...state.cells],
        newSetArrayRedrawCellList = [[], []];

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

          if (action.invertState) {
            newSetArrayCells[x][y] = 0;
            newSetArrayRedrawCellList[0].push([x, y]);
          } else {
            newSetArrayCells[x][y] = 1;
            newSetArrayRedrawCellList[1].push([x, y]);
          }
        } else {
          if (x >= 0 && x < state.width && y >= 0 && y < state.height) {
            if (action.invertState) {
              newSetArrayCells[x][y] = 0;
              newSetArrayRedrawCellList[0].push([x, y]);
            } else {
              newSetArrayCells[x][y] = 1;
              newSetArrayRedrawCellList[1].push([x, y]);
            }
          }
        }
      });

      let newSetArrayPopulation = newSetArrayCells
        .flat()
        .reduce((sum, val) => sum + val, 0);

      return {
        ...state,
        cells: newSetArrayCells,
        population: newSetArrayPopulation,
        didAnyCellsChange: true,
        redrawCellList: newSetArrayRedrawCellList,
        density: getDensity(newSetArrayPopulation, state.width, state.height),
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

            if (_x >= 0 && _x < width && _y >= 0 && _y < height) {
              translatedCells[x][y] = state.cells[_x][_y];
            } else {
              translatedCells[x][y] = 0;
            }
          }
        }
      }

      const [
        newTranslatedCells,
        newTranslatedPopulation,
        newTranslatedRedrawCellList,
      ] = createCells({
        width: state.width,
        height: state.height,
        fill: translatedCells,
      });

      return {
        ...state,
        cells: newTranslatedCells,
        population: newTranslatedPopulation,
        redrawCellList: newTranslatedRedrawCellList,
        didAnyCellsChange: true,
      };
    }
    case TOGGLE_SHOULD_DRAW_ALL_CELLS: {
      const [cells, population, redrawCellList] = createCells({
        width: state.width,
        height: state.height,
        fill: state.cells,
      });
      return {
        ...state,
        cells,
        population,
        redrawCellList,
        shouldDrawAllCells: !state.shouldDrawAllCells,
      };
    }
    case NEXT_DRAW_ALL_CELLS: {
      return {
        ...state,
        shouldNextDrawAllCells: true,
      };
    }
    case SAVE_BOOKMARK: {
      const { name } = action;
      const bookmark = {
        ...omit(state, [
          'bookmarks',
          'shouldShowGridlines',
          'isRunning',
          'shouldPauseOnStableState',
          'shouldShowHUD',
        ]),
        name,
      };
      return {
        ...state,
        bookmarks: [...state.bookmarks, bookmark],
      };
    }
    case LOAD_BOOKMARK: {
      const { index } = action;
      let newState = omit(state.bookmarks[index], ['name']);

      return {
        ...state,
        ...newState,
        isRunning: false,
        wasBookmarkJustLoaded: true,
      };
    }
    case DELETE_BOOKMARK: {
      const { index } = action;
      const newBookmarks = state.bookmarks.filter((val, i) => i !== index);

      return {
        ...state,
        bookmarks: newBookmarks,
      };
    }
    case RENAME_BOOKMARK: {
      const { index, name } = action;
      const newBookmarks = state.bookmarks.map((val, i) =>
        i === index ? { ...val, name } : { ...val }
      );

      return {
        ...state,
        bookmarks: newBookmarks,
      };
    }
    case SET_WAS_BOOKMARK_JUST_LOADED: {
      return {
        ...state,
        wasBookmarkJustLoaded: action.wasBookmarkJustLoaded,
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

export const toggleShouldDrawAllCells = () => ({
  type: TOGGLE_SHOULD_DRAW_ALL_CELLS,
});

export const clearCells = () => ({ type: CLEAR_CELLS });

export const saveBookmark = ({ name }) => ({ type: SAVE_BOOKMARK, name });

export const loadBookmark = ({ index }) => ({ type: LOAD_BOOKMARK, index });

export const deleteBookmark = ({ index }) => ({ type: DELETE_BOOKMARK, index });

export const renameBookmark = ({ index, name }) => ({
  type: RENAME_BOOKMARK,
  index,
  name,
});

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

export const nextDrawAllCells = () => ({ type: NEXT_DRAW_ALL_CELLS });

export const setWasBookmarkJustLoaded = ({ wasBookmarkJustLoaded }) => ({
  type: SET_WAS_BOOKMARK_JUST_LOADED,
  wasBookmarkJustLoaded,
});
