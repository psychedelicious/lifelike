import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { Box, useTheme, useColorMode } from '@chakra-ui/core';

import Lifelike from 'features/life/Lifelike';

const App = () => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const isMobile = useMediaQuery({ maxWidth: theme.breakpoints.md });

  return (
    <Box
      w="100%"
      minH="100%"
      px={isMobile ? '0.75rem' : '1rem'}
      py={isMobile ? '0.5rem' : '1rem'}
    >
      <Lifelike isMobile={isMobile} colorMode={colorMode} />
    </Box>
  );
};

export default React.memo(App);
