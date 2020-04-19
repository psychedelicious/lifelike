import { createStore } from 'redux';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({ trace: false, traceLimit: 25 });

export default createStore(rootReducer, composeEnhancers());
