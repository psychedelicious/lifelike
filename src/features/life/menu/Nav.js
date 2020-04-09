import React from 'react';

import { IconButton, Flex, useColorMode, Heading } from '@chakra-ui/core';

export const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex justify="space-between">
      <Heading size="lg" mr="3" fontWeight={300}>
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
};
