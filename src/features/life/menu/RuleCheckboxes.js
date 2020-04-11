import React from 'react';
import PropTypes from 'prop-types';

import { Button, Flex, Text, Tooltip } from '@chakra-ui/core';

const RuleCheckboxRow = React.memo(({ ruleArray, ruleType, onChange }) => {
  const numberString = ruleArray
    .reduce((acc, val, idx) => (val ? acc.concat(idx) : acc), [])
    .join(`|`);

  const tooltipLabel =
    ruleType === 'born'
      ? `neighbors == ${numberString} ~> born`
      : `neighbors == ${numberString} ~> survive`;

  return (
    <Tooltip label={tooltipLabel} placement="top" zIndex={1}>
      <Flex my="1" align="center" justify="space-between">
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
});

RuleCheckboxRow.propTypes = {
  ruleArray: PropTypes.array.isRequired,
  ruleType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const RuleCheckboxes = React.memo(
  ({ born, survive, onRuleChange, gridArea }) => {
    return (
      <Flex gridArea={gridArea} direction="column">
        <RuleCheckboxRow
          ruleArray={born}
          ruleType="born"
          onChange={onRuleChange}
        />

        <RuleCheckboxRow
          ruleArray={survive}
          ruleType="survive"
          onChange={onRuleChange}
        />
      </Flex>
    );
  }
);

RuleCheckboxes.propTypes = {
  born: PropTypes.array.isRequired,
  survive: PropTypes.array.isRequired,
  onRuleChange: PropTypes.func.isRequired,
  gridArea: PropTypes.string.isRequired,
};
