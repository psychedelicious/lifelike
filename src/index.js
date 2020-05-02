import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import getStore from 'store';

import App from 'App';

import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Spinner,
  Flex,
} from '@chakra-ui/core';

// WHY DID YOU RENDER?
// Commented even in dev mode because of potential performance impact.

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

let { store, persistor } = getStore();

const Loading = () => {
  return (
    <Flex w="100vw" h="100vh" justify="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  );
};

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
    <PersistGate loading={<Loading />} persistor={persistor}>
      <WrappedApp />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
