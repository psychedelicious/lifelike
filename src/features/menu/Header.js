import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { IoMdSunny, IoMdMoon, IoMdHelpCircle } from 'react-icons/io';
import { IconButton, Flex, Heading, useColorMode, Link } from '@chakra-ui/core';

import SaveAsImageButton from 'features/menu/SaveAsImageButton';
import SaveAsVideoButton from 'features/menu/SaveAsVideoButton';
import ChangeThemeButton from './ChangeThemeButton';
import { nextDrawAllCells } from 'store/reducers/life';
import { setThemeColor } from 'store/reducers/theme';

const Header = ({
  isMobile,
  canvasBaseLayerRef,
  canvasGridLayerRef,
  ...rest
}) => {
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const { headerColor } = useSelector((state) => state.theme);

  const isMediaRecorderAvailable = window.MediaRecorder ? true : false;

  const handleToggleColorMode = () => {
    toggleColorMode();
    dispatch(
      setThemeColor({ colorMode: colorMode === 'light' ? 'dark' : 'light' })
    );

    dispatch(nextDrawAllCells());
  };

  return (
    <Flex {...rest} justify="space-between">
      <Heading fontSize="1.25rem" fontWeight={300} color={headerColor}>
        lifelike
      </Heading>

      <Flex justify="right">
        <Link
          href="https://github.com/psychedelicious/lifelike"
          target="new"
          mr="0.5rem"
        >
          <IconButton
            icon={IoMdHelpCircle}
            fontSize="1.5rem"
            p={0}
            h="unset"
            minW="unset"
            variant="link"
            aria-label="help/info"
            variantColor="blue"
          />
        </Link>

        {isMediaRecorderAvailable && (
          <SaveAsVideoButton canvasBaseLayerRef={canvasBaseLayerRef} />
        )}

        <SaveAsImageButton
          canvasBaseLayerRef={canvasBaseLayerRef}
          canvasGridLayerRef={canvasGridLayerRef}
          variantColor="blue"
        />

        <ChangeThemeButton variantColor="blue" />

        <IconButton
          icon={colorMode === 'light' ? IoMdMoon : IoMdSunny}
          fontSize="1.5rem"
          p={0}
          h="unset"
          minW="unset"
          variant="link"
          aria-label="toggle dark mode"
          onClick={handleToggleColorMode}
          variantColor="blue"
        />
      </Flex>
    </Flex>
  );
};
Header.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
};

export default React.memo(Header);
