export const createCells = ({ width, height, fill = 'random' }) => {
  let cells = Array.from(Array(width), () => new Array(height));
  let population = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      cells[x][y] =
        fill instanceof Array
          ? fill?.[x]?.[y] ?? 0
          : fill === 'random'
          ? Math.random() > 0.5
            ? 1
            : 0
          : fill;
      population += cells[x][y];
    }
  }
  return [cells, population];
};
