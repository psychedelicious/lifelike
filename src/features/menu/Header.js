import React from 'react';
import PropTypes from 'prop-types';

import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import { IconButton, Flex, Heading, useColorMode } from '@chakra-ui/core';

import { InfoModal } from 'features/menu/InfoModal';
import { SaveCanvasAsImageButton } from 'features/menu/SaveCanvasAsImageButton';

const Header = React.memo(
  ({ isMobile, canvasBaseLayerRef, canvasGridLayerRef, ...rest }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
      <Flex {...rest} justify="space-between">
        <Heading fontSize="1.25rem" fontWeight={300}>
          lifelike
        </Heading>

        <Flex justify="right">
          <SaveCanvasAsImageButton
            canvasBaseLayerRef={canvasBaseLayerRef}
            canvasGridLayerRef={canvasGridLayerRef}
          />

          <InfoModal />

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
  }
);

Header.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
};

export default Header;
