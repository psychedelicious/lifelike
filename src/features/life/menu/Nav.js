import React from 'react';

import { IoMdSunny, IoMdMoon } from 'react-icons/io';

import { IconButton, Flex, useColorMode, Heading } from '@chakra-ui/core';

export const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex justify="space-between">
      <Heading mr="3">lifelike</Heading>

      <IconButton
        icon={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        variant="outline"
        aria-label="toggle dark mode"
        onClick={toggleColorMode}
      />
    </Flex>
  );
};
