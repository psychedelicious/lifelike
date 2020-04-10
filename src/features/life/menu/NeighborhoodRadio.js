import React from 'react';
import PropTypes from 'prop-types';

import { Text, Radio, Tooltip, Box, Stack } from '@chakra-ui/core';

import { Neighborhoods } from '../neighborhoods';

// The tooltip arrows are not where I want them to be when using a <RadioGroup />,
// using a custom radio component allows me to put them where I want them.
const CustomRadio = React.forwardRef((props, ref) => {
  const { isChecked, value, text, tooltip, ...rest } = props;
  return (
    <Tooltip hasArrow label={tooltip} placement="top">
      <Box>
        <Radio
          ref={ref}
          value={value}
          size="sm"
          isChecked={isChecked}
          {...rest}
        >
          <Text fontSize="sm">{text}</Text>
        </Radio>
      </Box>
    </Tooltip>
  );
});

export const NeighborhoodRadio = React.memo(({ neighborhood, onChange }) => {
  const tooltipLabels = {
    MOORE: 'neighborhood == 8 directions [8]',
    VONNEUMANN: 'neighborhood == 4 directions [4]',
    HEXAGONAL: 'neighborhood == 6 directions [6]',
  };
  return (
    <Stack direction="row">
      {Neighborhoods.types.map((n) => (
        <CustomRadio
          key={n}
          value={n}
          text={Neighborhoods[n].name.toLowerCase()}
          tooltip={tooltipLabels[n]}
          isChecked={neighborhood.id === n}
          onClick={() => onChange(n)}
        />
      ))}
    </Stack>
  );
});

NeighborhoodRadio.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
