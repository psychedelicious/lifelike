import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex } from '@chakra-ui/core';

import {
  toggleShouldShowGridlines,
  toggleShouldWrap,
  toggleShouldPauseOnStableState,
  toggleShouldDrawAllCells,
} from 'store/reducers/life';

import { toggleShouldShowHUD } from 'store/reducers/hud';

import StyledCheckbox from 'features/menu/StyledCheckbox';

const OptionsSection = ({ ...rest }) => {
  const { shouldShowGridlines, shouldWrap, shouldDrawAllCells } = useSelector(
    (state) => state.life
  );

  const { shouldShowHUD } = useSelector((state) => state.hud);


  const { shouldPauseOnStableState } = useSelector((state) => state.theme);

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

  const handleToggleShouldDrawAllCells = React.useCallback(() => {
    dispatch(toggleShouldDrawAllCells());
  }, [dispatch]);

  return (
    <Flex {...rest} direction="row" flexWrap="wrap">
      <StyledCheckbox
        isChecked={shouldShowGridlines}
        onChange={handleToggleShouldShowGridlines}
        label="gridlines"
      />

      <StyledCheckbox
        isChecked={shouldWrap}
        onChange={handleToggleWrap}
        label="edge wrapping"
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

      <StyledCheckbox
        isChecked={!shouldDrawAllCells}
        onChange={handleToggleShouldDrawAllCells}
        label="draw only changed cells"
      />
    </Flex>
  );
};

export default React.memo(OptionsSection);
