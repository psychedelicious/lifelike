import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { clamp } from 'lodash';

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
  Text,
  Flex,
} from '@chakra-ui/core';

import {
  toggleHUDDisplayItems,
  setHUDOpacity,
  toggleShouldShowHUD,
} from 'store/reducers/hud';

import StyledCheckbox from './StyledCheckbox';
import { NumberSlider } from 'features/menu/NumberSlider';
import { MdOpacity } from 'react-icons/md';
import {
  toggleShouldPauseOnStableState,
  toggleShouldDrawAllCells,
} from 'store/reducers/life';
import { toggleShouldShowTooltips } from 'store/reducers/menu';
import { FaWrench } from 'react-icons/fa';
import StyledTooltip from 'features/menu/StyledTooltip';

const OptionsDrawer = ({ ...rest }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { hudDisplay, validHUDDisplayItems, opacity } = useSelector(
    (state) => state.hud,
    shallowEqual
  );

  const handleHUDOpacityChange = React.useCallback(
    (val) => {
      const newOpacity = clamp(val, 0.5, 1);
      dispatch(setHUDOpacity({ opacity: newOpacity }));
    },
    [dispatch]
  );

  const btnRef = React.useRef();

  const { colorMode, headerColor } = useSelector((state) => state.theme);

  const { lightBackground, darkBackground } = useSelector(
    (state) => state.theme.theme.colors
  );

  const bgColor = colorMode === 'light' ? lightBackground : darkBackground;

  const { shouldDrawAllCells, shouldPauseOnStableState } = useSelector(
    (state) => state.life
  );

  const { shouldShowHUD } = useSelector((state) => state.hud);

  const { shouldShowTooltips } = useSelector((state) => state.menu);

  const handleToggleShouldShowHUD = React.useCallback(() => {
    dispatch(toggleShouldShowHUD());
  }, [dispatch]);

  const handleToggleShouldShowTooltips = React.useCallback(() => {
    dispatch(toggleShouldShowTooltips());
  }, [dispatch]);

  const handleToggleShouldPauseOnStableState = React.useCallback(() => {
    dispatch(toggleShouldPauseOnStableState());
  }, [dispatch]);

  const handleToggleShouldDrawAllCells = React.useCallback(() => {
    dispatch(toggleShouldDrawAllCells());
  }, [dispatch]);

  return (
    <>
      <StyledTooltip label="options">
        <IconButton
          {...rest}
          style={{ touchAction: 'manipulation' }}
          ref={btnRef}
          icon={FaWrench}
          variant="solid"
          aria-label="options"
          onClick={onOpen}
          variantColor="blue"
        />
      </StyledTooltip>
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
            options
          </DrawerHeader>

          <DrawerBody>
            <Text fontSize="sm" fontWeight="500">
              general
            </Text>
            <Flex direction="column" ml="1rem" my="0.5rem">
              <StyledCheckbox
                isChecked={shouldPauseOnStableState}
                onChange={handleToggleShouldPauseOnStableState}
                label="pause on stable state"
              />

              <StyledCheckbox
                isChecked={!shouldDrawAllCells}
                onChange={handleToggleShouldDrawAllCells}
                label="draw only changed cells"
              />

              <StyledCheckbox
                isChecked={shouldShowTooltips}
                onChange={handleToggleShouldShowTooltips}
                label="show tooltips"
              />

              <StyledCheckbox
                isChecked={shouldShowHUD}
                onChange={handleToggleShouldShowHUD}
                label="show HUD"
              />
            </Flex>
            <Text fontSize="sm" fontWeight="500" mt="1.5rem">
              HUD
            </Text>
            <Flex direction="column" ml="1rem" my="0.5rem">
              <List>
                {validHUDDisplayItems.map((displayItem) => (
                  <ListItem key={displayItem}>
                    <StyledCheckbox
                      isChecked={hudDisplay.includes(displayItem)}
                      label={displayItem}
                      onChange={() =>
                        dispatch(
                          toggleHUDDisplayItems({ itemToToggle: displayItem })
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <NumberSlider
                value={opacity}
                min={0.5}
                max={1}
                onChange={handleHUDOpacityChange}
                icon={MdOpacity}
                step={0.01}
                tooltip="HUD opacity"
                showTextInput={false}
                width="calc(100% - 1rem)"
              />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default React.memo(OptionsDrawer);
