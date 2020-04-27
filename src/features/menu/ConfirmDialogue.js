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
import StyledTooltip from './StyledTooltip';

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
      <StyledTooltip label={aria} placement="top" hasArrow>
        <IconButton
          {...rest}
          icon={icon}
          variant="solid"
          aria-label={aria}
          onClick={() => setIsOpen(true)}
        />
      </StyledTooltip>
      <AlertDialog
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={confirmedRef}
        size="xs"
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="sm" fontWeight="bold">
            {header}
          </AlertDialogHeader>
          <AlertDialogBody fontSize="sm">{message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button size="sm" onClick={onClose} ml={3}>
              cancel
            </Button>
            <Button
              size="sm"
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
