import React from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';

import ConfirmDialogue from 'features/menu/ConfirmDialogue';

import { useCanvas } from 'features/canvas/useCanvas';

import { getCellDimensions } from 'features/life/getCellDimensions';

import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaTrash,
  FaRandom,
  FaExpand,
  FaBackward,
  FaForward,
  FaPencilAlt,
} from 'react-icons/fa';
import { Flex, IconButton } from '@chakra-ui/core';

import {
  toggleIsRunning,
  getNextCells,
  clearCells,
  randomizeCells,
  incrementSpeed,
  decrementSpeed,
} from 'store/reducers/life';

import { toggleInEditMode } from 'store/reducers/drawing';
import {
  useGlobalKeyDown,
  useWithModifiers,
} from 'hooks/useWindowEvent';

const MainControls = React.memo(
  ({
    isMobile,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
    ...rest
  }) => {
    const dispatch = useDispatch();

    const isRunning = useSelector((state) => state.life.isRunning);
    const minWidth = useSelector((state) => state.life.minWidth);
    const maxWidth = useSelector((state) => state.life.maxWidth);
    const minHeight = useSelector((state) => state.life.minHeight);
    const maxHeight = useSelector((state) => state.life.maxHeight);
    const px = useSelector((state) => state.life.px);
    const speed = useSelector((state) => state.life.speed);

    const inEditMode = useSelector((state) => state.drawing.inEditMode);

    const withModifiers = useWithModifiers();

    useGlobalKeyDown((e) => {
      switch (e.key) {
        case 'c':
          !withModifiers(e) && setIsClearCellsConfirmOpen(true);
          break;
        case 'r':
          !withModifiers(e) && setIsRandomizeCellsConfirmOpen(true);
          break;
        default:
          break;
      }
    });

    const [
      isClearCellsConfirmOpen,
      setIsClearCellsConfirmOpen,
    ] = React.useState(false);

    const [
      isRandomizeCellsConfirmOpen,
      setIsRandomizeCellsConfirmOpen,
    ] = React.useState(false);

    const { changeCanvasSize } = useCanvas();

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

    const style = { touchAction: 'manipulation' };

    return (
      <Flex {...rest}>
        <IconButton
          style={style}
          icon={isRunning ? FaPause : FaPlay}
          variant="solid"
          aria-label="start/stop"
          onClick={handleToggleIsRunning}
        />

        <IconButton
          style={style}
          isDisabled={isRunning}
          icon={FaStepForward}
          variant="solid"
          aria-label="tick"
          onClick={handleGetNextCells}
        />

        <IconButton
          style={style}
          isDisabled={speed === 0}
          icon={FaBackward}
          variant="solid"
          aria-label="decrease speed"
          onPointerDown={() => dispatch(decrementSpeed())}
        />

        <IconButton
          style={style}
          isDisabled={speed === 100}
          icon={FaForward}
          variant="solid"
          aria-label="increase speed"
          onPointerDown={() => dispatch(incrementSpeed())}
        />

        <ConfirmDialogue
          style={style}
          icon={FaTrash}
          header="clear grid"
          aria="clear grid"
          message="are you sure you want to clear the grid?"
          confirmedCallback={handleClearCells}
          isOpen={isClearCellsConfirmOpen}
          setIsOpen={setIsClearCellsConfirmOpen}
        />

        <ConfirmDialogue
          style={style}
          icon={FaRandom}
          header="randomize grid"
          aria="randomize grid"
          message="are you sure you want to randomize the grid?"
          confirmedCallback={handleRandomizeCells}
          isOpen={isRandomizeCellsConfirmOpen}
          setIsOpen={setIsRandomizeCellsConfirmOpen}
        />

        {!isMobile && (
          <IconButton
            style={style}
            isDisabled={isRunning}
            icon={FaExpand}
            variant="solid"
            aria-label="expand/shrink grid to fit"
            onClick={handleFitCellsToCanvas}
          />
        )}

        <IconButton
          style={style}
          icon={FaPencilAlt}
          variant={inEditMode ? 'outline' : 'ghost'}
          aria-label="toggle drawing mode"
          onClick={handleToggleInEditMode}
        />
      </Flex>
    );
  }
);

MainControls.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default MainControls;
