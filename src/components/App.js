import React from 'react';
import { Box } from '@chakra-ui/core';

import ThemedApp from './ThemedApp';
import { Lifelike } from '../features/life/Lifelike';

export default function App() {
  return (
    <ThemedApp>
      <Box w="100%" h="100%" p="1rem">
        <Lifelike />
      </Box>
    </ThemedApp>
  );
}
