import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';

import CanvasBaseLayer from 'features/canvas/CanvasBaseLayer';
import CanvasGridLayer from 'features/canvas/CanvasGridLayer';
import CanvasDrawingLayer from 'features/canvas/CanvasDrawingLayer';
import { getPointsOnLine } from 'features/canvas/getPointsOnLine';

import HUD from 'features/life/HUD';

import { setArrayOfCells, translateCells } from 'store/reducers/life';

const Canvas = React.memo(
  ({
    isMobile,
    canvasBaseLayerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
  }) => {
    const canvasWidth = useSelector((state) => state.life.canvasWidth);
    const canvasHeight = useSelector((state) => state.life.canvasHeight);
    const px = useSelector((state) => state.life.px);
    const shouldWrap = useSelector((state) => state.life.shouldWrap);
    const width = useSelector((state) => state.life.width);
    const height = useSelector((state) => state.life.height);
    const shouldShowHUD = useSelector((state) => state.life.shouldShowHUD);

    const isInDrawMode = useSelector((state) => state.drawing.isInDrawMode);
    const isInTranslateMode = useSelector(
      (state) => state.drawing.isInTranslateMode
    );
    const isInvertDraw = useSelector((state) => state.drawing.isInvertDraw);
    const shouldDrawCrosshairs = useSelector(
      (state) => state.drawing.shouldDrawCrosshairs
    );

    const brushPoints = useSelector(
      (state) => state.drawing.brushPoints,
      isEqual
    );

    const dispatch = useDispatch();

    const mousePosX = React.useRef(0);
    const mousePosY = React.useRef(0);
    const lastMousePosX = React.useRef(0);
    const lastMousePosY = React.useRef(0);
    const lastPointerUpPosX = React.useRef(0);
    const lastPointerUpPosY = React.useRef(0);

    const mouseDraggedIn = React.useRef(false);

    const handleCanvasPointerMove = React.useCallback(
      (e) => {
        if (isInDrawMode || isInTranslateMode) {
          const canvasX = e.layerX - 1;
          const canvasY = e.layerY - 1;
          mousePosX.current = Math.floor(canvasX / px);
          mousePosY.current = Math.floor(canvasY / px);
          const context = canvasDrawLayerRef.current.getContext('2d');
          context.clearRect(0, 0, canvasWidth, canvasHeight);

          if (isInTranslateMode) {
            if (e.buttons && !mouseDraggedIn.current) {
              dispatch(
                translateCells({
                  deltaX: mousePosX.current - lastMousePosX.current,
                  deltaY: mousePosY.current - lastMousePosY.current,
                })
              );
              lastMousePosX.current = mousePosX.current;
              lastMousePosY.current = mousePosY.current;
            }
          } else {
            const isAltKey = e.altKey;
            const brushCells = brushPoints.map((point) => ({
              x: point.x + mousePosX.current,
              y: point.y + mousePosY.current,
            }));

            context.fillStyle =
              isAltKey !== isInvertDraw ? '#FF000075' : '#00FF0075';

            brushCells.forEach((cell) => {
              if (shouldWrap) {
                let _x = cell.x,
                  _y = cell.y;

                if (_x < 0) {
                  _x = width + _x;
                } else if (_x >= width) {
                  _x = _x - width;
                }

                if (_y < 0) {
                  _y = height + _y;
                } else if (_y >= height) {
                  _y = _y - height;
                }

                context.fillRect(_x * px, _y * px, px, px);
              } else {
                if (
                  cell.x >= 0 &&
                  cell.x < width &&
                  cell.y >= 0 &&
                  cell.y < height
                ) {
                  context.fillRect(cell.x * px, cell.y * px, px, px);
                }
              }
            });

            if (shouldDrawCrosshairs) {
              context.fillStyle =
                isAltKey !== isInvertDraw ? '#FF0000' : '#00FF00';
              context.fillRect(
                mousePosX.current * px + px / 2,
                0,
                1,
                canvasHeight
              );
              context.fillRect(
                0,
                mousePosY.current * px + px / 2,
                canvasWidth,
                1
              );
            }

            if (e.buttons && !mouseDraggedIn.current) {
              dispatch(
                setArrayOfCells({
                  arrayOfCells: brushCells,
                  invertState: isAltKey !== isInvertDraw,
                })
              );

              lastPointerUpPosX.current = mousePosX.current;
              lastPointerUpPosY.current = mousePosY.current;
            }
          }
        }
        lastMousePosX.current = mousePosX.current;
        lastMousePosY.current = mousePosY.current;
      },
      [
        dispatch,
        width,
        height,
        shouldWrap,
        brushPoints,
        canvasHeight,
        canvasWidth,
        isInDrawMode,
        isInvertDraw,
        px,
        canvasDrawLayerRef,
        shouldDrawCrosshairs,
        isInTranslateMode,
      ]
    );

    const handleCanvasPointerDown = React.useCallback(
      (e) => {
        mouseDraggedIn.current = false;
        if (isInDrawMode && !isInTranslateMode) {
          const canvasX = e.layerX - 1;
          const canvasY = e.layerY - 1;
          mousePosX.current = Math.floor(canvasX / px);
          mousePosY.current = Math.floor(canvasY / px);
          const isAltKey = e.altKey;

          let points;
          if (
            e.shiftKey &&
            lastPointerUpPosX.current &&
            lastPointerUpPosY.current
          ) {
            let linePoints = getPointsOnLine(
              mousePosX.current,
              mousePosY.current,
              lastPointerUpPosX.current,
              lastPointerUpPosY.current
            );

            points = linePoints
              .map((linePoint) =>
                brushPoints.map((point) => ({
                  x: point.x + linePoint.x,
                  y: point.y + linePoint.y,
                }))
              )
              .flat();
          } else {
            points = brushPoints.map((point) => ({
              x: point.x + mousePosX.current,
              y: point.y + mousePosY.current,
            }));
          }

          dispatch(
            setArrayOfCells({
              arrayOfCells: points,
              invertState: isAltKey !== isInvertDraw,
            })
          );

          lastMousePosX.current = mousePosX.current;
          lastMousePosY.current = mousePosY.current;
          lastPointerUpPosX.current = mousePosX.current;
          lastPointerUpPosY.current = mousePosY.current;
        }
      },
      [dispatch, brushPoints, isInDrawMode, isInvertDraw, px, isInTranslateMode]
    );

    const handleCanvasPointerLeave = React.useCallback(() => {
      if (isInDrawMode) {
        const context = canvasDrawLayerRef.current.getContext('2d');

        context.clearRect(0, 0, canvasWidth, canvasHeight);
      }
    }, [canvasWidth, canvasHeight, isInDrawMode, canvasDrawLayerRef]);

    const handleCanvasPointerEnter = React.useCallback((e) => {
      if (e.buttons) {
        mouseDraggedIn.current = true;
      }
    }, []);

    React.useEffect(() => {
      const canvasDrawOverlay = canvasDrawLayerRef.current;
      canvasDrawOverlay.addEventListener(
        'pointerenter',
        handleCanvasPointerEnter
      );
      canvasDrawOverlay.addEventListener(
        'pointermove',
        handleCanvasPointerMove
      );
      canvasDrawOverlay.addEventListener(
        'pointerdown',
        handleCanvasPointerDown
      );
      canvasDrawOverlay.addEventListener(
        'pointerleave',
        handleCanvasPointerLeave
      );
      return () => {
        canvasDrawOverlay.removeEventListener(
          'pointerenter',
          handleCanvasPointerEnter
        );
        canvasDrawOverlay.removeEventListener(
          'pointermove',
          handleCanvasPointerMove
        );
        canvasDrawOverlay.removeEventListener(
          'pointerdown',
          handleCanvasPointerDown
        );
        canvasDrawOverlay.removeEventListener(
          'pointerleave',
          handleCanvasPointerLeave
        );
      };
      // }
    }, [
      handleCanvasPointerDown,
      handleCanvasPointerLeave,
      handleCanvasPointerMove,
      handleCanvasPointerEnter,
      canvasWidth,
      canvasHeight,
      canvasDrawLayerRef,
    ]);

    return (
      <div
        position="relative"
        style={{
          gridArea: 'canvas',
          alignSelf: 'start',
          padding: 0,
          margin: 0,
          marginTop: isMobile ? '0.5rem' : '0',
          position: 'relative',
          display: 'flex',
          flex: '1 0 auto',
          userSelect: 'none',
          touchAction: isInDrawMode || isInTranslateMode ? 'none' : 'auto',
        }}
      >
        <CanvasBaseLayer canvasBaseLayerRef={canvasBaseLayerRef} />
        <CanvasGridLayer canvasGridLayerRef={canvasGridLayerRef} />
        <CanvasDrawingLayer canvasDrawLayerRef={canvasDrawLayerRef} />
        {shouldShowHUD && <HUD />}
      </div>
    );
  }
);

Canvas.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default Canvas;
