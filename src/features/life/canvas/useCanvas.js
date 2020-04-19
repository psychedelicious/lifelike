import { saveAs } from 'file-saver';

export const useCanvas = () => {
  const drawCells = ({
    canvasBaseLayer,
    deadCellColor,
    aliveCellColor,
    width,
    height,
    cells,
    px,
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
  };

  const clearCanvas = ({ canvasBaseLayer }) => {
    const context = canvasBaseLayer.getContext('2d');
    context.clearRect(0, 0, canvasBaseLayer.width, canvasBaseLayer.height);
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

  return { drawCells, clearCanvas, drawGridlines, saveCanvasAsImage };
};
