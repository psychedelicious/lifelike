import { clamp } from 'lodash';

export const useCellDimensions = () => {
  const getCellDimensions = ({
    isMobile,
    canvasRef,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    px,
  }) => {
    // calculate 1 rem in px
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const canvasRect = canvasRef.current.getBoundingClientRect();

    // TODO: get the offsets dynamically
    const widthOffset = isMobile ? 0.5 * rem : rem;
    const heightOffset = isMobile ? 17 * rem : rem;

    // the canvas has a 1px border * 2 for each x and y
    const borderWidth = 2;

    const newWidth = clamp(
      Math.trunc(
        (window.innerWidth - canvasRect.left - widthOffset - borderWidth) / px
      ),
      minWidth,
      maxWidth
    );

    const newHeight = clamp(
      Math.trunc(
        (window.innerHeight - canvasRect.top - heightOffset - borderWidth) / px
      ),
      minHeight,
      maxHeight
    );

    return { newWidth, newHeight };
  };

  return getCellDimensions;
};
