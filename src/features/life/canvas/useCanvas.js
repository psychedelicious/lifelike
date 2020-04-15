import { useLife } from '../../../storeApi';

export const useCanvas = () => {
  const {
    deadCellColor,
    aliveCellColor,
    width,
    height,
    cells,
    px,
    gridlineColor,
  } = useLife();

  const drawCells = ({ canvas }) => {
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

  const drawGridlines = ({ canvas }) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = gridlineColor;

    for (let cellX = 1; cellX < width; cellX++) {
      context.fillRect(cellX * px, 0, 0.5, height * px);
    }
    for (let cellY = 1; cellY < height; cellY++) {
      context.fillRect(0, cellY * px, width * px, 0.5);
    }
  };

  return { drawCells, clearCanvas, drawGridlines };
};
