import React from 'react';
import PropTypes from 'prop-types';

import { Text, Radio, Tooltip, Box, Flex } from '@chakra-ui/core';

import { Neighborhoods } from '../neighborhoods';

export const NeighborhoodRadio = React.memo(
  ({ neighborhood, onChange, ...rest }) => {
    const tooltips = {
      MOORE: 'neighborhood == 8 directions [8]',
      VONNEUMANN: 'neighborhood == 4 directions [4]',
      HEXAGONAL: 'neighborhood == 6 directions [6]',
    };
    return (
      <Flex {...rest} fontSize="sm">
        n ~>
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
                <Text>{Neighborhoods[n].name}</Text>
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
};
