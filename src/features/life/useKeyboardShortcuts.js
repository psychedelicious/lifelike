import { useDispatch, useSelector } from 'react-redux';

import {
  toggleIsRunning,
  toggleShouldShowGridlines,
  toggleShouldWrap,
  setNeighborhood,
  getNextCells,
  translateCells,
} from 'store/reducers/life';

import { toggleShouldShowHUD } from 'store/reducers/hud';

import { incrementSpeed, decrementSpeed } from 'store/reducers/performance';

import {
  toggleIsInDrawMode,
  toggleIsInTranslateMode,
} from 'store/reducers/drawing';

import { useGlobalKeyDown, useWithModifiers } from 'hooks/useWindowEvent';
import { useCanvas } from 'features/canvas/useCanvas';

export const withModifiers = (e) => {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
};

export const useKeyboardShortcuts = ({
  canvasDrawLayerRef,
  fitCellsToCanvas,
}) => {
  const isRunning = useSelector((state) => state.life.isRunning);

  const isInTranslateMode = useSelector(
    (state) => state.drawing.isInTranslateMode
  );

  const dispatch = useDispatch();
  const { clearCanvas } = useCanvas();
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
      case 't':
        if (!withModifiers(e)) {
          dispatch(toggleIsInTranslateMode());
        }
        break;
      case 'ArrowUp':
        if (isInTranslateMode) {
          dispatch(
            translateCells({
              deltaX: 0,
              deltaY: e.shiftKey ? -10 : -1,
            })
          );
        } else if (!withModifiers(e)) {
          e.preventDefault();
          dispatch(incrementSpeed());
        }
        break;
      case 'ArrowDown':
        if (isInTranslateMode) {
          dispatch(
            translateCells({
              deltaX: 0,
              deltaY: e.shiftKey ? 10 : 1,
            })
          );
        } else if (!withModifiers(e)) {
          e.preventDefault();
          dispatch(decrementSpeed());
        }
        break;
      case 'ArrowRight':
        if (isInTranslateMode) {
          dispatch(
            translateCells({
              deltaX: e.shiftKey ? 10 : 1,
              deltaY: 0,
            })
          );
        } else if (!withModifiers(e) && !isRunning) {
          e.preventDefault();
          dispatch(getNextCells());
        }
        break;
      case 'ArrowLeft':
        if (isInTranslateMode) {
          dispatch(
            translateCells({
              deltaX: e.shiftKey ? -10 : -1,
              deltaY: 0,
            })
          );
        }
        break;
      default:
        break;
    }
  });
};
