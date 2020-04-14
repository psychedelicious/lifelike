export const drawGridLines = ({
  canvas,
  width,
  height,
  px,
  gridLineColor,
  thickness = 0.5,
}) => {
  const context = canvas.getContext('2d');
  context.fillStyle = gridLineColor;

  for (let cellX = 1; cellX < width; cellX++) {
    context.fillRect(cellX * px, 0, thickness, height * px);
  }
  for (let cellY = 1; cellY < height; cellY++) {
    context.fillRect(0, cellY * px, width * px, thickness);
  }
};
