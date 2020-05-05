import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  List,
  ListItem,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/core';

import { toggleHUDDisplay } from 'store/reducers/hud';

import { IoMdSettings } from 'react-icons/io';
import StyledCheckbox from '../menu/StyledCheckbox';

const HUDOptions = ({ ...rest }) => {
  const dispatch = useDispatch();

  const { hudDisplay, validHUDDisplayItems } = useSelector(
    (state) => state.hud
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef();

  const { colorMode, headerColor, deadCellColor } = useSelector(
    (state) => state.theme
  );
  const { lightBackground, darkBackground } = useSelector(
    (state) => state.theme.theme.colors
  );

  const bgColor = colorMode === 'light' ? lightBackground : darkBackground;

  return (
    <>
      <IconButton
        {...rest}
        style={{ touchAction: 'manipulation' }}
        ref={btnRef}
        icon={IoMdSettings}
        variant="link"
        minW="unset"
        aria-label="hud settings"
        onClick={onOpen}
        color={deadCellColor}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton />
          <DrawerHeader fontSize="sm" color={headerColor}>
            hud display options
          </DrawerHeader>

          <DrawerBody>
            <List>
              {validHUDDisplayItems.map((displayItem) => (
                <ListItem key={displayItem}>
                  <StyledCheckbox
                    isChecked={hudDisplay.includes(displayItem)}
                    label={displayItem}
                    onChange={() =>
                      dispatch(toggleHUDDisplay({ itemToToggle: displayItem }))
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default React.memo(HUDOptions);
