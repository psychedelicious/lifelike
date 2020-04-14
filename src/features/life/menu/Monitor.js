import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Stat, StatLabel, StatNumber } from '@chakra-ui/core';

export const Monitor = ({ generations, fps, population, ...rest }) => {
  return (
    <Flex {...rest} justify="left">
      <Stat>
        <StatLabel>generation</StatLabel>
        <StatNumber>{generations}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>fps</StatLabel>
        <StatNumber>{fps}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>population</StatLabel>
        <StatNumber>{population}</StatNumber>
      </Stat>
    </Flex>
  );
};

Monitor.propTypes = {
  generations: PropTypes.number,
  fps: PropTypes.number,
  population: PropTypes.number,
};
