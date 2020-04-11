import React from 'react';
import PropTypes from 'prop-types';

import { IconButton, Flex, useColorMode, Heading } from '@chakra-ui/core';

export const Header = React.memo(({ gridArea }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex gridArea={gridArea} justify="space-between" alignItems="center">
      <Heading fontSize="1.25rem" fontWeight={400}>
        lifelike
      </Heading>

      <IconButton
        icon={colorMode === 'light' ? 'moon' : 'sun'}
        size="sm"
        fontSize="1.25rem"
        p={0}
        h="unset"
        minW="unset"
        mr='0.25rem'
        mt='-0.5rem'
        variant="unstyled"
        aria-label="toggle dark mode"
        onClick={toggleColorMode}
      />
    </Flex>
  );
});

Header.propTypes = {
  gridArea: PropTypes.string.isRequired,
};
