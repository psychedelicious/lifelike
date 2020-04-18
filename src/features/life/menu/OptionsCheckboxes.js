import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
  toggleShowGridlines,
  toggleWrap,
  toggleShowStats,
} from '../../../redux/actions';

import { StyledCheckbox } from './StyledCheckbox';

const OptionsCheckboxes = React.memo(() => {
  const { showGridlines, wrap, showStats } = useSelector(
    (state) => ({
      showGridlines: state.life.showGridlines,
      wrap: state.life.wrap,
      showStats: state.life.showStats,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const handleToggleShowGridlines = React.useCallback(() => {
    dispatch(toggleShowGridlines());
  }, [dispatch]);

  const handleToggleWrap = React.useCallback(() => {
    dispatch(toggleWrap());
  }, [dispatch]);

  const handleToggleShowStats = React.useCallback(() => {
    dispatch(toggleShowStats());
  }, [dispatch]);

  return (
    <>
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
        isChecked={showStats}
        onChange={handleToggleShowStats}
        label="stats"
      />
    </>
  );
});

export default OptionsCheckboxes;
