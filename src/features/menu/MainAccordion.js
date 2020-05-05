import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  Box,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/core';

import RuleControls from 'features/menu/RuleControls';
import NeighborhoodControls from 'features/menu/NeighborhoodControls';
import GridAndCellSizeControls from 'features/menu/GridAndCellSizeControls';
import DrawingOptions from 'features/menu/DrawingOptions';
import OptionsSection from 'features/menu/OptionsSection';

const Item = React.memo(({ header, children, defaultIsOpen }) => {
  const {
    buttonBackgroundColor,
    buttonBackgroundColorHover,
    headerColor,
  } = useSelector((state) => state.theme);

  return (
    <AccordionItem
      borderColor={buttonBackgroundColor}
      defaultIsOpen={defaultIsOpen}
    >
      <AccordionHeader
        py="0.25rem"
        px="0.5rem"
        backgroundColor={buttonBackgroundColor}
        _hover={{
          backgroundColor: buttonBackgroundColorHover,
        }}
      >
        <Box
          flex="1"
          textAlign="left"
          fontSize="sm"
          fontWeight="500"
          color={headerColor}
        >
          {header}
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel p="0.5rem 0.5rem 0.5rem 0.5rem">
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
});

const MainAccordion = ({
  isMobile,
  canvasBaseLayerRef,
  canvasGridLayerRef,
  canvasDrawLayerRef,
}) => {
  return (
    <Accordion mt="0.5rem" allowMultiple>
      <Item header="rule & neighborhood" defaultIsOpen={!isMobile}>
        <RuleControls />
        <NeighborhoodControls mt="0.5rem" direction="row" />
      </Item>

      <Item header="draw & fill" defaultIsOpen={!isMobile}>
        <DrawingOptions />
      </Item>

      <Item header="grid & cell size" defaultIsOpen={!isMobile}>
        <GridAndCellSizeControls
          isMobile={isMobile}
          canvasBaseLayerRef={canvasBaseLayerRef}
          canvasGridLayerRef={canvasGridLayerRef}
          canvasDrawLayerRef={canvasDrawLayerRef}
        />
      </Item>

      <Item header="options" defaultIsOpen={false}>
        <OptionsSection />
      </Item>
    </Accordion>
  );
};

MainAccordion.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  colorMode: PropTypes.string.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default React.memo(MainAccordion);
