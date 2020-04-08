export const createCells = ({ cellWidth, cellHeight, fill = 'random' }) => {
  let cells = Array.from(Array(cellWidth), () => new Array(cellHeight));

  for (let x = 0; x < cellWidth; x++) {
    for (let y = 0; y < cellHeight; y++) {
      cells[x][y] =
        fill instanceof Array
          ? fill?.[x]?.[y] ?? 0
          : fill === 'random'
          ? Math.random() > 0.5
            ? 1
            : 0
          : fill;
    }
  }
  return cells;
};
