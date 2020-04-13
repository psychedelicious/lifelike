import React from 'react';
import { Box } from '@chakra-ui/core';

import ThemedApp from './ThemedApp';
import { Lifelike } from '../features/life/Lifelike';
import { useMediaQuery } from 'react-responsive';

import { lifelikeTheme } from '../theme';

export default function App() {
  const isMobile = useMediaQuery({ maxWidth: lifelikeTheme.breakpoints.md });

  return (
    <ThemedApp>
      <Box w="100%" p="1rem">
        <Lifelike isMobile={isMobile} />
      </Box>
    </ThemedApp>
  );
}
