import React from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { useCanvasSizeChange } from '../canvas/useCanvasSizeChange';
import { useCellDimensions } from '../canvas/useCellDimensions';

import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaTrash,
  FaRandom,
  FaExpand,
  FaPaintBrush,
  FaAngleDoubleUp,
  FaAngleDoubleDown,
} from 'react-icons/fa';
import { Flex, IconButton } from '@chakra-ui/core';

import {
  toggleIsRunning,
  getNextCells,
  clearCells,
  randomizeCells,
  toggleInEditMode,
} from '../../../redux/actions';

const MainControls = React.memo(
  ({
    isMobile,
    isOptionsOpen,
    setIsOptionsOpen,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
    ...rest
  }) => {
    const {
      isRunning,
      inEditMode,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      px,
    } = useSelector(
      (state) => ({
        isRunning: state.life.isRunning,
        inEditMode: state.life.inEditMode,
        minWidth: state.life.minWidth,
        maxWidth: state.life.maxWidth,
        minHeight: state.life.minHeight,
        maxHeight: state.life.maxHeight,
        px: state.life.px,
      }),
      shallowEqual
    );

    const changeCanvasSize = useCanvasSizeChange();
    const getCellDimensions = useCellDimensions();

    const dispatch = useDispatch();

    const handleFitCellsToCanvas = React.useCallback(() => {
      const { newWidth, newHeight } = getCellDimensions({
        isMobile,
        canvasBaseLayerRef,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        px,
      });
      changeCanvasSize({
        canvasBaseLayerRef,
        canvasGridLayerRef,
        canvasDrawLayerRef,
        height: newHeight,
        width: newWidth,
        px,
      });
    }, [
      isMobile,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      px,
      canvasBaseLayerRef,
      canvasGridLayerRef,
      canvasDrawLayerRef,
      changeCanvasSize,
      getCellDimensions,
    ]);

    const handleToggleIsRunning = React.useCallback(
      () => dispatch(toggleIsRunning()),
      [dispatch]
    );

    const handleGetNextCells = React.useCallback(
      () => dispatch(getNextCells()),
      [dispatch]
    );

    const handleClearCells = React.useCallback(() => dispatch(clearCells()), [
      dispatch,
    ]);

    const handleRandomizeCells = React.useCallback(
      () => dispatch(randomizeCells()),
      [dispatch]
    );

    const handleToggleInEditMode = React.useCallback(
      () => dispatch(toggleInEditMode()),
      [dispatch]
    );

    const handleToggleOptions = React.useCallback(
      () => setIsOptionsOpen((isOptionsOpen) => !isOptionsOpen),
      [setIsOptionsOpen]
    );

    return (
      <Flex {...rest}>
        <IconButton
          touchAction="manipulation"
          icon={isRunning ? FaPause : FaPlay}
          variant="solid"
          aria-label="start/stop"
          onClick={handleToggleIsRunning}
        />
        <IconButton
          touchAction="manipulation"
          isDisabled={isRunning}
          icon={FaStepForward}
          variant="solid"
          aria-label="tick"
          onClick={handleGetNextCells}
        />
        <IconButton
          touchAction="manipulation"
          icon={FaTrash}
          variant="solid"
          aria-label="clear all cells"
          onClick={handleClearCells}
        />
        <IconButton
          touchAction="manipulation"
          icon={FaRandom}
          variant="solid"
          aria-label="randomize all cells"
          onClick={handleRandomizeCells}
        />
        <IconButton
          touchAction="manipulation"
          isDisabled={isRunning}
          icon={FaExpand}
          variant="solid"
          aria-label="expand/shrink grid to fit"
          onClick={handleFitCellsToCanvas}
        />
        <IconButton
          touchAction="manipulation"
          isDisabled={isRunning}
          icon={FaPaintBrush}
          variant={inEditMode ? 'outline' : 'ghost'}
          aria-label="expand/shrink grid to fit"
          onClick={handleToggleInEditMode}
        />
        <IconButton
          touchAction="manipulation"
          icon={isOptionsOpen ? FaAngleDoubleUp : FaAngleDoubleDown}
          variant={isOptionsOpen ? 'outline' : 'ghost'}
          aria-label="show/hide options"
          onClick={handleToggleOptions}
        />
      </Flex>
    );
  }
);

MainControls.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isOptionsOpen: PropTypes.bool.isRequired,
  setIsOptionsOpen: PropTypes.func.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default MainControls;
