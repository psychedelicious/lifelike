const TOGGLE_HUD_DISPLAY = 'TOGGLE_HUD_DISPLAY';
const SET_HUD_OPACITY = 'SET_HUD_OPACITY';

const initialState = {
  hudDisplay: ['generation', 'fps'],
  validHUDDisplayItems: [
    'width',
    'height',
    'scale',
    'generation',
    'population',
    'density',
    'delay',
    'fps',
    'wrap',
    'running',
    'mode',
  ],
  opacity: 0.9,
};

export default function hud(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_HUD_DISPLAY:
      const { hudDisplay } = state;
      const { itemToToggle } = action;

      let newHUDDisplay;

      if (hudDisplay.includes(itemToToggle)) {
        newHUDDisplay = hudDisplay.filter((val) => val !== itemToToggle);
      } else {
        newHUDDisplay = [...hudDisplay, itemToToggle];
      }

      return {
        ...state,
        hudDisplay: newHUDDisplay,
      };
    case SET_HUD_OPACITY: {
      return {
        ...state,
        opacity: action.opacity,
      };
    }
    default:
      return state;
  }
}

export const toggleHUDDisplay = ({ itemToToggle }) => ({
  type: TOGGLE_HUD_DISPLAY,
  itemToToggle,
});

export const setHUDOpacity = ({ opacity }) => ({
  type: SET_HUD_OPACITY,
  opacity,
});
