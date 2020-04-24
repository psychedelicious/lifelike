import React from 'react';

import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';
import { setGrid } from 'store/reducers/life';

export const useCanvas = () => {
  const dispatch = useDispatch();

  const drawCells = ({
    canvasBaseLayer,
    deadCellColor,
    aliveCellColor,
    width,
    height,
    cells,
    px,
    zip,
    filenameIndex,
  }) => {
    const context = canvasBaseLayer.getContext('2d', { alpha: false });
    context.fillStyle = deadCellColor;
    context.fillRect(0, 0, canvasBaseLayer.width, canvasBaseLayer.height);

    context.fillStyle = aliveCellColor;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        cells[x][y] && context.fillRect(x * px, y * px, px, px);
      }
    }

    // if (zip.current) {
    //   canvasBaseLayer.toBlob((blob) =>
    //     zip.current.file(`${filenameIndex.current}.png`, blob)
    //   );
    //   filenameIndex.current++;
    // }
  };

  const clearCanvas = ({ canvas }) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawGridlines = ({
    canvasBaseLayer,
    gridlineColor,
    width,
    height,
    px,
  }) => {
    const context = canvasBaseLayer.getContext('2d');
    context.translate(-0.5, -0.5);
    context.clearRect(0, 0, canvasBaseLayer.width, canvasBaseLayer.height);

    context.fillStyle = gridlineColor;

    for (let cellX = 1; cellX < width; cellX++) {
      context.fillRect(cellX * px, 0, 1, canvasBaseLayer.height + 1);
    }
    for (let cellY = 1; cellY < height; cellY++) {
      context.fillRect(0, cellY * px, canvasBaseLayer.width + 1, 1);
    }
    context.translate(0.5, 0.5);
  };

  const saveCanvasAsImage = ({ canvasBaseLayerRef, canvasGridLayerRef }) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasBaseLayerRef.current.width;
    tempCanvas.height = canvasGridLayerRef.current.height;

    const tempContext = tempCanvas.getContext('2d');

    tempContext.drawImage(canvasBaseLayerRef.current, 0, 0);
    tempContext.drawImage(canvasGridLayerRef.current, 0, 0);

    const id = Math.random().toString(36).substr(2, 9);

    const fileName = `lifelike_${id}.png`;

    tempCanvas.toBlob((blob) => {
      saveAs(blob, fileName);
    });
  };

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

  return {
    drawCells: React.useCallback(drawCells),
    clearCanvas: React.useCallback(clearCanvas),
    drawGridlines: React.useCallback(drawGridlines),
    saveCanvasAsImage: React.useCallback(saveCanvasAsImage),
    changeCanvasSize: React.useCallback(changeCanvasSize),
  };
};
