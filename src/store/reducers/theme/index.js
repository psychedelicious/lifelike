import { lifelikeTheme } from 'theme';

import Color from 'color';

const SET_THEME_COLOR = 'SET_THEME_COLOR';

const initialState = {
  theme: {
    ...lifelikeTheme,
    colors: {
      ...lifelikeTheme.colors,
      blue: lifelikeTheme.colors['green'],
    },
  },
  aliveCellColor: null,
  deadCellColor: null,
  gridlineColor: null,
  themeColor: 'green',
  colorMode: 'light',
  shouldSwapCellColors: false,
  headerColor: null,
  sliderThumbBgColor: null,
  sliderDisabledThumbBgColor: null,
  sliderThumbColor: null,
  buttonBackgroundColor: null,
  buttonBackgroundColorHover: null,
};

export default function theme(state = initialState, action) {
  switch (action.type) {
    case SET_THEME_COLOR: {
      const {
        themeColor = state.themeColor,
        colorMode = state.colorMode,
        shouldSwapCellColors = state.shouldSwapCellColors,
      } = action;

      const primaryColorMap = {
        plum: 'green',
        gray: 'green',
        offgray: 'green',
        red: 'green',
        orange: 'green',
        yellow: 'green',
        green: 'orange',
        teal: 'orange',
        blue: 'green',
        cyan: 'orange',
        purple: 'green',
        pink: 'green',
      };

      const secondaryColorMap = {
        plum: 'red',
        gray: 'red',
        offgray: 'red',
        red: 'purple',
        orange: 'purple',
        yellow: 'red',
        green: 'purple',
        teal: 'purple',
        blue: 'red',
        cyan: 'purple',
        purple: 'red',
        pink: 'purple',
      };

      let aliveCellColor,
        deadCellColor,
        gridlineColor,
        headerColor,
        sliderThumbBgColor,
        sliderThumbColor,
        sliderDisabledThumbBgColor,
        buttonBackgroundColor,
        buttonBackgroundColorHover;

      if (colorMode === 'light') {
        if (shouldSwapCellColors) {
          deadCellColor = lifelikeTheme.colors[themeColor]['600'];
          aliveCellColor = lifelikeTheme.colors.lightBackground;
        } else {
          deadCellColor = lifelikeTheme.colors.lightBackground;
          aliveCellColor = lifelikeTheme.colors[themeColor]['600'];
        }
        headerColor = lifelikeTheme.colors.darkBackground;
        sliderThumbBgColor = lifelikeTheme.colors.lightBackground;
        sliderDisabledThumbBgColor = lifelikeTheme.colors.gray['300'];
        sliderThumbColor = lifelikeTheme.colors[themeColor]['600'];
        gridlineColor = `${lifelikeTheme.colors[themeColor]['500']}80`;
        buttonBackgroundColor = 'blackAlpha.200';
        buttonBackgroundColorHover = 'blackAlpha.300';
      } else {
        if (shouldSwapCellColors) {
          deadCellColor = lifelikeTheme.colors[themeColor]['200'];
          aliveCellColor = lifelikeTheme.colors.darkBackground;
        } else {
          deadCellColor = lifelikeTheme.colors.darkBackground;
          aliveCellColor = lifelikeTheme.colors[themeColor]['200'];
        }
        headerColor = lifelikeTheme.colors.lightBackground;
        sliderThumbBgColor = lifelikeTheme.colors[themeColor]['200'];
        sliderDisabledThumbBgColor = Color(
          lifelikeTheme.colors[themeColor]['200']
        )
          .desaturate(0.8)
          .darken(0.5)
          .hex();
        sliderThumbColor = lifelikeTheme.colors.darkBackground;
        gridlineColor = `${lifelikeTheme.colors[themeColor]['600']}80`;
        buttonBackgroundColor = 'whiteAlpha.100';
        buttonBackgroundColorHover = 'whiteAlpha.300';
      }

      return {
        ...state,
        aliveCellColor,
        deadCellColor,
        gridlineColor,
        headerColor,
        sliderThumbBgColor,
        sliderThumbColor,
        sliderDisabledThumbBgColor,
        themeColor,
        colorMode,
        shouldSwapCellColors,
        buttonBackgroundColor,
        buttonBackgroundColorHover,
        theme: {
          ...lifelikeTheme,
          colors: {
            ...lifelikeTheme.colors,
            blue: lifelikeTheme.colors[themeColor],
            primary: lifelikeTheme.colors[primaryColorMap[themeColor]],
            secondary: lifelikeTheme.colors[secondaryColorMap[themeColor]],
          },
        },
      };
    }
    default:
      return state;
  }
}

export const setThemeColor = ({
  themeColor,
  colorMode,
  shouldSwapCellColors,
}) => {
  return {
    type: SET_THEME_COLOR,
    themeColor,
    colorMode,
    shouldSwapCellColors,
  };
};
