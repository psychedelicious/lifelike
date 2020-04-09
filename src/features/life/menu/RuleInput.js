import React from 'react';
import PropTypes from 'prop-types';

import { Flex } from '@chakra-ui/core';

import { RuleCheckboxes } from './RuleCheckboxes';

export const RuleInput = React.memo(
  ({ born, onBornChange, survive, onSurviveChange }) => {
    return (
      <Flex>
        <RuleCheckboxes
          ruleArray={born}
          ruleType="born"
          onChange={onBornChange}
        />
        <RuleCheckboxes
          ruleArray={survive}
          ruleType="survive"
          onChange={onSurviveChange}
        />
      </Flex>
    );
  }
);

RuleInput.propTypes = {
  born: PropTypes.array.isRequired,
  onBornChange: PropTypes.func.isRequired,
  survive: PropTypes.array.isRequired,
  onSurviveChange: PropTypes.func.isRequired,
};
