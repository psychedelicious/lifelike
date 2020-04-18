import React from 'react';
import { clamp } from 'lodash';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { Text, RadioGroup, Radio } from '@chakra-ui/core';

import { NumberSlider } from './NumberSlider';
import { FaPaintBrush } from 'react-icons/fa';
import { StyledCheckbox } from './StyledCheckbox';
import { toggleIsInvertDraw, setBrush } from '../../../redux/actions';

const brushFillOptions = ['solid', 'outline', 'random', 'spray'];
const brushShapeOptions = ['square', 'circle', 'pencil'];

const DrawOptions = React.memo(() => {
  const {
    isRunning,
    inEditMode,
    isInvertDraw,
    brushShape,
    brushRadius,
    brushFill,
    minBrushRadius,
    maxBrushRadius,
  } = useSelector(
    (state) => ({
      isRunning: state.life.isRunning,
      inEditMode: state.life.inEditMode,
      isInvertDraw: state.life.isInvertDraw,
      brushShape: state.life.brushShape,
      brushRadius: state.life.brushRadius,
      brushFill: state.life.brushFill,
      minBrushRadius: state.life.minMaxLimits.brushRadius.min,
      maxBrushRadius: state.life.minMaxLimits.brushRadius.max,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const handleToggleIsInvertDraw = React.useCallback(() => {
    dispatch(toggleIsInvertDraw());
  }, [dispatch]);

  const handleBrushShapeChange = React.useCallback(
    (e) => {
      dispatch(
        setBrush({
          brushShape: e.target.value,
          brushRadius,
          brushFill,
        })
      );
    },
    [dispatch, brushFill, brushRadius]
  );

  const handleBrushRadiusChange = React.useCallback(
    (val) => {
      const newRadius = clamp(val, minBrushRadius, maxBrushRadius);
      dispatch(
        setBrush({
          brushShape,
          brushRadius: newRadius,
          brushFill,
        })
      );
    },
    [dispatch, brushShape, brushFill, minBrushRadius, maxBrushRadius]
  );

  const handleBrushFillChange = React.useCallback(
    (e) => {
      dispatch(
        setBrush({
          brushShape,
          brushRadius,
          brushFill: e.target.value,
        })
      );
    },
    [dispatch, brushShape, brushRadius]
  );

  return (
    <>
      <StyledCheckbox
        label="erase"
        isDisabled={isRunning || !inEditMode}
        isChecked={isInvertDraw}
        onChange={handleToggleIsInvertDraw}
      />

      <RadioGroup onChange={handleBrushShapeChange} value={brushShape} isInline>
        {brushShapeOptions.map((opt) => (
          <Radio key={opt} isDisabled={isRunning || !inEditMode} value={opt}>
            <Text fontSize="sm">{opt}</Text>
          </Radio>
        ))}
      </RadioGroup>

      <RadioGroup onChange={handleBrushFillChange} value={brushFill} isInline>
        {brushFillOptions.map((opt) => (
          <Radio
            key={opt}
            isDisabled={isRunning || !inEditMode || brushShape === 'pencil'}
            value={opt}
          >
            <Text fontSize="sm">{opt}</Text>
          </Radio>
        ))}
      </RadioGroup>

      <NumberSlider
        value={brushRadius}
        min={minBrushRadius}
        max={maxBrushRadius}
        onChange={handleBrushRadiusChange}
        isDisabled={isRunning || !inEditMode || brushShape === 'pencil'}
        icon={FaPaintBrush}
      />
    </>
  );
});

export default DrawOptions;
