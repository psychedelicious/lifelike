import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { Flex, Stat, StatLabel, StatNumber } from '@chakra-ui/core';

const Monitor = ({ ...rest }) => {
  const { generation, population, density } = useSelector(
    (state) => ({
      generation: state.life.generation,
      population: state.life.population,
      density: state.life.density,
    }),
    shallowEqual
  );

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

export default Monitor;
