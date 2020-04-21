import React from 'react';
import { useMediaQuery } from 'react-responsive';

import {
  Box,
  ColorModeProvider,
  CSSReset,
  ThemeProvider,
} from '@chakra-ui/core';

import Lifelike from 'features/life/Lifelike';
import { lifelikeTheme } from 'theme';

export default function App() {
  const isMobile = useMediaQuery({ maxWidth: lifelikeTheme.breakpoints.md });

  return (
    <ThemeProvider theme={lifelikeTheme}>
      <ColorModeProvider>
        <CSSReset />
        <Box
          w="100%"
          px={isMobile ? '0.75rem' : '1rem'}
          py={isMobile ? '0.5rem' : '1rem'}
        >
          <Lifelike isMobile={isMobile} />
        </Box>
      </ColorModeProvider>
    </ThemeProvider>
  );
}
