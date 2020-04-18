import React from 'react';
import PropTypes from 'prop-types';

import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import { IconButton, Flex, Heading, useColorMode } from '@chakra-ui/core';

import { InfoModal } from './InfoModal';
import { SaveCanvasAsImageButton } from './SaveCanvasAsImageButton';

export const Header = React.memo(
  ({ isMobile, canvasRef, canvasGridOverlayRef, ...rest }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
      <Flex {...rest} justify="space-between">
        <Heading fontSize="1.25rem" fontWeight={300}>
          lifelike
        </Heading>

        <Flex justify="right">
          <SaveCanvasAsImageButton
            canvas={canvasRef.current}
            canvasGridOverlay={canvasGridOverlayRef.current}
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
};
