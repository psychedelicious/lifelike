import React from 'react';
import PropTypes from 'prop-types';

import { Text, Radio, Tooltip, Box, Flex } from '@chakra-ui/core';

import { Neighborhoods } from '../neighborhoods';

export const NeighborhoodRadio = React.memo(
  ({ neighborhood, onChange, gridArea }) => {
    const tooltips = {
      MOORE: 'neighborhood == 8 directions [8]',
      VONNEUMANN: 'neighborhood == 4 directions [4]',
      HEXAGONAL: 'neighborhood == 6 directions [6]',
    };
    return (
      <Flex gridArea={gridArea} direction="row" justify="space-between">
        {Neighborhoods.types.map((n) => (
          <Tooltip
            key={n}
            zIndex={2}
            hasArrow
            label={tooltips[n]}
            placement="top"
          >
            <Box>
              <Radio
                value={n}
                size="sm"
                isChecked={neighborhood.id === n}
                onClick={() => onChange(n)}
              >
                <Text fontSize="sm">{Neighborhoods[n].name.toLowerCase()}</Text>
              </Radio>
            </Box>
          </Tooltip>
        ))}
      </Flex>
    );
  }
);

NeighborhoodRadio.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  gridArea: PropTypes.string.isRequired,
};
