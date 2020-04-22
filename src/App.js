import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { Box, useTheme } from '@chakra-ui/core';

import Lifelike from 'features/life/Lifelike';

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery({ maxWidth: theme.breakpoints.md });

  return (
    <Box
      w="100%"
      minH="100%"
      px={isMobile ? '0.75rem' : '1rem'}
      py={isMobile ? '0.5rem' : '1rem'}
    >
      <Lifelike isMobile={isMobile} />
    </Box>
  );
}
