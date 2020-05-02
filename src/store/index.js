import { createStore } from 'redux';
import rootReducer from './reducers';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

export default () => {
  let store = createStore(rootReducer, composeEnhancers());
  let persistor = persistStore(store);
  return { store, persistor };
};
