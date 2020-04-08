import React from 'react';
import { Box } from '@chakra-ui/core';

import ThemedApp from './ThemedApp';
import { Lifelike } from '../features/life/Lifelike';

export default function App() {
  const appContainerRef = React.useRef(null);
  return (
    <ThemedApp>
      <Box w="100%" h="100%" p="1rem" ref={appContainerRef}>
        <Lifelike appContainerRef={appContainerRef} />
      </Box>
    </ThemedApp>
  );
}
