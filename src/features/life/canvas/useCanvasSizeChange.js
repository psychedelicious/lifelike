import { useDispatch } from 'react-redux';
import { setGrid } from '../../../redux/actions';

export const useCanvasSizeChange = () => {
  const dispatch = useDispatch();

  const changeCanvasSize = ({
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
    width,
    height,
    px,
  }) => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const newCanvasHeight = height * px;
    const newCanvasWidth = width * px;

    canvasBaseLayerRef.current.width = newCanvasWidth;
    canvasBaseLayerRef.current.height = newCanvasHeight;

    canvasGridLayerRef.current.width = newCanvasWidth;
    canvasGridLayerRef.current.height = newCanvasHeight;

    canvasDrawLayerRef.current.width = newCanvasWidth;
    canvasDrawLayerRef.current.height = newCanvasHeight;

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
