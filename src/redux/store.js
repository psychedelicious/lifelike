import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';

export default createStore(rootReducer);
// const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

// export default createStore(rootReducer, composeEnhancers());
