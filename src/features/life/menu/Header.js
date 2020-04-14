import React from 'react';

import { IoMdSunny, IoMdMoon } from 'react-icons/io';

import { IconButton, Flex, useColorMode, Heading } from '@chakra-ui/core';
import { HelpModal } from './HelpModal';

export const Header = React.memo(({ ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex {...rest} justify="space-between">
      <Heading fontSize="1.25rem" fontWeight={400}>
        lifelike
      </Heading>

      <Flex justify="right">
        <HelpModal />

        <IconButton
          icon={colorMode === 'light' ? IoMdMoon : IoMdSunny}
          fontSize="1.5rem"
          p={0}
          h="unset"
          minW="unset"
          variant="unstyled"
          aria-label="toggle dark mode"
          onClick={toggleColorMode}
        />
      </Flex>
    </Flex>
  );
});
