import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  List,
  ListItem,
  Flex,
  Text,
  IconButton,
  Button,
} from '@chakra-ui/core';

import {
  loadBookmark,
  deleteBookmark,
  renameBookmark,
  saveBookmark,
} from 'store/reducers/life';

import { FaTrash } from 'react-icons/fa';
import EditDialogue from './EditDialogue';

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

  return (
    <>
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
          onClick={() => dispatch(saveBookmark({ name: getFormattedDate() }))}
        >
          bookmark current state
        </Button>
      </Flex>
      {bookmarks.length > 0 ? (
        <List>
          {bookmarks.map((bookmark, index) => {
            const { name } = bookmark;
            const handleChangeBookmarkName = (newName) =>
              dispatch(renameBookmark({ index, newName }));

            return (
              <ListItem key={index} my="0.5rem">
                <Flex
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                >
                  <IconButton
                    size="sm"
                    icon={FaTrash}
                    onClick={() => dispatch(deleteBookmark({ index }))}
                  />
                  <Text fontSize="sm">{name}</Text>
                  <Flex direction="row">
                    <EditDialogue
                      icon="edit"
                      aria="rename bookmark"
                      header="rename bookmark"
                      initialValue={name}
                      confirmButtonText="save"
                      confirmedCallback={handleChangeBookmarkName}
                      size="sm"
                    />
                    <IconButton
                      ml="0.5rem"
                      size="sm"
                      icon="external-link"
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
    </>
  );
};

export default React.memo(Bookmarks);
