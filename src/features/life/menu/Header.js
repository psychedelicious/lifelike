import React from 'react';
import PropTypes from 'prop-types';

import { IoMdSunny, IoMdMoon, IoMdSwap } from 'react-icons/io';

import { IconButton, Flex, Heading } from '@chakra-ui/core';
import { InfoModal } from './InfoModal';
import { SaveCanvasAsImageButton } from './SaveCanvasAsImageButton';

export const Header = React.memo(
  ({
    colorMode,
    isMobile,
    handleToggleColorMode,
    handleToggleLayout,
    canvasRef,
    canvasGridOverlayRef,
    ...rest
  }) => {
    return (
      <Flex {...rest} justify="space-between">
        <Heading fontSize="1.25rem" fontWeight={400}>
          lifelike
        </Heading>

        <Flex justify="right">
          <SaveCanvasAsImageButton
            canvas={canvasRef.current}
            canvasGridOverlay={canvasGridOverlayRef.current}
          />

          {!isMobile && (
            <IconButton
              icon={IoMdSwap}
              fontSize="1.5rem"
              p={0}
              h="unset"
              minW="unset"
              mr="0.5rem"
              variant="unstyled"
              aria-label="swap menu side"
              onClick={handleToggleLayout}
            />
          )}

          <InfoModal />

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

Header.propTypes = {
  colorMode: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  handleToggleColorMode: PropTypes.func.isRequired,
  handleToggleLayout: PropTypes.func.isRequired,
  handleSaveImage: PropTypes.func.isRequired,
};
