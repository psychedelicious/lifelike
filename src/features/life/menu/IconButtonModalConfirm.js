import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/core';

export const IconButtonModalConfirm = React.memo(
  ({ icon, header, body, confirmText, onConfirmCallback }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    return (
      <React.Fragment>
        <IconButton
          icon={icon}
          variant="solid"
          aria-label="clear the grid"
          onClick={onOpen}
        />

        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{header}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{body}</ModalBody>

            <ModalFooter>
              <Button
                ref={initialRef}
                variantColor="red"
                mr={3}
                onClick={() => {
                  onConfirmCallback();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </React.Fragment>
    );
  }
);

IconButtonModalConfirm.propTypes = {
  icon: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  onConfirmCallback: PropTypes.func.isRequired,
};
