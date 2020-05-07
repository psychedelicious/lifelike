const TOGGLE_HUD_DISPLAY = 'TOGGLE_HUD_DISPLAY';
const SET_HUD_OPACITY = 'SET_HUD_OPACITY';
const TOGGLE_SHOULD_SHOW_HUD = 'TOGGLE_SHOULD_SHOW_HUD';

const initialState = {
  hudDisplayItems: ['generation', 'fps'],
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
  shouldShowHUD: false,
};

export default function hud(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_HUD_DISPLAY:
      const { hudDisplayItems } = state;
      const { itemToToggle } = action;

      let newhudDisplayItems;

      if (hudDisplayItems.includes(itemToToggle)) {
        newhudDisplayItems = hudDisplayItems.filter((val) => val !== itemToToggle);
      } else {
        newhudDisplayItems = [...hudDisplayItems, itemToToggle];
      }

      return {
        ...state,
        hudDisplayItems: newhudDisplayItems,
      };
    case SET_HUD_OPACITY: {
      return {
        ...state,
        opacity: action.opacity,
      };
    }
    case TOGGLE_SHOULD_SHOW_HUD:
      return {
        ...state,
        shouldShowHUD: !state.shouldShowHUD,
      };
    default:
      return state;
  }
}

export const toggleHUDDisplayItems = ({ itemToToggle }) => ({
  type: TOGGLE_HUD_DISPLAY,
  itemToToggle,
});

export const setHUDOpacity = ({ opacity }) => ({
  type: SET_HUD_OPACITY,
  opacity,
});

export const toggleShouldShowHUD = () => ({ type: TOGGLE_SHOULD_SHOW_HUD });
