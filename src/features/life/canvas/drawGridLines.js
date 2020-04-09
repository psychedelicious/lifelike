export const drawGridLines = ({
  canvas,
  cellWidth,
  cellHeight,
  cellSize,
  gridLineColor,
  thickness = 0.5,
}) => {
  const context = canvas.getContext('2d');
  context.fillStyle = gridLineColor;
  for (let cellX = 1; cellX < cellWidth; cellX++) {
    context.fillRect(cellX * cellSize, 0, thickness, cellHeight * cellSize);
  }
  for (let cellY = 1; cellY < cellHeight; cellY++) {
    context.fillRect(0, cellY * cellSize, cellWidth * cellSize, thickness);
  }
};
