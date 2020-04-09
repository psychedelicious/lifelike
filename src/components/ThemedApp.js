import React from 'react';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';

import { lifelikeTheme } from '../theme';

export default function ThemedApp({ children }) {
  return (
    <ThemeProvider theme={lifelikeTheme}>
      <ColorModeProvider>
        <CSSReset />
        {children}
      </ColorModeProvider>
    </ThemeProvider>
  );
}
