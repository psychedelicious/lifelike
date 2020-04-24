import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from 'store';
import { lifelikeTheme } from 'theme';

import App from 'App';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   const ReactRedux = require('react-redux');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     trackHooks: true,
//     trackExtraHooks: [
//       [
//         ReactRedux,
//         'useSelector',
//         'useDispatch',
//         'useEffect',
//         'useLayoutEffect',
//         'useCanvas',
//         'useAnimationFrame',
//       ],
//     ],
//   });
// }

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={lifelikeTheme}>
      <ColorModeProvider>
        <CSSReset />
        <App />
      </ColorModeProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
