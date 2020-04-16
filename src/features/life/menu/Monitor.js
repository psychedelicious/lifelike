import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Stat, StatLabel, StatNumber } from '@chakra-ui/core';

export const Monitor = ({ generation, population, density, ...rest }) => {
  return (
    <Flex {...rest} justify="left">
      <Stat>
        <StatLabel>generation</StatLabel>
        <StatNumber>{generation}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>population</StatLabel>
        <StatNumber>{population}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>density%</StatLabel>
        <StatNumber>{density}</StatNumber>
      </Stat>
    </Flex>
  );
};

Monitor.propTypes = {
  generation: PropTypes.number.isRequired,
  population: PropTypes.number.isRequired,
  density: PropTypes.number.isRequired,
};
