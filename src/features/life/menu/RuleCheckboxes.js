import React from 'react';
import PropTypes from 'prop-types';

import { Button, Flex, Tag } from '@chakra-ui/core';

export const RuleCheckboxes = React.memo(
  ({ ruleArray, ruleType, onChange }) => {
    return (
      <Flex my="1" align="center" justify="space-between">
        <Tag
          size="sm"
          fontWeight="600"
          w="1rem"
          textAlign="right"
          variant="outline"
        >
          {ruleType === 'born' ? 'b' : 's'}
        </Tag>

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
    );
  }
);

RuleCheckboxes.propTypes = {
  ruleArray: PropTypes.array.isRequired,
  ruleType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RuleCheckboxes;
