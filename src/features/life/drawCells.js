export const drawCells = ({
  canvas,
  cells,
  cellSize,
  cellWidth,
  cellHeight,
}) => {
  const context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = '#EDF2F7';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#2D3748';
  for (let x = 0; x < cellWidth; x++) {
    for (let y = 0; y < cellHeight; y++) {
      cells[x][y] &&
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
};
