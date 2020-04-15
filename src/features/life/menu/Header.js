import React from 'react';

import { IoMdSunny, IoMdMoon } from 'react-icons/io';

import { IconButton, Flex, Heading } from '@chakra-ui/core';
import { HelpModal } from './HelpModal';

export const Header = React.memo(
  ({ colorMode, handleToggleColorMode, ...rest }) => {
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
            onClick={handleToggleColorMode}
          />
        </Flex>
      </Flex>
    );
  }
);
