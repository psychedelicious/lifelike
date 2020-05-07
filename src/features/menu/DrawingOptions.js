import React from 'react';
import { clamp } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import { Radio, RadioGroup, Text, Flex, Box } from '@chakra-ui/core';

import { NumberSlider } from 'features/menu/NumberSlider';
import StyledCheckbox from 'features/menu/StyledCheckbox';

import {
  toggleIsInvertDraw,
  setBrush,
  toggleShouldDrawCrosshairs,
} from 'store/reducers/drawing';
import { IoMdBrush } from 'react-icons/io';
import {
  clearCells,
  randomizeCells,
  toggleShouldShowGridlines,
} from 'store/reducers/life';
import ConfirmDialogue from './ConfirmDialogue';
import { FaTrash, FaRandom } from 'react-icons/fa';

const DrawingOptions = () => {
  const shouldShowGridlines = useSelector(
    (state) => state.life.shouldShowGridlines
  );

  const {
    brushFill,
    validBrushFills,
    brushRadius,
    brushShape,
    validBrushShapes,
    isInvertDraw,
    shouldDrawCrosshairs,
    maxBrushRadius,
    minBrushRadius,
  } = useSelector((state) => state.drawing);

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

  const handleToggleShouldShowGridlines = React.useCallback(() => {
    dispatch(toggleShouldShowGridlines());
  }, [dispatch]);

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

      <Flex direction="row" height="2rem" alignItems="center">
        <Box as={IoMdBrush} mr="0.25rem" />
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
          flex="1 1 auto"
          display="flex"
          justifyContent="space-between"
          direction="row"
        >
          {validBrushShapes.map((opt) => (
            <Radio key={opt} value={opt}>
              <Text fontSize="sm">{opt}</Text>
            </Radio>
          ))}
        </RadioGroup>
      </Flex>
      <Flex direction="row" height="2rem" alignItems="center">
        <Box as={IoMdBrush} mr="0.25rem" />

        <Text fontSize="sm" width="3rem">
          fill
        </Text>
        <Text fontSize="sm" mr="0.5rem">
          ~>
        </Text>

        <RadioGroup
          onChange={handleBrushFillChange}
          value={brushFill}
          isInline
          flex="1 1 auto"
          display="flex"
          justifyContent="space-between"
          direction="row"
        >
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
        icon="radius"
        tooltip="brush radius"
      />

      <Flex direction="column">
        <StyledCheckbox
          label="eraser mode"
          isChecked={isInvertDraw}
          onChange={handleToggleIsInvertDraw}
          mr="0.5rem"
        />
        <StyledCheckbox
          label="show drawing crosshairs"
          isChecked={shouldDrawCrosshairs}
          onChange={handleToggleShouldDrawCrosshairs}
          mr="0.5rem"
        />
        <StyledCheckbox
          isChecked={shouldShowGridlines}
          onChange={handleToggleShouldShowGridlines}
          label="show gridlines"
        />
      </Flex>
    </Flex>
  );
};

export default React.memo(DrawingOptions);
