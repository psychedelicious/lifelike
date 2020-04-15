import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Stat, StatLabel, StatNumber } from '@chakra-ui/core';

export const Monitor = ({ generations, population, density, ...rest }) => {
  return (
    <Flex {...rest} justify="left">
      <Stat>
        <StatLabel>generation</StatLabel>
        <StatNumber>{generations}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>population</StatLabel>
        <StatNumber>{population}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>density %</StatLabel>
        <StatNumber>{density}</StatNumber>
      </Stat>
    </Flex>
  );
};

Monitor.propTypes = {
  generations: PropTypes.number,
  population: PropTypes.number,
  density: PropTypes.number,
};
