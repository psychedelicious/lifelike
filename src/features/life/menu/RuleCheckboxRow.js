import React from 'react';
import PropTypes from 'prop-types';

import { Button, Flex, Text, Tooltip } from '@chakra-ui/core';

export const RuleCheckboxRow = React.memo(
  ({ ruleArray, ruleType, onChange, ...rest }) => {
    const numberString = ruleArray
      .reduce((acc, val, idx) => (val ? acc.concat(idx) : acc), [])
      .join(`|`);

    const tooltipLabel =
      ruleType === 'born'
        ? `neighbors == [${numberString || 'null'}] ~> born`
        : `neighbors == [${numberString || 'null'}] ~> survive`;

    return (
      <Tooltip label={tooltipLabel} {...rest} placement="top" zIndex={2}>
        <Flex align="center" justify="space-between">
          <Text fontWeight="300" fontSize="sm">
            {ruleType === 'born' ? 'b ~>' : 's ~>'}
          </Text>

          {ruleArray.map((val, index) => {
            const key = `${ruleType}${index}`;

            return (
              <Button
                key={key}
                size="xs"
                variant={ruleArray[index] ? 'solid' : 'ghost'}
                onClick={() => {
                  onChange(ruleType, index);
                }}
              >
                {index}
              </Button>
            );
          })}
        </Flex>
      </Tooltip>
    );
  }
);

RuleCheckboxRow.propTypes = {
  ruleArray: PropTypes.array.isRequired,
  ruleType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
