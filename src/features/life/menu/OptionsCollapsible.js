import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Collapse } from '@chakra-ui/core';

import WidthHeightPxSliders from './WidthHeightPxSliders';
import DrawOptions from './DrawOptions';

export const OptionsCollapsible = React.memo(
  ({
    isMobile,
    isOpen,
    canvasRef,
    canvasGridOverlayRef,
    canvasDrawOverlayRef,
    ...rest
  }) => {
    return (
      <>
        <Collapse isOpen={isOpen}>
          <Flex {...rest} direction="column" fontSize="sm">
            <WidthHeightPxSliders
              isMobile={isMobile}
              canvasRef={canvasRef}
              canvasGridOverlayRef={canvasGridOverlayRef}
              canvasDrawOverlayRef={canvasDrawOverlayRef}
            />

            <DrawOptions />
          </Flex>
        </Collapse>
      </>
    );
  }
);

OptionsCollapsible.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  canvasRef: PropTypes.object.isRequired,
  canvasGridOverlayRef: PropTypes.object.isRequired,
  canvasDrawOverlayRef: PropTypes.object.isRequired,
};
