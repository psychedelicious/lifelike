import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './components/App';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   const ReactRedux = require('react-redux');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     trackExtraHooks: [[ReactRedux, 'useSelector', 'useDispatch']],
//   });
// }

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
