import React from 'react';
import PropTypes from 'prop-types';

import { Radio, RadioGroup } from '@chakra-ui/core';

import { Neighborhoods } from '../life/neighborhoods';

export const NeighborhoodRadio = React.memo(({ neighborhood, onChange }) => {
  return (
    <RadioGroup isInline onChange={onChange} value={neighborhood.id}>
      {Neighborhoods.types.map((n) => (
        <Radio key={n} value={n} size="sm">
          {Neighborhoods[n].name.toLowerCase()}
        </Radio>
      ))}
    </RadioGroup>
  );
});

NeighborhoodRadio.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
