const TOGGLE_SHOULD_SHOW_TOOLTIPS = 'TOGGLE_SHOULD_SHOW_TOOLTIPS';

const initialState = {
  shouldShowTooltips: true,
};

export default function menu(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SHOULD_SHOW_TOOLTIPS:
      return {
        ...state,
        shouldShowTooltips: !state.shouldShowTooltips,
      };
    default:
      return state;
  }
}

export const toggleShouldShowTooltips = () => ({
  type: TOGGLE_SHOULD_SHOW_TOOLTIPS,
});
