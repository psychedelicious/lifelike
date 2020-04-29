import { clamp } from 'lodash';

export const getCellDimensions = ({
  isMobile,
  canvasBaseLayerRef,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  px,
}) => {
  // calculate 1 rem in px
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

  const canvasRect = canvasBaseLayerRef.current.getBoundingClientRect();

  // TODO: get the offsets dynamically
  const widthOffset = isMobile ? 0.5 * rem : rem;
  const heightOffset = isMobile ? 14 * rem : rem;

  const newWidth = clamp(
    Math.trunc((window.innerWidth - canvasRect.left - widthOffset) / px),
    minWidth,
    maxWidth
  );

  const newHeight = clamp(
    Math.trunc(
      (window.innerHeight -
        canvasBaseLayerRef.current.offsetParent.offsetTop -
        heightOffset) /
        px
    ),
    minHeight,
    maxHeight
  );

  return { newWidth, newHeight };
};
