import React from 'react';
import PropTypes from 'prop-types';

import { AiOutlineColumnHeight, AiOutlineColumnWidth } from 'react-icons/ai';
import { GiResize } from 'react-icons/gi';

import { Flex, Collapse, Text, RadioGroup, Radio } from '@chakra-ui/core';

import { NumberSlider } from './NumberSlider';
import { MobilePxSlider } from './MobilePxSlider';
import { FaPaintBrush } from 'react-icons/fa';
import { StyledCheckbox } from './StyledCheckbox';

export const OptionsCollapsibles = React.memo(
  ({
    isMobile,
    width,
    onWidthChange,
    height,
    onHeightChange,
    px,
    onPxChange,
    brushShape,
    onBrushShapeChange,
    brushRadius,
    onBrushRadiusChange,
    brushFill,
    onBrushFillChange,
    isInvertDraw,
    onToggleIsInvertDraw,
    minMaxLimits,
    isRunning,
    isOpen,
    inEditMode,
    ...rest
  }) => {
    return (
      <Collapse isOpen={isOpen}>
        <Flex {...rest} direction="column" fontSize="sm">
          {!isMobile ? (
            <>
              <NumberSlider
                value={width}
                min={minMaxLimits.width.min}
                max={minMaxLimits.width.max}
                onChange={onWidthChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnWidth}
              />

              <NumberSlider
                value={height}
                min={minMaxLimits.height.min}
                max={minMaxLimits.height.max}
                onChange={onHeightChange}
                isDisabled={isRunning}
                icon={AiOutlineColumnHeight}
              />

              <NumberSlider
                value={px}
                min={minMaxLimits.px.min}
                max={minMaxLimits.px.max}
                onChange={onPxChange}
                isDisabled={isRunning}
                icon={GiResize}
              />
            </>
          ) : (
            <>
              <MobilePxSlider
                px={px}
                min={minMaxLimits.px.min}
                max={minMaxLimits.px.max}
                onChange={onPxChange}
                isDisabled={isRunning}
              />
            </>
          )}

          <StyledCheckbox
            label="erase"
            isDisabled={isRunning || !inEditMode}
            isChecked={isInvertDraw}
            onChange={onToggleIsInvertDraw}
          />

          <RadioGroup
            onChange={(e) => onBrushShapeChange(e.target.value)}
            value={brushShape}
            isInline
          >
            <Radio isDisabled={isRunning || !inEditMode} value="circle">
              <Text fontSize="sm">circle</Text>
            </Radio>
            <Radio isDisabled={isRunning || !inEditMode} value="square">
              <Text fontSize="sm">square</Text>
            </Radio>
            <Radio isDisabled={isRunning || !inEditMode} value="pencil">
              <Text fontSize="sm">pencil</Text>
            </Radio>
          </RadioGroup>

          <RadioGroup
            onChange={(e) => onBrushFillChange(e.target.value)}
            value={brushFill}
            isInline
          >
            <Radio
              isDisabled={isRunning || !inEditMode || brushShape === 'pencil'}
              value="solid"
            >
              <Text fontSize="sm">solid</Text>
            </Radio>
            <Radio
              isDisabled={isRunning || !inEditMode || brushShape === 'pencil'}
              value="outline"
            >
              <Text fontSize="sm">outline</Text>
            </Radio>
            <Radio
              isDisabled={isRunning || !inEditMode || brushShape === 'pencil'}
              value="random"
            >
              <Text fontSize="sm">rand</Text>
            </Radio>
            <Radio
              isDisabled={isRunning || !inEditMode || brushShape === 'pencil'}
              value="spray"
            >
              <Text fontSize="sm">spray</Text>
            </Radio>
          </RadioGroup>

          <NumberSlider
            value={brushRadius}
            min={1}
            max={25}
            onChange={onBrushRadiusChange}
            isDisabled={isRunning || !inEditMode || brushShape === 'pencil'}
            icon={FaPaintBrush}
          />
        </Flex>
      </Collapse>
    );
  }
);

OptionsCollapsibles.propTypes = {
  width: PropTypes.number.isRequired,
  onWidthChange: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  px: PropTypes.number.isRequired,
  onPxChange: PropTypes.func.isRequired,
  minMaxLimits: PropTypes.object.isRequired,
  isRunning: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
