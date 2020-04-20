import React from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

import { useSelector, useDispatch } from 'react-redux';

import CanvasBaseLayer from './CanvasBaseLayer';
import CanvasGridLayer from './CanvasGridLayer';
import CanvasDrawingLayer from './CanvasDrawingLayer';
import Numbers from '../Numbers';

import { setArrayOfCells } from '../../../redux/reducers/life';

import { getPointsOnLine } from '../../../geometry/getPointsOnLine';

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
    const wrap = useSelector((state) => state.life.wrap);
    const width = useSelector((state) => state.life.width);
    const height = useSelector((state) => state.life.height);
    const showHUD = useSelector((state) => state.life.showHUD);

    const inEditMode = useSelector((state) => state.drawing.inEditMode);
    const isInvertDraw = useSelector((state) => state.drawing.isInvertDraw);
    const brushPoints = useSelector(
      (state) => state.drawing.brushPoints,
      isEqual
    );

    const dispatch = useDispatch();

    const mousePosX = React.useRef(0);
    const mousePosY = React.useRef(0);
    const lastMousePosX = React.useRef(0);
    const lastMousePosY = React.useRef(0);

    const mouseDraggedIn = React.useRef(false);

    const handleCanvasPointerMove = React.useCallback(
      (e) => {
        if (inEditMode) {
          const canvasX = e.layerX - 1;
          const canvasY = e.layerY - 1;
          mousePosX.current = Math.floor(canvasX / px);
          mousePosY.current = Math.floor(canvasY / px);

          const isAltKey = e.altKey;
          const context = canvasDrawLayerRef.current.getContext('2d');
          const brushCells = brushPoints.map((point) => ({
            x: point.x + mousePosX.current,
            y: point.y + mousePosY.current,
          }));

          context.clearRect(0, 0, canvasWidth, canvasHeight);

          context.fillStyle =
            isAltKey !== isInvertDraw ? '#FF000075' : '#00FF0075';

          brushCells.forEach((cell) => {
            if (wrap) {
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

          context.fillStyle = isAltKey !== isInvertDraw ? '#FF0000' : '#00FF00';
          context.fillRect(0, canvasY, canvasWidth, 1);
          context.fillRect(canvasX, 0, 1, canvasHeight);

          if (e.buttons && !mouseDraggedIn.current) {
            dispatch(
              setArrayOfCells({
                arrayOfCells: brushCells,
                invertState: isAltKey !== isInvertDraw,
              })
            );
            lastMousePosX.current = mousePosX.current;
            lastMousePosY.current = mousePosY.current;
          }
        }
      },
      [
        dispatch,
        width,
        height,
        wrap,
        brushPoints,
        canvasHeight,
        canvasWidth,
        inEditMode,
        isInvertDraw,
        px,
        canvasDrawLayerRef,
      ]
    );

    const handleCanvasPointerDown = React.useCallback(
      (e) => {
        if (inEditMode) {
          mouseDraggedIn.current = false;
          const canvasX = e.layerX - 1;
          const canvasY = e.layerY - 1;
          mousePosX.current = Math.floor(canvasX / px);
          mousePosY.current = Math.floor(canvasY / px);
          const isAltKey = e.altKey;

          let points;
          if (e.shiftKey && lastMousePosX.current && lastMousePosY.current) {
            let linePoints = getPointsOnLine(
              mousePosX.current,
              mousePosY.current,
              lastMousePosX.current,
              lastMousePosY.current
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
        }
      },
      [dispatch, brushPoints, inEditMode, isInvertDraw, px]
    );

    const handleCanvasPointerLeave = React.useCallback(() => {
      if (inEditMode) {
        const context = canvasDrawLayerRef.current.getContext('2d');

        context.clearRect(0, 0, canvasWidth, canvasHeight);
      }
    }, [canvasWidth, canvasHeight, inEditMode, canvasDrawLayerRef]);

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
          touchAction: inEditMode ? 'none' : 'auto',
        }}
      >
        <CanvasBaseLayer canvasBaseLayerRef={canvasBaseLayerRef} />
        <CanvasGridLayer canvasGridLayerRef={canvasGridLayerRef} />
        <CanvasDrawingLayer canvasDrawLayerRef={canvasDrawLayerRef} />
        {showHUD && <Numbers />}
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
