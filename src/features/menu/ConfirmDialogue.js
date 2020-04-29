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
} from '@chakra-ui/core';
import { useSelector } from 'react-redux';

const ConfirmDialogue = ({
  icon,
  aria,
  header,
  message,
  confirmedCallback,
  isOpen,
  setIsOpen,
  ...rest
}) => {
  const { colorMode } = useSelector((state) => state.theme);
  const { lightBackground, darkBackground } = useSelector(
    (state) => state.theme.theme.colors
  );
  const onClose = () => {
    setIsOpen(false);
  };

  const actionConfirmed = () => {
    confirmedCallback();
    onClose();
  };

  const confirmedRef = React.useRef();

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
        leastDestructiveRef={confirmedRef}
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
            {message}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button size="sm" fontWeight="300" onClick={onClose} ml={3}>
              cancel
            </Button>
            <Button
              size="sm"
              fontWeight="300"
              variantColor="blue"
              ref={confirmedRef}
              onClick={actionConfirmed}
              ml={3}
            >
              yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

ConfirmDialogue.propTypes = {
  icon: PropTypes.func.isRequired,
  aria: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmedCallback: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default React.memo(ConfirmDialogue);
