import { createStore } from 'redux';
import rootReducer from './reducers';
import { persistStore } from 'redux-persist';

// Due to the size of the cell state, the app really bogs down Redux devtools,
// even for other apps that are using Redux. commenting it out for production build.

// import { composeWithDevTools } from 'redux-devtools-extension';

// const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

// export default () => {
//   let store = createStore(rootReducer, composeEnhancers());
//   let persistor = persistStore(store);
//   return { store, persistor };
// };

export default () => {
  let store = createStore(rootReducer);
  let persistor = persistStore(store);
  return { store, persistor };
};
