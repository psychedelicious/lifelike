import { clamp } from 'lodash';
import { getBrushPoints } from './getBrushPoints';

const SET_BRUSH = 'SET_BRUSH';
const TOGGLE_IN_EDIT_MODE = 'TOGGLE_IN_EDIT_MODE';
const TOGGLE_IS_INVERT_DRAW = 'TOGGLE_IS_INVERT_DRAW';

const initialState = {
  brushShape: 'circle',
  validBrushShapes: ['square', 'circle', 'pencil'],
  brushRadius: 1,
  minBrushRadius: 1,
  maxBrushRadius: 50,
  brushPoints: [],
  brushFill: 'solid',
  validBrushFills: ['solid', 'outline', 'random', 'spray'],
  inEditMode: false,
  isInvertDraw: false,
};

export default function drawing(state = initialState, action) {
  switch (action.type) {
    case SET_BRUSH: {
      const { brushRadius, brushFill, brushShape } = action;
      const clampedBrushRadius = clamp(
        brushRadius,
        state.minBrushRadius,
        state.maxBrushRadius
      );

      const newBrushPoints = getBrushPoints({
        brushShape: brushShape,
        brushRadius: clampedBrushRadius,
        brushFill: brushFill,
      });

      return {
        ...state,
        brushShape: brushShape,
        brushRadius: clampedBrushRadius,
        brushFill: brushFill,
        brushPoints: newBrushPoints,
      };
    }
    case TOGGLE_IN_EDIT_MODE: {
      return {
        ...state,
        inEditMode: !state.inEditMode,
      };
    }
    case TOGGLE_IS_INVERT_DRAW: {
      return {
        ...state,
        isInvertDraw: !state.isInvertDraw,
      };
    }
    default:
      return state;
  }
}

export const setBrush = ({ brushShape, brushRadius, brushFill }) => ({
  type: SET_BRUSH,
  brushShape,
  brushRadius,
  brushFill,
});

export const toggleInEditMode = () => ({ type: TOGGLE_IN_EDIT_MODE });

export const toggleIsInvertDraw = () => ({ type: TOGGLE_IS_INVERT_DRAW });
