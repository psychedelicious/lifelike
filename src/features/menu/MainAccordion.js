import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  Box,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/core';

import RuleCheckboxes from 'features/menu/RuleCheckboxes';
import NeighborhoodRadio from 'features/menu/NeighborhoodRadio';
import WidthHeightPxSliders from 'features/menu/WidthHeightPxSliders';
import DrawOptions from 'features/menu/DrawOptions';
import OptionsCheckboxes from 'features/menu/OptionsCheckboxes';

const MainAccordion = React.memo(
  ({
    isMobile,
    colorMode,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
  }) => {
    return (
      <Accordion
        mt="0.5rem"
        defaultIndex={isMobile ? [] : [0, 1, 2, 3]}
        allowMultiple
      >
        <AccordionItem
          borderColor={
            colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100'
          }
        >
          <AccordionHeader
            py="0.25rem"
            px="0.5rem"
            _hover={{
              backgroundColor:
                colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100',
            }}
          >
            <Box flex="1" textAlign="left" fontSize="sm" fontWeight="300">
              rule & neighborhood
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel p="0.5rem 0.5rem 0.5rem 0.5rem">
            <RuleCheckboxes />
            <NeighborhoodRadio mt="0.5rem" direction="row" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem
          borderColor={
            colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100'
          }
        >
          <AccordionHeader
            py="0.25rem"
            px="0.5rem"
            _hover={{
              backgroundColor:
                colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100',
            }}
          >
            <Box flex="1" textAlign="left" fontSize="sm" fontWeight="300">
              grid
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel p="0.5rem 0.5rem 0.5rem 0.5rem">
            <WidthHeightPxSliders
              isMobile={isMobile}
              canvasBaseLayerRef={canvasBaseLayerRef}
              canvasGridLayerRef={canvasGridLayerRef}
              canvasDrawLayerRef={canvasDrawLayerRef}
            />{' '}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem
          borderColor={
            colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100'
          }
        >
          <AccordionHeader
            py="0.25rem"
            px="0.5rem"
            _hover={{
              backgroundColor:
                colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100',
            }}
          >
            <Box flex="1" textAlign="left" fontSize="sm" fontWeight="300">
              drawing
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel p="0.5rem 0.5rem 0.5rem 0.5rem">
            <DrawOptions />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem
          borderColor={
            colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100'
          }
        >
          <AccordionHeader
            py="0.25rem"
            px="0.5rem"
            _hover={{
              backgroundColor:
                colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.100',
            }}
          >
            <Box flex="1" textAlign="left" fontSize="sm" fontWeight="300">
              options
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel p="0.5rem 0.5rem 0.5rem 0.5rem">
            <OptionsCheckboxes />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }
);

MainAccordion.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  colorMode: PropTypes.string.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default MainAccordion;
