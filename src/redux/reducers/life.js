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
  TOGGLE_LAYOUT,
  SET_CANVASOVERLAYTEXT,
  SET_CANVASMOUSEPOS,
  SET_CELLMOUSEPOS,
  SET_ISALTHELDDOWN,
  SET_BRUSH,
  TOGGLE_INEDITMODE,
  TOGGLE_ISINVERTDRAW,
} from '../actionTypes';

import { Neighborhoods } from '../../features/life/neighborhoods';
import { createCells } from '../../features/life/createCells';
import { getNextCells } from '../../features/life/getNextCells';

import { lifelikeTheme } from '../../theme';

import { getBrushPoints } from '../../geometry/getBrushPoints';

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
  wrap: true,
  showGridlines: false,
  isRunning: false,
  showStats: true,
  generation: 0,
  population: 0,
  density: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  canvasContainerWidth: 0,
  canvasContainerHeight: 0,
  canvasOverlayText: [],
  canvasMousePos: { x: 0, y: 0 },
  cellMousePos: { x: 0, y: 0 },
  isAltHeldDown: false,
  brushShape: 'circle',
  brushRadius: 7,
  brushPoints: [0, 0],
  brushFill: 'solid',
  previousFrameTime: 0,
  speed: 70,
  msDelay: Math.pow(100 - 70, 3) / 1000,
  layout: 'left',
  inEditMode: false,
  isInvertDraw: false,
  lightModeColors: {
    deadCellColor: lifelikeTheme.colors.gray['50'],
    aliveCellColor: lifelikeTheme.colors.blue['700'],
    gridlineColor: `${lifelikeTheme.colors.gray['500']}80`,
  },
  darkModeColors: {
    deadCellColor: lifelikeTheme.colors.blue['100'],
    aliveCellColor: lifelikeTheme.colors.gray['800'],
    gridlineColor: `${lifelikeTheme.colors.gray['600']}80`,
  },
  deadCellColor: null,
  aliveCellColor: null,
  gridlineColor: null,
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
    case SET_CELL:
      const newSetCells = [...state.cells];
      newSetCells[action.payload.x][action.payload.y] = action.payload.state;
      return {
        ...state,
        cells: newSetCells,
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
        population: randomizedCellsPopulation,
        density:
          Math.round(
            (randomizedCellsPopulation * 1000) / (state.width * state.height)
          ) / 10,
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
        density:
          Math.round(
            (clearedCellsPopulation * 1000) / (state.width * state.height)
          ) / 10,
      };
    case TOGGLE_ISRUNNING:
      return {
        ...state,
        isRunning: !state.isRunning,
      };
    case TOGGLE_WRAP:
      return {
        ...state,
        wrap: !state.wrap,
      };
    case TOGGLE_SHOWGRIDLINES:
      return {
        ...state,
        showGridlines: !state.showGridlines,
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
      };
    case SET_PREVIOUSFRAMETIME: {
      return {
        ...state,
        previousFrameTime: action.previousFrameTime,
      };
    }
    case SET_SPEED: {
      return {
        ...state,
        speed: action.speed,
        msDelay: Math.pow(100 - action.speed, 3) / 1000,
      };
    }
    case GET_NEXT_CELLS: {
      const [nextCells, nextPopulation] = getNextCells(
        state.cells,
        state.width,
        state.height,
        state.born,
        state.survive,
        state.wrap,
        state.neighborhood
      );
      return {
        ...state,
        generation: state.generation + 1,
        cells: nextCells,
        population: nextPopulation,
        density:
          Math.round((nextPopulation * 1000) / (state.width * state.height)) /
          10,
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
        population: setGridPopulation,
        density:
          Math.round(
            (setGridPopulation * 1000) /
              (action.payload.width * action.payload.height)
          ) / 10,
      };
    }
    case SET_COLORS: {
      return {
        ...state,
        aliveCellColor: action.payload.aliveCellColor ?? state.aliveCellColor,
        deadCellColor: action.payload.deadCellColor ?? state.deadCellColor,
        gridlineColor: action.payload.gridlineColor ?? state.gridlineColor,
      };
    }
    case TOGGLE_LAYOUT: {
      return {
        ...state,
        layout: state.layout === 'left' ? 'right' : 'left',
      };
    }
    case SET_ARRAYOFCELLS: {
      let newArrayOfCells = [...state.cells];
      action.payload.arrayOfCells.forEach(({ x, y, state: cellState }) => {
        if (x >= 0 && x < state.width && y >= 0 && y < state.height) {
          if (action.payload.invertState) {
            if (cellState === 1) {
              newArrayOfCells[x][y] = 0;
            }
          } else {
            if (cellState === 1) {
              newArrayOfCells[x][y] = 1;
            }
          }
        }
      });

      let newPopulation = newArrayOfCells
        .flat()
        .reduce((acc, val) => acc + val, 0);

      return {
        ...state,
        cells: newArrayOfCells,
        population: newPopulation,
        density:
          Math.round((newPopulation * 1000) / (state.width * state.height)) /
          10,
      };
    }
    case SET_CANVASOVERLAYTEXT: {
      return {
        ...state,
        canvasOverlayText: action.payload.text,
      };
    }
    case SET_CANVASMOUSEPOS: {
      return {
        ...state,
        canvasMousePos: action.payload,
      };
    }
    case SET_CELLMOUSEPOS: {
      return {
        ...state,
        cellMousePos: action.payload,
      };
    }
    case SET_ISALTHELDDOWN: {
      return {
        ...state,
        isAltHeldDown: action.payload.isAltHeldDown,
      };
    }
    case SET_BRUSH: {
      const newBrushPoints = getBrushPoints({
        brushShape: action.payload.brushShape,
        brushRadius: action.payload.brushRadius,
        brushFill: action.payload.brushFill,
      });

      return {
        ...state,
        brushShape: action.payload.brushShape,
        brushRadius: action.payload.brushRadius,
        brushFill: action.payload.brushFill,
        brushPoints: newBrushPoints,
      };
    }
    case TOGGLE_INEDITMODE: {
      return {
        ...state,
        inEditMode: !state.inEditMode,
      };
    }
    case TOGGLE_ISINVERTDRAW: {
      return {
        ...state,
        isInvertDraw: !state.isInvertDraw,
      };
    }
    default:
      return state;
  }
}
