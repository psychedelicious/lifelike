import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Text } from '@chakra-ui/core';

const StyledCheckbox = ({ label, ...rest }) => {
  return (
    <Checkbox {...rest} mr="1rem">
      <Text fontSize="sm">{label}</Text>
    </Checkbox>
  );
};

StyledCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
};

export default React.memo(StyledCheckbox);
