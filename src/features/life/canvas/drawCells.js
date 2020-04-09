export const drawCells = ({
  canvas,
  cells,
  cellSize,
  cellWidth,
  cellHeight,
  deadCellColor,
  aliveCellColor,
}) => {
  const context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = deadCellColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = aliveCellColor;
  for (let x = 0; x < cellWidth; x++) {
    for (let y = 0; y < cellHeight; y++) {
      cells[x][y] &&
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
};
