import { createStore } from 'redux';
import rootReducer from './reducers';
import { persistStore } from 'redux-persist';

// Due to the size of the cell state, the app really bogs down Redux devtools.
// Use stateSanitizer to prevent the performance issue.

import { composeWithDevTools } from 'redux-devtools-extension';

const stateSanitizer = (state) =>
  state.life.cells
    ? { ...state, life: { ...state.life, cells: '<<LONG_BLOB>>' } }
    : state;

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
  stateSanitizer,
});

export default () => {
  let store = createStore(rootReducer, composeEnhancers());
  let persistor = persistStore(store);
  return { store, persistor };
};
