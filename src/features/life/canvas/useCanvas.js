import { saveAs } from 'file-saver';

export const useCanvas = () => {
  const drawCells = ({
    canvas,
    deadCellColor,
    aliveCellColor,
    width,
    height,
    cells,
    px,
  }) => {
    const context = canvas.getContext('2d', { alpha: false });
    context.fillStyle = deadCellColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = aliveCellColor;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        cells[x][y] && context.fillRect(x * px, y * px, px, px);
      }
    }
  };

  const clearCanvas = ({ canvas }) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawGridlines = ({ canvas, gridlineColor, width, height, px }) => {
    const context = canvas.getContext('2d');
    context.translate(-0.5, -0.5);
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = gridlineColor;

    for (let cellX = 1; cellX < width; cellX++) {
      context.fillRect(cellX * px, 0, 1, canvas.height + 1);
    }
    for (let cellY = 1; cellY < height; cellY++) {
      context.fillRect(0, cellY * px, canvas.width + 1, 1);
    }
    context.translate(0.5, 0.5);
  };

  const saveCanvasAsImage = ({ canvas, canvasGridOverlay }) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const tempContext = tempCanvas.getContext('2d');

    tempContext.drawImage(canvas, 0, 0);
    tempContext.drawImage(canvasGridOverlay, 0, 0);

    const id = Math.random().toString(36).substr(2, 9);

    const fileName = `lifelike_${id}.png`;

    tempCanvas.toBlob((blob) => {
      saveAs(blob, fileName);
    });
  };

  return { drawCells, clearCanvas, drawGridlines, saveCanvasAsImage };
};
