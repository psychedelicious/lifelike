import { lifelikeTheme } from 'theme';

const SET_COLOR_MODE = 'SET_COLOR_MODE';
const TOGGLE_SHOULD_SWAP_CELL_COLORS = 'TOGGLE_SHOULD_SWAP_CELL_COLORS';

const initialState = {
  lightModeColors: {
    deadCellColor: lifelikeTheme.colors.white,
    aliveCellColor: lifelikeTheme.colors.blue['600'],
    gridlineColor: `${lifelikeTheme.colors.blue['500']}80`,
  },
  darkModeColors: {
    deadCellColor: lifelikeTheme.colors.blue['100'],
    aliveCellColor: '#1A202C', // the Chakra UI background color
    gridlineColor: `${lifelikeTheme.colors.blue['600']}80`,
  },
  shouldSwapCellColors: false,
  colorMode: null,
  colors: {},
};

export default function theme(state = initialState, action) {
  switch (action.type) {
    case SET_COLOR_MODE: {
      const { colorMode } = action;
      const { shouldSwapCellColors } = state;
      let aliveCellColor, deadCellColor, gridlineColor;

      if (colorMode === 'light') {
        if (shouldSwapCellColors) {
          aliveCellColor = state.lightModeColors.deadCellColor;
          deadCellColor = state.lightModeColors.aliveCellColor;
        } else {
          aliveCellColor = state.lightModeColors.aliveCellColor;
          deadCellColor = state.lightModeColors.deadCellColor;
        }
        gridlineColor = state.lightModeColors.gridlineColor;
      } else {
        if (shouldSwapCellColors) {
          aliveCellColor = state.darkModeColors.deadCellColor;
          deadCellColor = state.darkModeColors.aliveCellColor;
        } else {
          aliveCellColor = state.darkModeColors.aliveCellColor;
          deadCellColor = state.darkModeColors.deadCellColor;
        }
        gridlineColor = state.darkModeColors.gridlineColor;
      }

      return {
        ...state,
        colorMode: colorMode,
        colors: {
          aliveCellColor,
          deadCellColor,
          gridlineColor,
        },
      };
    }
    case TOGGLE_SHOULD_SWAP_CELL_COLORS: {
      const shouldSwapCellColors = !state.shouldSwapCellColors;
      const { colorMode } = state;

      let aliveCellColor, deadCellColor, gridlineColor;

      if (colorMode === 'light') {
        if (shouldSwapCellColors) {
          aliveCellColor = state.lightModeColors.deadCellColor;
          deadCellColor = state.lightModeColors.aliveCellColor;
        } else {
          aliveCellColor = state.lightModeColors.aliveCellColor;
          deadCellColor = state.lightModeColors.deadCellColor;
        }
        gridlineColor = state.lightModeColors.gridlineColor;
      } else {
        if (shouldSwapCellColors) {
          aliveCellColor = state.darkModeColors.deadCellColor;
          deadCellColor = state.darkModeColors.aliveCellColor;
        } else {
          aliveCellColor = state.darkModeColors.aliveCellColor;
          deadCellColor = state.darkModeColors.deadCellColor;
        }
        gridlineColor = state.darkModeColors.gridlineColor;
      }

      return {
        ...state,
        shouldSwapCellColors,
        colors: { aliveCellColor, deadCellColor, gridlineColor },
      };
    }
    default:
      return state;
  }
}

export const setColorMode = ({ colorMode }) => ({
  type: SET_COLOR_MODE,
  colorMode,
});

export const toggleShouldSwapCellColors = () => ({
  type: TOGGLE_SHOULD_SWAP_CELL_COLORS,
});
