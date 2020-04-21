import { useDispatch, useSelector } from 'react-redux';

import {
  toggleIsRunning,
  toggleShouldShowGridlines,
  toggleShouldWrap,
  toggleShouldShowHUD,
  setNeighborhood,
  setSpeed,
  getNextCells,
} from 'store/reducers/life';

import { toggleIsInDrawMode } from 'store/reducers/drawing';

import { useGlobalKeyDown, useWithModifiers } from 'hooks/useWindowEvent';
import { useCanvas } from 'features/canvas/useCanvas';

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
          dispatch(toggleShouldShowGridlines());
        }
        break;
      case 'd':
        if (!withModifiers(e)) {
          clearCanvas({ canvas: canvasDrawLayerRef.current });
          dispatch(toggleIsInDrawMode());
        }
        break;
      case 'w':
        if (!withModifiers(e)) {
          dispatch(toggleShouldWrap());
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
          dispatch(toggleShouldShowHUD());
        }
        break;
      case 'm':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood({ neighborhood: 'MOORE' }));
        }
        break;
      case 'n':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood({ neighborhood: 'VONNEUMANN' }));
        }
        break;
      case 'b':
        if (!withModifiers(e)) {
          dispatch(setNeighborhood({ neighborhood: 'HEXAGONAL' }));
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
