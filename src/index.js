// import 'wydr';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import getStore from 'store';

import App from 'App';
import Loading from 'components/Loading';

import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';

let { store, persistor } = getStore();

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

const WrappedApp = React.memo(() => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset config={() => CSSResetConfig(theme)} />
        <App />
      </ColorModeProvider>
    </ThemeProvider>
  );
});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <WrappedApp />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
