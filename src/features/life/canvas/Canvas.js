import React from 'react';
import PropTypes from 'prop-types';

import { Flex } from '@chakra-ui/core';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import CanvasBaseLayer from './CanvasBaseLayer';
import CanvasGridLayer from './CanvasGridLayer';
import CanvasDrawingLayer from './CanvasDrawingLayer';
import CanvasInfoOverlay from './CanvasInfoOverlay';

import { setCanvasOverlayText, setArrayOfCells } from '../../../redux/actions';

import { getPointsOnLine } from '../../../geometry/getPointsOnLine';

const Canvas = React.memo(
  ({
    canvasBaseLayerRef,
    canvasContainerRef,
    canvasGridLayerRef,
    canvasDrawLayerRef,
    ...rest
  }) => {
    const {
      canvasWidth,
      canvasHeight,
      isRunning,
      inEditMode,
      px,
      width,
      height,
      brushPoints,
      isInvertDraw,
    } = useSelector(
      (state) => ({
        canvasWidth: state.life.canvasWidth,
        canvasHeight: state.life.canvasHeight,
        isRunning: state.life.isRunning,
        inEditMode: state.life.inEditMode,
        px: state.life.px,
        width: state.life.width,
        height: state.life.height,
        brushPoints: state.life.brushPoints,
        isInvertDraw: state.life.isInvertDraw,
      }),
      shallowEqual
    );

    const dispatch = useDispatch();

    const canvasMousePos = React.useRef({ x: null, y: null });
    const cellMousePos = React.useRef({ x: null, y: null });

    const handleCanvasPointerMove = React.useCallback(
      (e) => {
        e.preventDefault();
        if (inEditMode) {
          const canvasX = e.layerX - 1;
          const canvasY = e.layerY - 1;
          const x = Math.floor(canvasX / px);
          const y = Math.floor(canvasY / px);

          if (x >= 0 && x < width && y >= 0 && y < height) {
            const isAltKey = e.altKey;
            const context = canvasDrawLayerRef.current.getContext('2d');
            const brushCells = brushPoints.map((point) => ({
              x: point.x + x,
              y: point.y + y,
              state: point.state,
            }));

            context.clearRect(0, 0, canvasWidth, canvasHeight);

            context.fillStyle =
              isAltKey !== isInvertDraw ? '#FF000075' : '#00FF0075';

            brushCells.forEach(
              (cell) =>
                cell.state && context.fillRect(cell.x * px, cell.y * px, px, px)
            );

            context.fillStyle =
              isAltKey !== isInvertDraw ? '#FF0000' : '#00FF00';
            context.fillRect(0, canvasY, canvasWidth, 1);
            context.fillRect(canvasX, 0, 1, canvasHeight);

            dispatch(
              setCanvasOverlayText({
                text: [
                  `width: ${width}`,
                  `height: ${height}`,
                  `x: ${x}`,
                  `y: ${y}`,
                ],
              })
            );

            if (e.buttons) {
              dispatch(
                setArrayOfCells({
                  arrayOfCells: brushCells,
                  invertState: isAltKey !== isInvertDraw,
                })
              );
              canvasMousePos.current = { x: canvasX, y: canvasY };
              cellMousePos.current = { x, y };
            }
          }
        }
      },
      [
        dispatch,
        brushPoints,
        canvasHeight,
        canvasWidth,
        height,
        inEditMode,
        isInvertDraw,
        px,
        width,
        canvasDrawLayerRef,
      ]
    );

    const handleCanvasPointerDown = React.useCallback(
      (e) => {
        e.preventDefault();
        if (inEditMode) {
          const canvasX = e.layerX - 1;
          const canvasY = e.layerY - 1;
          const x = Math.floor(canvasX / px);
          const y = Math.floor(canvasY / px);
          if (x >= 0 && x < width && y >= 0 && y < height) {
            const isAltKey = e.altKey;

            let points;
            if (
              e.shiftKey &&
              cellMousePos.current.x &&
              cellMousePos.current.y
            ) {
              let linePoints = getPointsOnLine(
                x,
                y,
                cellMousePos.current.x,
                cellMousePos.current.y
              );

              points = linePoints
                .map((linePoint) =>
                  brushPoints.map((point) => ({
                    x: point.x + linePoint.x,
                    y: point.y + linePoint.y,
                    state: point.state,
                  }))
                )
                .flat();
            } else {
              points = brushPoints.map((point) => ({
                x: point.x + x,
                y: point.y + y,
                state: point.state,
              }));
            }

            dispatch(
              setArrayOfCells({
                arrayOfCells: points,
                invertState: isAltKey !== isInvertDraw,
              })
            );
            canvasMousePos.current = { x: canvasX, y: canvasY };
            cellMousePos.current = { x, y };
          }
        }
      },
      [dispatch, brushPoints, height, inEditMode, isInvertDraw, px, width]
    );

    const handleCanvasPointerLeave = React.useCallback(() => {
      if (inEditMode) {
        const context = canvasDrawLayerRef.current.getContext('2d');
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        dispatch(setCanvasOverlayText({ text: [] }));
      }
    }, [dispatch, canvasWidth, canvasHeight, inEditMode, canvasDrawLayerRef]);

    React.useEffect(() => {
      if (!isRunning) {
        const canvasDrawOverlay = canvasDrawLayerRef.current;
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
          const context = canvasDrawOverlay.getContext('2d');
          context.clearRect(0, 0, canvasWidth, canvasHeight);
        };
      }
    }, [
      handleCanvasPointerDown,
      handleCanvasPointerLeave,
      handleCanvasPointerMove,
      canvasWidth,
      canvasHeight,
      isRunning,
      canvasDrawLayerRef,
    ]);

    return (
      <Flex {...rest} ref={canvasContainerRef} position="relative">
        <CanvasBaseLayer canvasBaseLayerRef={canvasBaseLayerRef} />
        <CanvasGridLayer canvasGridLayerRef={canvasGridLayerRef} />
        <CanvasDrawingLayer canvasDrawLayerRef={canvasDrawLayerRef} />
        <CanvasInfoOverlay />
      </Flex>
    );
  }
);

Canvas.propTypes = {
  canvasBaseLayerRef: PropTypes.object.isRequired,
  canvasContainerRef: PropTypes.object.isRequired,
  canvasGridLayerRef: PropTypes.object.isRequired,
  canvasDrawLayerRef: PropTypes.object.isRequired,
};

export default Canvas;
