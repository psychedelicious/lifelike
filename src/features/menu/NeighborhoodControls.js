import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { Text, Radio, Box, Flex } from '@chakra-ui/core';

import { setNeighborhood } from 'store/reducers/life';
import { Neighborhoods } from 'features/life/neighborhoods';
import StyledTooltip from './StyledTooltip';

const NeighborhoodControls = ({ ...rest }) => {
  const neighborhood = useSelector(
    (state) => state.life.neighborhood,
    shallowEqual
  );
  const dispatch = useDispatch();

  const handleNeighborhoodChange = React.useCallback(
    (neighborhood) => {
      dispatch(setNeighborhood({ neighborhood }));
    },
    [dispatch]
  );

  const tooltipMap = {
    MOORE: 'neighbors = all 8 directions',
    VONNEUMANN: 'neighbors =  4 (cardinal) directions',
    HEXAGONAL: 'neighbors = 6 directions',
  };

  return (
    <Flex {...rest} fontSize="sm">
      <Text>n ~></Text>
      <Flex px="0.5rem" justify="space-between" flex="1 1 auto">
        {Neighborhoods.types.map((n) => (
          <StyledTooltip key={`neighborhood${n}`} label={tooltipMap[n]}>
            <Box>
              <Radio
                value={n}
                size="sm"
                isChecked={neighborhood.id === n}
                onChange={() => handleNeighborhoodChange(n)}
              >
                <Text>{Neighborhoods[n].name}</Text>
              </Radio>
            </Box>
          </StyledTooltip>
        ))}
      </Flex>
    </Flex>
  );
};

export default React.memo(NeighborhoodControls);
