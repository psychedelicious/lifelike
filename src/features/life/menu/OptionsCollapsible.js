import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Collapse } from '@chakra-ui/core';

import WidthHeightPxSliders from './WidthHeightPxSliders';
import DrawOptions from './DrawOptions';

const OptionsCollapsible = React.memo(
  ({
    isMobile,
    isOpen,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
    ...rest
  }) => {
    return (
      <>
        <Collapse isOpen={isOpen}>
          <Flex {...rest} direction="column" fontSize="sm">
            <WidthHeightPxSliders
              isMobile={isMobile}
              canvasBaseLayerRef={canvasBaseLayerRef}
              canvasGridLayerRef={canvasGridLayerRef}
              canvasDrawLayerRef={canvasDrawLayerRef}
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
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default OptionsCollapsible;
