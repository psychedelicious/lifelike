import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex } from '@chakra-ui/core';

import {
  toggleShouldShowGridlines,
  toggleShouldWrap,
  toggleShouldShowHUD,
  toggleShouldPauseOnStableState,
} from 'store/reducers/life';

import { StyledCheckbox } from 'features/menu/StyledCheckbox';

const OptionsCheckboxes = React.memo(({ ...rest }) => {
  const shouldShowGridlines = useSelector((state) => state.life.shouldShowGridlines);
  const shouldWrap = useSelector((state) => state.life.shouldWrap);
  const shouldShowHUD = useSelector((state) => state.life.shouldShowHUD);
  const shouldPauseOnStableState = useSelector(
    (state) => state.life.shouldPauseOnStableState
  );

  const dispatch = useDispatch();

  const handleToggleShouldShowGridlines = React.useCallback(() => {
    dispatch(toggleShouldShowGridlines());
  }, [dispatch]);

  const handleToggleWrap = React.useCallback(() => {
    dispatch(toggleShouldWrap());
  }, [dispatch]);

  const handleToggleShouldShowHUD = React.useCallback(() => {
    dispatch(toggleShouldShowHUD());
  }, [dispatch]);

  const handleToggleShouldPauseOnStableState = React.useCallback(() => {
    dispatch(toggleShouldPauseOnStableState());
  }, [dispatch]);

  return (
    <Flex
      {...rest}
      justifyContent="space-between"
      direction="row"
      flexWrap="wrap"
    >
      <StyledCheckbox
        isChecked={shouldShowGridlines}
        onChange={handleToggleShouldShowGridlines}
        label="gridlines"
      />

      <StyledCheckbox
        isChecked={shouldWrap}
        onChange={handleToggleWrap}
        label="wrap"
      />

      <StyledCheckbox
        isChecked={shouldShowHUD}
        onChange={handleToggleShouldShowHUD}
        label="HUD"
      />

      <StyledCheckbox
        isChecked={shouldPauseOnStableState}
        onChange={handleToggleShouldPauseOnStableState}
        label="pause on stable state"
      />
    </Flex>
  );
});

export default OptionsCheckboxes;
