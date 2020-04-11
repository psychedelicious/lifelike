import React from 'react';
import PropTypes from 'prop-types';

import { Text, Radio, Tooltip, Box, Stack } from '@chakra-ui/core';

import { Neighborhoods } from '../neighborhoods';

export const NeighborhoodRadio = React.memo(
  ({ neighborhood, onChange, gridArea }) => {
    const tooltips = {
      MOORE: 'neighborhood == 8 directions [8]',
      VONNEUMANN: 'neighborhood == 4 directions [4]',
      HEXAGONAL: 'neighborhood == 6 directions [6]',
    };
    return (
      <Stack gridArea={gridArea} direction="row">
        {Neighborhoods.types.map((n) => (
          <Tooltip hasArrow label={tooltips[n]} placement="top">
            <Box>
              <Radio
                key={n}
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
      </Stack>
    );
  }
);

NeighborhoodRadio.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  gridArea: PropTypes.string.isRequired,
};
