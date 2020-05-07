import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex } from '@chakra-ui/core';

import {
  toggleShouldWrap,
  toggleShouldPauseOnStableState,
  toggleShouldDrawAllCells,
} from 'store/reducers/life';

import { toggleShouldShowGridlines } from 'store/reducers/drawing';

import { toggleShouldShowHUD } from 'store/reducers/hud';

import StyledCheckbox from 'features/menu/StyledCheckbox';
import { toggleShouldShowTooltips } from 'store/reducers/menu';

const OptionsSection = ({ ...rest }) => {
  const { shouldWrap, shouldDrawAllCells } = useSelector((state) => state.life);

  const shouldShowGridlines = useSelector(
    (state) => state.drawing.shouldShowGridlines
  );

  const { shouldShowHUD } = useSelector((state) => state.hud);

  const { shouldShowTooltips } = useSelector((state) => state.menu);

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

  const handleToggleShouldShowTooltips = React.useCallback(() => {
    dispatch(toggleShouldShowTooltips());
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

      <StyledCheckbox
        isChecked={shouldShowTooltips}
        onChange={handleToggleShouldShowTooltips}
        label="show tooltips"
      />
    </Flex>
  );
};

export default React.memo(OptionsSection);
