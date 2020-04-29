import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { Box, useColorMode } from '@chakra-ui/core';

import Lifelike from 'features/life/Lifelike';
import { lifelikeTheme } from 'theme';

const App = () => {
  const { colorMode } = useColorMode();

  const isMobile = useMediaQuery({ maxWidth: lifelikeTheme.breakpoints.md });

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
