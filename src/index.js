import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';

import store from 'store';

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

const CSSResetConfig = (theme) => ({
  light: {
    color: theme.colors.gray[800],
    bg: theme.colors.lightBackground,
    borderColor: theme.colors.gray[200],
    placeholderColor: theme.colors.gray[400],
  },
  dark: {
    color: theme.colors.whiteAlpha[900],
    bg: theme.colors.darkBackground,
    borderColor: theme.colors.whiteAlpha[300],
    placeholderColor: theme.colors.whiteAlpha[400],
  },
});

const WrappedApp = () => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset config={() => CSSResetConfig(theme)} />
        <App />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <WrappedApp />
  </Provider>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <Provider store={store}>
//     <ThemeProvider theme={lifelikeTheme}>
//       <ColorModeProvider>
//         <CSSReset />
//         <App />
//       </ColorModeProvider>
//     </ThemeProvider>
//   </Provider>,
//   document.getElementById('root')
// );
