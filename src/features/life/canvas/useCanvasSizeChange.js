import { useDispatch } from 'react-redux';
import { setGrid } from '../../../redux/actions';

export const useCanvasSizeChange = () => {
  const dispatch = useDispatch();

  const changeCanvasSize = ({
    canvasRef,
    canvasGridOverlayRef,
    canvasDrawOverlayRef,
    width,
    height,
    px,
  }) => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const newCanvasHeight = height * px;
    const newCanvasWidth = width * px;

    canvasRef.current.width = newCanvasWidth;
    canvasRef.current.height = newCanvasHeight;

    canvasGridOverlayRef.current.width = newCanvasWidth;
    canvasGridOverlayRef.current.height = newCanvasHeight;

    canvasDrawOverlayRef.current.width = newCanvasWidth;
    canvasDrawOverlayRef.current.height = newCanvasHeight;

    dispatch(
      setGrid({
        width: width,
        height: height,
        px: px,
        canvasWidth: newCanvasWidth,
        canvasHeight: newCanvasHeight,
        canvasContainerWidth: newCanvasWidth + rem + 2,
        canvasContainerHeight: newCanvasHeight + rem + 2,
      })
    );
  };

  return changeCanvasSize;
};
