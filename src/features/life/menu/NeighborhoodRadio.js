import React from 'react';
import PropTypes from 'prop-types';

import { Text, Radio, Box, Flex } from '@chakra-ui/core';

import { Neighborhoods } from '../neighborhoods';

export const NeighborhoodRadio = React.memo(
  ({ neighborhood, onChange, ...rest }) => {
    return (
      <Flex {...rest} fontSize="sm">
        <Text>n ~></Text>
        <Flex px="0.5rem" justify="space-between" flex="1 1 auto">
          {Neighborhoods.types.map((n, i) => (
            <Box key={`neighborhood${i}`}>
              <Radio
                value={n}
                size="sm"
                isChecked={neighborhood.id === n}
                onChange={() => onChange(n)}
              >
                <Text>{Neighborhoods[n].name}</Text>
              </Radio>
            </Box>
          ))}
        </Flex>
      </Flex>
    );
  }
);

NeighborhoodRadio.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
