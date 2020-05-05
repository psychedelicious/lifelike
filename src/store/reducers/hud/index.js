const TOGGLE_HUD_DISPLAY = 'SET_THINGS_TO_SHOW_ON_HUD';

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
    default:
      return state;
  }
}

export const toggleHUDDisplay = ({ itemToToggle }) => ({
  type: TOGGLE_HUD_DISPLAY,
  itemToToggle,
});
