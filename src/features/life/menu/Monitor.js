import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Stat, StatLabel, StatNumber } from '@chakra-ui/core';

export const Monitor = ({ generations, currentFps, gridArea }) => {
  return (
    <Flex gridArea={gridArea} justify="left">
      <Stat>
        <StatLabel>generation</StatLabel>
        <StatNumber>{generations ?? '...'}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>fps</StatLabel>
        <StatNumber>{currentFps ?? '...'}</StatNumber>
      </Stat>
    </Flex>
  );
};

Monitor.propTypes = {
  generations: PropTypes.number,
  currentFps: PropTypes.number,
  gridArea: PropTypes.string.isRequired,
};
