import React from 'react';
import { clamp } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import { Radio, RadioGroup, Text } from '@chakra-ui/core';

import { FaPaintBrush } from 'react-icons/fa';
import { NumberSlider } from './NumberSlider';
import { StyledCheckbox } from './StyledCheckbox';
import { toggleIsInvertDraw, setBrush } from '../../../redux/reducers/drawing';

const brushFillOptions = ['solid', 'outline', 'random', 'spray'];
const brushShapeOptions = ['square', 'circle', 'pencil'];

const DrawOptions = React.memo(() => {
  const brushFill = useSelector((state) => state.drawing.brushFill);
  const brushRadius = useSelector((state) => state.drawing.brushRadius);
  const brushShape = useSelector((state) => state.drawing.brushShape);
  const isInvertDraw = useSelector((state) => state.drawing.isInvertDraw);
  const maxBrushRadius = useSelector((state) => state.drawing.maxBrushRadius);
  const minBrushRadius = useSelector((state) => state.drawing.minBrushRadius);

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

  React.useEffect(() => {
    dispatch(setBrush({ brushShape, brushRadius, brushFill }));
  }, [setBrush]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <StyledCheckbox
        label="erase"
        isChecked={isInvertDraw}
        onChange={handleToggleIsInvertDraw}
      />

      <RadioGroup onChange={handleBrushShapeChange} value={brushShape} isInline>
        {brushShapeOptions.map((opt) => (
          <Radio key={opt} value={opt}>
            <Text fontSize="sm">{opt}</Text>
          </Radio>
        ))}
      </RadioGroup>

      <RadioGroup onChange={handleBrushFillChange} value={brushFill} isInline>
        {brushFillOptions.map((opt) => (
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
