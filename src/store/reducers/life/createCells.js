export const createCells = ({ width, height, fill = 'random' }) => {
  let cells = [],
    redrawCellList = [[], []],
    population = 0;

  for (let x = 0; x < width; x++) {
    cells[x] = [];
    for (let y = 0; y < height; y++) {
      const state =
        fill instanceof Array
          ? fill?.[x]?.[y] ?? 0
          : fill === 'random'
          ? Math.random() > 0.5
            ? 1
            : 0
          : fill;
      cells[x][y] = state;

      population += cells[x][y];
      redrawCellList[state].push([x, y]);
    }
  }
  return [cells, population, redrawCellList];
};
