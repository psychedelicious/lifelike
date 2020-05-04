import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
} from '@chakra-ui/core';

import { useWithModifiers, useGlobalKeyDown } from 'hooks/useWindowEvent';

const ConfirmDialogue = ({
  icon,
  buttonText,
  aria,
  header,
  message,
  confirmedCallback,
  shortcutKey,
  ...rest
}) => {
  const { colorMode } = useSelector((state) => state.theme);
  const { lightBackground, darkBackground } = useSelector(
    (state) => state.theme.theme.colors
  );

  const bgColor = colorMode === 'light' ? lightBackground : darkBackground;

  const { isOpen, onClose, onToggle } = useDisclosure();

  const withModifiers = useWithModifiers();

  useGlobalKeyDown((e) => {
    switch (e.key) {
      case shortcutKey:
        !withModifiers(e) && onToggle();
        break;
      default:
        break;
    }
  });

  const actionConfirmed = () => {
    confirmedCallback();
    onClose();
  };

  const confirmedRef = React.useRef();

  return (
    <>
      {buttonText ? (
        <Button
          {...rest}
          style={{ userSelect: 'none' }}
          leftIcon={icon}
          variant="solid"
          size="sm"
          my="0.25rem"
          aria-label={aria}
          fontWeight="400"
          onClick={onToggle}
        >
          {buttonText}
        </Button>
      ) : (
        <IconButton
          {...rest}
          icon={icon}
          variant="solid"
          aria-label={aria}
          onClick={onToggle}
        />
      )}
      <AlertDialog
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={confirmedRef}
        size="xs"
      >
        <AlertDialogOverlay />
        <AlertDialogContent bg={bgColor}>
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
  buttonText: PropTypes.string,
  header: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmedCallback: PropTypes.func.isRequired,
  shortcutKey: PropTypes.string,
};

export default React.memo(ConfirmDialogue);
