import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Text } from '@chakra-ui/core';

export const StyledCheckbox = React.memo(({ label, isChecked, onChange }) => {
  return (
    <Checkbox isChecked={isChecked} onChange={onChange} mr="0.5rem">
      <Text fontSize="sm">{label}</Text>
    </Checkbox>
  );
});

StyledCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
