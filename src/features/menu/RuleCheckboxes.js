import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
  ControlBox,
  VisuallyHidden,
  Flex,
  Text,
  useColorMode,
} from '@chakra-ui/core';

import { setBorn, setSurvive } from 'store/reducers/life';

const RuleCheckboxRow = React.memo(
  ({ ruleArray, ruleType, onChange, colorMode, ...rest }) => {
    return (
      <Flex {...rest} align="center" justify="space-between">
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
                userSelect="none"
                borderWidth="1px"
                size="1.5rem"
                rounded="sm"
                color={
                  colorMode === 'light' ? 'blackAlpha.600' : 'whiteAlpha.600'
                }
                bg={colorMode === 'light' ? 'blackAlpha.100' : 'whiteAlpha.100'}
                cursor="pointer"
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
  colorMode: PropTypes.string.isRequired,
};

const RuleCheckboxes = React.memo(() => {
  const born = useSelector((state) => state.life.born, shallowEqual);
  const survive = useSelector((state) => state.life.survive, shallowEqual);

  const { colorMode } = useColorMode();

  const dispatch = useDispatch();

  const handleRuleChange = React.useCallback(
    (ruleType, index) => {
      ruleType === 'born'
        ? dispatch(setBorn({ index }))
        : dispatch(setSurvive({ index }));
    },
    [dispatch]
  );

  return (
    <>
      <RuleCheckboxRow
        colorMode={colorMode}
        ruleArray={born}
        ruleType="born"
        onChange={handleRuleChange}
      />
      <RuleCheckboxRow
        mt="0.5rem"
        colorMode={colorMode}
        ruleArray={survive}
        ruleType="survive"
        onChange={handleRuleChange}
      />
    </>
  );
});

export default RuleCheckboxes;
