import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex } from '@chakra-ui/core';

import {
  toggleShouldShowGridlines,
  toggleShouldWrap,
  toggleShouldShowHUD,
  toggleShouldPauseOnStableState,
  toggleShouldDrawAllCells,
  nextDrawAllCells,
} from 'store/reducers/life';

import { setThemeColor } from 'store/reducers/theme';

import StyledCheckbox from 'features/menu/StyledCheckbox';

const OptionsCheckboxes = ({ ...rest }) => {
  const shouldShowGridlines = useSelector(
    (state) => state.life.shouldShowGridlines
  );
  const shouldWrap = useSelector((state) => state.life.shouldWrap);
  const shouldShowHUD = useSelector((state) => state.life.shouldShowHUD);
  const shouldPauseOnStableState = useSelector(
    (state) => state.theme.shouldPauseOnStableState
  );
  const shouldSwapCellColors = useSelector(
    (state) => state.theme.shouldSwapCellColors
  );

  const shouldDrawAllCells = useSelector(
    (state) => state.life.shouldDrawAllCells
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

  const handleToggleShouldSwapCellColors = React.useCallback(() => {
    dispatch(setThemeColor({ shouldSwapCellColors: !shouldSwapCellColors }));
    dispatch(nextDrawAllCells());
  }, [dispatch, shouldSwapCellColors]);

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

      <StyledCheckbox
        isChecked={shouldSwapCellColors}
        onChange={handleToggleShouldSwapCellColors}
        label="swap cell colors"
      />

      <StyledCheckbox
        isChecked={!shouldDrawAllCells}
        onChange={handleToggleShouldDrawAllCells}
        label="draw only changed cells"
      />
    </Flex>
  );
};

export default React.memo(OptionsCheckboxes);
