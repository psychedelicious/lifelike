import React from 'react';
import PropTypes from 'prop-types';

import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import { IconButton, Flex, Heading, useColorMode } from '@chakra-ui/core';

import { InfoModal } from 'features/menu/InfoModal';
import { SaveCanvasAsImageButton } from 'features/menu/SaveCanvasAsImageButton';
import { useSelector } from 'react-redux';
import { SaveAnimationButton } from './SaveAnimationButton';

const Header = React.memo(
  ({
    isMobile,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    isRecording,
    handleStartCapture,
    handleStopCapture,
    ...rest
  }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { aliveCellColor, deadCellColor } = useSelector(
      (state) => state.life[`${colorMode}ModeColors`]
    );

    const headerColor = colorMode === 'light' ? aliveCellColor : deadCellColor;

    return (
      <Flex {...rest} justify="space-between">
        <Heading fontSize="1.25rem" fontWeight={300} color={headerColor}>
          lifelike
        </Heading>

        <Flex justify="right">
          <SaveAnimationButton
            canvasBaseLayerRef={canvasBaseLayerRef}
            isRecording={isRecording}
            handleStartCapture={handleStartCapture}
            handleStopCapture={handleStopCapture}
            variantColor="blue"
          />
          <SaveCanvasAsImageButton
            canvasBaseLayerRef={canvasBaseLayerRef}
            canvasGridLayerRef={canvasGridLayerRef}
            variantColor="blue"
          />

          <InfoModal variantColor="blue" />

          <IconButton
            icon={colorMode === 'light' ? IoMdMoon : IoMdSunny}
            fontSize="1.5rem"
            p={0}
            h="unset"
            minW="unset"
            variant="link"
            aria-label="toggle dark mode"
            onClick={toggleColorMode}
            variantColor="blue"
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
