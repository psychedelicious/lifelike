import React from 'react';
import { Box } from '@chakra-ui/core';

import ThemedApp from './ThemedApp';
import Lifelike from '../features/life/Lifelike';
import { useMediaQuery } from 'react-responsive';

import { lifelikeTheme } from '../theme';

export default function App() {
  const isMobile = useMediaQuery({ maxWidth: lifelikeTheme.breakpoints.md });

  return (
    <ThemedApp>
      <Box
        w="100%"
        px={isMobile ? '0.75rem' : '1rem'}
        py={isMobile ? '0.5rem' : '1rem'}
      >
        <Lifelike isMobile={isMobile} />
      </Box>
    </ThemedApp>
  );
}
