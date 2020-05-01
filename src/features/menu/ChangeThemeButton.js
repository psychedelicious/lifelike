import React from 'react';

import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  Box,
  Flex,
} from '@chakra-ui/core';
import { MdPalette } from 'react-icons/md';
import { lifelikeTheme } from 'theme';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeColor } from 'store/reducers/theme';
import { nextDrawAllCells } from 'store/reducers/life';
import StyledCheckbox from './StyledCheckbox';

const ColorButton = ({ currentTheme, handleChangeTheme, color }) => {
  const isSelected = currentTheme === color;

  const borderColor = isSelected
    ? lifelikeTheme.colors[color][200]
    : 'transparent';

  const boxShadow = isSelected
    ? `0 0 0 0.15rem ${lifelikeTheme.colors[color][700]}`
    : null;

  return (
    <Box
      m="0.25rem"
      size="1.5rem"
      bg={lifelikeTheme.colors[color][500]}
      borderWidth="0.1rem"
      boxShadow={boxShadow}
      rounded="sm"
      zIndex={7}
      borderColor={borderColor}
      onClick={() => handleChangeTheme(color)}
      _focus={{ boxShadow: 'outline' }}
      _hover={{ borderColor: 'gray.300' }}
      _disabled={{ opacity: '40%' }}
    />
  );
};

const ChangeThemeButton = (props) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const { theme, colorMode, themeColor, shouldSwapCellColors } = useSelector(
    (state) => state.theme
  );

  const handleChangeTheme = React.useCallback(
    (color) => {
      dispatch(setThemeColor({ themeColor: color }));
      dispatch(nextDrawAllCells());
    },
    [dispatch]
  );

  const handleToggleShouldSwapCellColors = React.useCallback(() => {
    dispatch(setThemeColor({ shouldSwapCellColors: !shouldSwapCellColors }));
    dispatch(nextDrawAllCells());
  }, [dispatch, shouldSwapCellColors]);

  return (
    <>
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={close}
        closeOnBlur={true}
        placement="bottom-end"
      >
        <PopoverTrigger>
          <IconButton
            icon={MdPalette}
            fontSize="1.5rem"
            p={0}
            h="unset"
            minW="unset"
            variant="link"
            mr="0.5rem"
            aria-label="change theme"
            onClick={open}
            variantColor="blue"
          />
        </PopoverTrigger>
        <PopoverContent
          zIndex={6}
          width="10rem"
          bg={
            colorMode === 'light'
              ? theme.colors.lightBackground
              : theme.colors.darkBackground
          }
        >
          <PopoverArrow />
          <PopoverBody
            m={0}
            p="0.5rem"
            boxShadow={`0 0 1rem -0.2rem ${theme.colors.blue[500]}`}
          >
            <Flex direction="row" wrap="wrap" w="100%" justify="space-between">
              {lifelikeTheme.colors.validColors.map((color) => (
                <ColorButton
                  key={color}
                  colorMode={colorMode}
                  currentTheme={themeColor}
                  handleChangeTheme={handleChangeTheme}
                  color={color}
                />
              ))}
            </Flex>
            <StyledCheckbox
              m="0.25rem"
              isChecked={shouldSwapCellColors}
              onChange={handleToggleShouldSwapCellColors}
              label="invert grid"
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default React.memo(ChangeThemeButton);
