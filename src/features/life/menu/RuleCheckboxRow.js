import React from 'react';
import PropTypes from 'prop-types';

import {
  ControlBox,
  VisuallyHidden,
  Flex,
  Text,
  useColorMode,
} from '@chakra-ui/core';

export const RuleCheckboxRow = React.memo(
  ({ ruleArray, ruleType, onChange, ...rest }) => {
    const { colorMode } = useColorMode();

    // const numberString = ruleArray
    //   .reduce((acc, val, idx) => (val ? acc.concat(idx) : acc), [])
    //   .join(`|`);

    // const tooltipLabel =
    //   ruleType === 'born'
    //     ? `neighbors == [${numberString || 'null'}] ~> born`
    //     : `neighbors == [${numberString || 'null'}] ~> survive`;

    return (
      <Flex align="center" justify="space-between">
        <Text fontSize="sm">{ruleType === 'born' ? 'b ~>' : 's ~>'}</Text>

        {ruleArray.map((val, index) => {
          const key = `${ruleType}${index}`;
          const isChecked = ruleArray[index];
          return (
            <label key={key}>
              <VisuallyHidden
                as="input"
                type="checkbox"
                checked={isChecked}
                onChange={() => {
                  onChange(ruleType, index);
                }}
              />

              <ControlBox
                borderWidth="1px"
                size="1.5rem"
                rounded="sm"
                color={
                  colorMode === 'light' ? 'blackAlpha.600' : 'whiteAlpha.600'
                }
                borderColor="transparent"
                _child={{ opacity: 100 }}
                _checked={
                  colorMode === 'light'
                    ? {
                        bg: 'blue.500',
                        color: 'gray.50',
                        borderColor: 'blue.500',
                      }
                    : {
                        bg: 'blue.200',
                        color: 'gray.800',
                        borderColor: 'blue.200',
                      }
                }
                _focus={{ boxShadow: 'outline' }}
              >
                <Text fontSize="sm">{index}</Text>
              </ControlBox>
            </label>
          );
        })}
      </Flex>
    );
  }
);

RuleCheckboxRow.propTypes = {
  ruleArray: PropTypes.array.isRequired,
  ruleType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
