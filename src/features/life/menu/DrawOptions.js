import React from 'react';
import { clamp } from 'lodash';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Radio, RadioGroup, Text } from '@chakra-ui/core';

import { FaPaintBrush } from 'react-icons/fa';
import { NumberSlider } from './NumberSlider';
import { StyledCheckbox } from './StyledCheckbox';
import { toggleIsInvertDraw, setBrush } from '../../../redux/actions';

const brushFillOptions = ['solid', 'outline', 'random', 'spray'];
const brushShapeOptions = ['square', 'circle', 'pencil'];

const DrawOptions = React.memo(() => {
  const {
    brushFill,
    brushRadius,
    brushShape,
    inEditMode,
    isInvertDraw,
    isRunning,
    maxBrushRadius,
    minBrushRadius,
  } = useSelector(
    (state) => ({
      brushFill: state.life.brushFill,
      brushRadius: state.life.brushRadius,
      brushShape: state.life.brushShape,
      inEditMode: state.life.inEditMode,
      isInvertDraw: state.life.isInvertDraw,
      isRunning: state.life.isRunning,
      maxBrushRadius: state.life.maxBrushRadius,
      minBrushRadius: state.life.minBrushRadius,
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
          brushFill,
          brushRadius,
          brushShape: e.target.value,
        })
      );
    },
    [brushFill, brushRadius, dispatch]
  );

  const handleBrushRadiusChange = React.useCallback(
    (val) => {
      const newRadius = clamp(val, minBrushRadius, maxBrushRadius);
      dispatch(
        setBrush({
          brushFill,
          brushRadius: newRadius,
          brushShape,
        })
      );
    },
    [brushFill, brushShape, dispatch, maxBrushRadius, minBrushRadius]
  );

  const handleBrushFillChange = React.useCallback(
    (e) => {
      dispatch(
        setBrush({
          brushFill: e.target.value,
          brushRadius,
          brushShape,
        })
      );
    },
    [brushRadius, brushShape, dispatch]
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
