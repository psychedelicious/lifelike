import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import { IconButton, Flex, Heading, useColorMode } from '@chakra-ui/core';

import InfoModal from 'features/menu/InfoModal';
import SaveAsImageButton from 'features/menu/SaveAsImageButton';
import SaveAsVideoButton from 'features/menu/SaveAsVideoButton';
import ChangeThemeButton from './ChangeThemeButton';
import { setThemeColor } from 'store/reducers/theme';
import { nextDrawAllCells } from 'store/reducers/life';

const Header = ({
  isMobile,
  canvasBaseLayerRef,
  canvasGridLayerRef,
  ...rest
}) => {
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const { headerColor } = useSelector((state) => state.theme);

  const handleToggleColorMode = () => {
    toggleColorMode();
    dispatch(nextDrawAllCells());
  };

  return (
    <Flex {...rest} justify="space-between">
      <Heading fontSize="1.25rem" fontWeight={300} color={headerColor}>
        lifelike
      </Heading>

      <Flex justify="right">
        <SaveAsVideoButton
          canvasBaseLayerRef={canvasBaseLayerRef}
          variantColor="blue"
        />

        <SaveAsImageButton
          canvasBaseLayerRef={canvasBaseLayerRef}
          canvasGridLayerRef={canvasGridLayerRef}
          variantColor="blue"
        />

        <InfoModal variantColor="blue" />

        <ChangeThemeButton />

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
