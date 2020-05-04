import React from 'react';
import { clamp } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import { Radio, RadioGroup, Text, Flex } from '@chakra-ui/core';

import { NumberSlider } from 'features/menu/NumberSlider';
import StyledCheckbox from 'features/menu/StyledCheckbox';

import {
  toggleIsInvertDraw,
  setBrush,
  toggleShouldDrawCrosshairs,
} from 'store/reducers/drawing';
import { IoMdBrush } from 'react-icons/io';
import { clearCells, randomizeCells } from 'store/reducers/life';
import ConfirmDialogue from './ConfirmDialogue';
import { FaTrash, FaRandom } from 'react-icons/fa';

const DrawingOptions = () => {
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

  const handleClearCells = React.useCallback(() => dispatch(clearCells()), [
    dispatch,
  ]);

  const handleRandomizeCells = React.useCallback(
    () => dispatch(randomizeCells()),
    [dispatch]
  );

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
    <Flex direction="column">
      <Flex direction="row" justify="space-between">
        <ConfirmDialogue
          style={{ touchAction: 'manipulation' }}
          icon={FaTrash}
          header="clear grid"
          buttonText="clear grid"
          aria="clear grid"
          message="are you sure you want to clear the grid?"
          confirmedCallback={handleClearCells}
          shortcutKey="c"
          variantColor="blue"
          mr="0.5rem"
          flex="1 1 auto"
        />

        <ConfirmDialogue
          style={{ touchAction: 'manipulation' }}
          flex="1 1 auto"
          icon={FaRandom}
          buttonText="randomize grid"
          header="randomize grid"
          aria="randomize grid"
          message="are you sure you want to randomize the grid?"
          confirmedCallback={handleRandomizeCells}
          shortcutKey="r"
          variantColor="blue"
        />
      </Flex>
      <Flex direction="row" height="1.5rem" align-items="center">
        <Text fontSize="sm" width="3rem">
          shape
        </Text>
        <Text fontSize="sm" mr="0.5rem">
          ~>
        </Text>
        <RadioGroup
          onChange={handleBrushShapeChange}
          value={brushShape}
          isInline
        >
          {validBrushShapes.map((opt) => (
            <Radio key={opt} value={opt}>
              <Text fontSize="sm">{opt}</Text>
            </Radio>
          ))}
        </RadioGroup>
      </Flex>

      <Flex direction="row" height="1.5rem" align-items="center">
        <Text fontSize="sm" width="3rem">
          fill
        </Text>
        <Text fontSize="sm" mr="0.5rem">
          ~>
        </Text>

        <RadioGroup onChange={handleBrushFillChange} value={brushFill} isInline>
          {validBrushFills.map((opt) => (
            <Radio key={opt} isDisabled={brushShape === 'pencil'} value={opt}>
              <Text fontSize="sm">{opt}</Text>
            </Radio>
          ))}
        </RadioGroup>
      </Flex>

      <NumberSlider
        flex="1 0 auto"
        value={brushRadius}
        min={minBrushRadius}
        max={maxBrushRadius}
        onChange={handleBrushRadiusChange}
        isDisabled={brushShape === 'pencil'}
        icon={IoMdBrush}
      />

      <Flex direction="row" height="1.5rem" align-items="center">
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
    </Flex>
  );
};

export default React.memo(DrawingOptions);
