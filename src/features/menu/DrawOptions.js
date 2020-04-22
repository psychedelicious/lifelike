import React from 'react';
import { clamp } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import { FaPaintBrush } from 'react-icons/fa';
import { Radio, RadioGroup, Text, Flex } from '@chakra-ui/core';

import { NumberSlider } from 'features/menu/NumberSlider';
import { StyledCheckbox } from 'features/menu/StyledCheckbox';

import {
  toggleIsInvertDraw,
  setBrush,
  toggleShouldDrawCrosshairs,
} from 'store/reducers/drawing';

const DrawOptions = React.memo(() => {
  const brushFill = useSelector((state) => state.drawing.brushFill);
  const validBrushFills = useSelector((state) => state.drawing.validBrushFills);
  const brushRadius = useSelector((state) => state.drawing.brushRadius);
  const brushShape = useSelector((state) => state.drawing.brushShape);
  const validBrushShapes = useSelector(
    (state) => state.drawing.validBrushShapes
  );
  const isInvertDraw = useSelector((state) => state.drawing.isInvertDraw);
  const shouldDrawCrosshairs = useSelector(
    (state) => state.drawing.shouldDrawCrosshairs
  );
  const maxBrushRadius = useSelector((state) => state.drawing.maxBrushRadius);
  const minBrushRadius = useSelector((state) => state.drawing.minBrushRadius);

  const dispatch = useDispatch();

  const handleToggleIsInvertDraw = React.useCallback(() => {
    dispatch(toggleIsInvertDraw());
  }, [dispatch]);

  const handleToggleShouldDrawCrosshairs = React.useCallback(() => {
    dispatch(toggleShouldDrawCrosshairs());
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

  React.useEffect(() => {
    dispatch(setBrush({ brushShape, brushRadius, brushFill }));
  }, [setBrush]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Flex direction="row">
        <StyledCheckbox
          label="erase"
          isChecked={isInvertDraw}
          onChange={handleToggleIsInvertDraw}
          mr="0.5rem"
        />
        <StyledCheckbox
          label="crosshairs"
          isChecked={shouldDrawCrosshairs}
          onChange={handleToggleShouldDrawCrosshairs}
          mr="0.5rem"
        />
      </Flex>

      <RadioGroup onChange={handleBrushShapeChange} value={brushShape} isInline>
        {validBrushShapes.map((opt) => (
          <Radio key={opt} value={opt}>
            <Text fontSize="sm">{opt}</Text>
          </Radio>
        ))}
      </RadioGroup>

      <RadioGroup onChange={handleBrushFillChange} value={brushFill} isInline>
        {validBrushFills.map((opt) => (
          <Radio key={opt} isDisabled={brushShape === 'pencil'} value={opt}>
            <Text fontSize="sm">{opt}</Text>
          </Radio>
        ))}
      </RadioGroup>

      <NumberSlider
        value={brushRadius}
        min={minBrushRadius}
        max={maxBrushRadius}
        onChange={handleBrushRadiusChange}
        isDisabled={brushShape === 'pencil'}
        icon={FaPaintBrush}
      />
    </>
  );
});

export default DrawOptions;
