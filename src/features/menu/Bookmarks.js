import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  List,
  ListItem,
  Flex,
  Text,
  IconButton,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Editable,
  EditablePreview,
  EditableInput,
} from '@chakra-ui/core';

import {
  loadBookmark,
  deleteBookmark,
  renameBookmark,
  saveBookmark,
} from 'store/reducers/life';

import { FaTrash, FaBookmark } from 'react-icons/fa';
import StyledTooltip from './StyledTooltip';

const Bookmarks = () => {
  const dispatch = useDispatch();

  const bookmarks = useSelector(
    (state) => state.life.bookmarks,
    (prev, next) => {
      return (
        prev.length === next.length &&
        prev.every((el, idx) => el.name === next[idx].name)
      );
    }
  );

  const getFormattedDate = React.useCallback(() => {
    const d = new Date();
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef();

  const { colorMode, headerColor, buttonBackgroundColor } = useSelector(
    (state) => state.theme
  );
  const { lightBackground, darkBackground } = useSelector(
    (state) => state.theme.theme.colors
  );

  const bgColor = colorMode === 'light' ? lightBackground : darkBackground;

  const handleChangeBookmarkName = ({ index, name }) =>
    dispatch(renameBookmark({ index, name }));

  return (
    <>
      <StyledTooltip label="open bookmarks">
        <IconButton
          style={{ touchAction: 'manipulation' }}
          ref={btnRef}
          icon={FaBookmark}
          variant="solid"
          aria-label="tick"
          onClick={onOpen}
          variantColor="blue"
        />
      </StyledTooltip>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton />
          <DrawerHeader fontSize="sm" color={headerColor}>
            bookmarks & presets
          </DrawerHeader>

          <DrawerBody>
            <Flex direction="row">
              <Button
                flex="1 1 auto"
                style={{ userSelect: 'none' }}
                leftIcon="star"
                variant="solid"
                size="sm"
                my="0.25rem"
                aria-label="save bookmark"
                fontWeight="400"
                variantColor="blue"
                onClick={() =>
                  dispatch(saveBookmark({ name: getFormattedDate() }))
                }
              >
                bookmark current state
              </Button>
            </Flex>
            {bookmarks.length > 0 ? (
              <List>
                {bookmarks.map((bookmark, index) => {
                  const { name } = bookmark;

                  return (
                    <ListItem key={`${index}_${name}`} my="0.5rem">
                      <Flex
                        direction="row"
                        alignItems="center"
                        justify="space-between"
                      >
                        <Flex
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                          w="100%"
                        >
                          <IconButton
                            size="sm"
                            mr="0.5rem"
                            icon={FaTrash}
                            variantColor="blue"
                            onClick={() => dispatch(deleteBookmark({ index }))}
                          />
                          <Editable
                            flex="1 1 auto"
                            defaultValue={name}
                            placeholder="click to name bookmark"
                            onSubmit={(name) =>
                              handleChangeBookmarkName({ index, name })
                            }
                          >
                            <EditablePreview w="100%" fontSize="sm" />
                            <EditableInput
                              w="100%"
                              fontSize="sm"
                              bg={buttonBackgroundColor}
                              onKeyDown={(e) =>
                                e.key !== 'Enter'
                                  ? e.stopPropagation()
                                  : e.target.blur()
                              }
                            />
                          </Editable>

                          <IconButton
                            ml="0.5rem"
                            size="sm"
                            icon="external-link"
                            variantColor="blue"
                            onClick={() => dispatch(loadBookmark({ index }))}
                          />
                        </Flex>
                      </Flex>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Text fontSize="sm" textAlign="center">
                no bookmarks saved
              </Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default React.memo(Bookmarks);
