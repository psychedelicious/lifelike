import { useDispatch, useSelector } from 'react-redux';

import {
  toggleIsRunning,
  toggleShowGridlines,
  toggleWrap,
  toggleShowHUD,
  setNeighborhood,
  setSpeed,
  getNextCells,
} from '../../redux/reducers/life';

import { toggleInEditMode } from '../../redux/reducers/drawing';

import { useGlobalKeyDown, useWithModifiers } from '../../hooks/useWindowEvent';
import { useCanvas } from './canvas/useCanvas';

export const withModifiers = (e) => {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
};

export const useKeyboardShortcuts = ({
  canvasBaseLayerRef,
  canvasGridLayerRef,
  canvasDrawLayerRef,
  fitCellsToCanvas,
}) => {
  const isRunning = useSelector((state) => state.life.isRunning);
  const speed = useSelector((state) => state.life.speed);

  const dispatch = useDispatch();
  const { clearCanvas, saveCanvasAsImage } = useCanvas();
  const withModifiers = useWithModifiers();

  useGlobalKeyDown((e) => {
    switch (e.key) {
      case ' ':
        if (!withModifiers(e)) {
          e.preventDefault();
          e.target.blur();
          dispatch(toggleIsRunning());
        }
        break;
      case 'f':
        if (!isRunning && !withModifiers(e)) {
          fitCellsToCanvas();
        }
        break;
      case 'g':
        if (!withModifiers(e)) {
          dispatch(toggleShowGridlines());
        }
        break;
      case 'd':
        if (!withModifiers(e)) {
          clearCanvas({ canvas: canvasDrawLayerRef.current });
          dispatch(toggleInEditMode());
        }
        break;
      case 'w':
        if (!withModifiers(e)) {
          dispatch(toggleWrap());
        }
        break;
      case 's':
        if (!withModifiers(e)) {
          saveCanvasAsImage({
            canvasBaseLayerRef: canvasBaseLayerRef,
            canvasGridLayerRef: canvasGridLayerRef,
          });
        }
        break;
      case 'h':
        if (!withModifiers(e)) {
          dispatch(toggleShowHUD());
        }
        break;
      case 'm':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood('MOORE'));
        }
        break;
      case 'n':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood('VONNEUMANN'));
        }
        break;
      case 'b':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood('HEXAGONAL'));
        }
        break;
      case 'ArrowUp':
        if (!withModifiers(e)) {
          e.preventDefault();
          dispatch(setSpeed({ speed: speed + 1 }));
        }
        break;
      case 'ArrowDown':
        if (!withModifiers(e)) {
          e.preventDefault();
          dispatch(setSpeed({ speed: speed - 1 }));
        }
        break;
      case 'ArrowRight':
        if (!withModifiers(e) && !isRunning) {
          e.preventDefault();
          dispatch(getNextCells());
        }
        break;
      default:
        break;
    }
  });
};
