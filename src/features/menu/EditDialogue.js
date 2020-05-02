import React from 'react';
import PropTypes from 'prop-types';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/core';
import { useSelector } from 'react-redux';

const EditDialogue = ({
  icon,
  aria,
  header,
  message,
  initialValue,
  confirmButtonText,
  confirmedCallback,
  ...rest
}) => {
  const { colorMode } = useSelector((state) => state.theme);
  const { lightBackground, darkBackground } = useSelector(
    (state) => state.theme.theme.colors
  );

  const [isOpen, setIsOpen] = React.useState(false);
  const editedTextRef = React.useRef();

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const actionConfirmed = React.useCallback(
    (val) => {
      confirmedCallback(val);
      onClose();
    },
    [confirmedCallback, onClose]
  );

  return (
    <>
      <IconButton
        {...rest}
        icon={icon}
        variant="solid"
        aria-label={aria}
        onClick={() => setIsOpen(true)}
      />
      <AlertDialog
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={editedTextRef}
        size="xs"
      >
        <AlertDialogOverlay />
        <AlertDialogContent
          bg={colorMode === 'light' ? lightBackground : darkBackground}
        >
          <AlertDialogHeader fontSize="sm" fontWeight="400">
            {header}
          </AlertDialogHeader>
          <AlertDialogBody fontSize="sm" fontWeight="300">
            {message && <Text>{message}</Text>}
            <Input
              size="sm"
              placeholder={initialValue}
              ref={editedTextRef}
              onKeyDown={(e) => e.stopPropagation()}
            ></Input>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              size="sm"
              fontWeight="300"
              onClick={onClose}
              ml={3}
              tabIndex={1}
            >
              cancel
            </Button>
            <Button
              tabIndex={0}
              size="sm"
              fontWeight="300"
              variantColor="blue"
              onClick={() => actionConfirmed(editedTextRef.current.value)}
              ml={3}
            >
              {confirmButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

EditDialogue.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  aria: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  message: PropTypes.string,
  confirmedCallback: PropTypes.func.isRequired,
};

export default React.memo(EditDialogue);
