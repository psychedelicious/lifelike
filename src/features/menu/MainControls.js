import React from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';

import ConfirmDialogue from 'features/menu/ConfirmDialogue';

import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaTrash,
  FaRandom,
  FaBackward,
  FaForward,
  FaPencilAlt,
  FaArrowsAlt,
} from 'react-icons/fa';
import { Flex, IconButton } from '@chakra-ui/core';

import {
  toggleIsRunning,
  getNextCells,
  clearCells,
  randomizeCells,
} from 'store/reducers/life';

import { incrementSpeed, decrementSpeed } from 'store/reducers/performance';

import {
  toggleIsInDrawMode,
  toggleIsInTranslateMode,
} from 'store/reducers/drawing';
import { useGlobalKeyDown, useWithModifiers } from 'hooks/useWindowEvent';
import StyledTooltip from './StyledTooltip';

const MainControls = ({
  isMobile,
  canvasBaseLayerRef,
  canvasGridLayerRef,
  canvasDrawLayerRef,
  ...rest
}) => {
  const dispatch = useDispatch();

  const isRunning = useSelector((state) => state.life.isRunning);

  const speed = useSelector((state) => state.performance.speed);

  const isInDrawMode = useSelector((state) => state.drawing.isInDrawMode);
  const isInTranslateMode = useSelector(
    (state) => state.drawing.isInTranslateMode
  );

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

  const [isClearCellsConfirmOpen, setIsClearCellsConfirmOpen] = React.useState(
    false
  );

  const [
    isRandomizeCellsConfirmOpen,
    setIsRandomizeCellsConfirmOpen,
  ] = React.useState(false);

  const handleToggleIsRunning = React.useCallback(
    () => dispatch(toggleIsRunning()),
    [dispatch]
  );

  const handleGetNextCells = React.useCallback(() => dispatch(getNextCells()), [
    dispatch,
  ]);

  const handleClearCells = React.useCallback(() => dispatch(clearCells()), [
    dispatch,
  ]);

  const handleRandomizeCells = React.useCallback(
    () => dispatch(randomizeCells()),
    [dispatch]
  );

  const handleToggleIsInDrawMode = React.useCallback(
    () => dispatch(toggleIsInDrawMode()),
    [dispatch]
  );

  const handleToggleIsInTranslateMode = React.useCallback(
    () => dispatch(toggleIsInTranslateMode()),
    [dispatch]
  );

  return (
    <Flex {...rest}>
      <StyledTooltip label="start/stop" placement="top" hasArrow>
        <IconButton
          style={{ touchAction: 'manipulation' }}
          icon={isRunning ? FaPause : FaPlay}
          variant="solid"
          aria-label="start/stop"
          onClick={handleToggleIsRunning}
          variantColor="blue"
        />
      </StyledTooltip>

      <StyledTooltip label="tick once" placement="top" hasArrow>
        <IconButton
          style={{ touchAction: 'manipulation' }}
          isDisabled={isRunning}
          icon={FaStepForward}
          variant="solid"
          aria-label="tick"
          onClick={handleGetNextCells}
          variantColor="blue"
        />
      </StyledTooltip>

      <StyledTooltip label="slower" placement="top" hasArrow>
        <IconButton
          style={{ touchAction: 'manipulation' }}
          isDisabled={speed === 0}
          icon={FaBackward}
          variant="solid"
          aria-label="slower"
          onPointerDown={() => dispatch(decrementSpeed())}
          variantColor="blue"
        />
      </StyledTooltip>

      <StyledTooltip label="faster" placement="top" hasArrow>
        <IconButton
          style={{ touchAction: 'manipulation' }}
          isDisabled={speed === 100}
          icon={FaForward}
          variant="solid"
          aria-label="faster"
          onPointerDown={() => dispatch(incrementSpeed())}
          variantColor="blue"
        />
      </StyledTooltip>

      <ConfirmDialogue
        style={{ touchAction: 'manipulation' }}
        icon={FaTrash}
        header="clear grid"
        aria="clear grid"
        message="are you sure you want to clear the grid?"
        confirmedCallback={handleClearCells}
        isOpen={isClearCellsConfirmOpen}
        setIsOpen={setIsClearCellsConfirmOpen}
        variantColor="blue"
      />

      <ConfirmDialogue
        style={{ touchAction: 'manipulation' }}
        icon={FaRandom}
        header="randomize grid"
        aria="randomize grid"
        message="are you sure you want to randomize the grid?"
        confirmedCallback={handleRandomizeCells}
        isOpen={isRandomizeCellsConfirmOpen}
        setIsOpen={setIsRandomizeCellsConfirmOpen}
        variantColor="blue"
      />

      <StyledTooltip label="translate mode" placement="top" hasArrow>
        <IconButton
          style={{ touchAction: 'manipulation' }}
          icon={FaArrowsAlt}
          variant={isInTranslateMode ? 'outline' : 'link'}
          aria-label="toggle translate mode"
          onClick={handleToggleIsInTranslateMode}
          variantColor="blue"
        />
      </StyledTooltip>

      <StyledTooltip label="draw mode" placement="top" hasArrow>
        <IconButton
          style={{ touchAction: 'manipulation' }}
          icon={FaPencilAlt}
          variant={isInDrawMode ? 'outline' : 'link'}
          aria-label="toggle drawing mode"
          onClick={handleToggleIsInDrawMode}
          variantColor="blue"
        />
      </StyledTooltip>
    </Flex>
  );
};

MainControls.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default React.memo(MainControls);
