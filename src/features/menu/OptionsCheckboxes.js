import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex } from '@chakra-ui/core';

import {
  toggleShowGridlines,
  toggleWrap,
  toggleShowHUD,
  toggleStopOnStable,
} from 'store/reducers/life';

import { StyledCheckbox } from 'features/menu/StyledCheckbox';

const OptionsCheckboxes = React.memo(({ ...rest }) => {
  const showGridlines = useSelector((state) => state.life.showGridlines);
  const wrap = useSelector((state) => state.life.wrap);
  const showHUD = useSelector((state) => state.life.showHUD);
  const stopOnStable = useSelector((state) => state.life.stopOnStable);

  const dispatch = useDispatch();

  const handleToggleShowGridlines = React.useCallback(() => {
    dispatch(toggleShowGridlines());
  }, [dispatch]);

  const handleToggleWrap = React.useCallback(() => {
    dispatch(toggleWrap());
  }, [dispatch]);

  const handleToggleShowHUD = React.useCallback(() => {
    dispatch(toggleShowHUD());
  }, [dispatch]);

  const handleToggleStopOnStable = React.useCallback(() => {
    dispatch(toggleStopOnStable());
  }, [dispatch]);

  return (
    <Flex {...rest}>
      <StyledCheckbox
        isChecked={showGridlines}
        onChange={handleToggleShowGridlines}
        label="gridlines"
      />

      <StyledCheckbox
        isChecked={wrap}
        onChange={handleToggleWrap}
        label="wrap"
      />

      <StyledCheckbox
        isChecked={stopOnStable}
        onChange={handleToggleStopOnStable}
        label="autopause"
      />

      <StyledCheckbox
        isChecked={showHUD}
        onChange={handleToggleShowHUD}
        label="HUD"
      />
    </Flex>
  );
});

export default OptionsCheckboxes;
