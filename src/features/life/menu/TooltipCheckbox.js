import React from 'react';
import PropTypes from 'prop-types';

import { Box, Checkbox, Text, Tooltip } from '@chakra-ui/core';

export const TooltipCheckbox = React.memo(
  ({ label, tooltip, isChecked, onChange }) => {
    return (
      <Tooltip label={tooltip} placement="top" hasArrow zIndex={2}>
        <Box>
          <Checkbox isChecked={isChecked} onChange={onChange} mr="0.5rem">
            <Text fontSize="sm">{label}</Text>
          </Checkbox>
        </Box>
      </Tooltip>
    );
  }
);

TooltipCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
