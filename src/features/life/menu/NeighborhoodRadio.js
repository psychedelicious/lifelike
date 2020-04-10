import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Radio, RadioGroup, Tooltip } from '@chakra-ui/core';

import { Neighborhoods } from '../neighborhoods';

export const NeighborhoodRadio = React.memo(({ neighborhood, onChange }) => {
  const tooltipLabels = {
    MOORE: 'neighborhood == 8 directions [8]',
    VONNEUMANN: 'neighborhood == 4 directions [4]',
    HEXAGONAL: 'neighborhood == 6 directions [6]',
  };
  return (
    <Flex justify="left" direction="column">
      <RadioGroup
        isInline
        onChange={(e) => onChange(e.target.value)}
        value={neighborhood.id}
        display="flex"
        justifyContent="space-between"
      >
        {Neighborhoods.types.map((n) => (
          <Radio key={n} value={n} size="sm">
            <Tooltip hasArrow label={tooltipLabels[n]} placement="top">
              {Neighborhoods[n].name.toLowerCase()}
            </Tooltip>
          </Radio>
        ))}
      </RadioGroup>
    </Flex>
  );
});

NeighborhoodRadio.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
