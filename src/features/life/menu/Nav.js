import React from 'react';

import { IconButton, Flex, useColorMode, Heading } from '@chakra-ui/core';

export const Nav = React.memo(() => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex justify="space-between" mb='1rem'>
      <Heading size="lg" fontWeight={400}>
        lifelike
      </Heading>

      <IconButton
        icon={colorMode === 'light' ? 'moon' : 'sun'}
        size="lg"
        p="0rem"
        h={0}
        fontSize="1.5rem"
        mt="-0.25rem"
        mr="-1rem"
        variant="unstyled"
        aria-label="toggle dark mode"
        onClick={toggleColorMode}
      />
    </Flex>
  );
});
