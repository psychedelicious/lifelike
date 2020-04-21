export const getNextCells = (
  cells,
  width,
  height,
  born,
  survive,
  wrap,
  neighborhood
) => {
  let newCells = Array.from(Array(width), () => new Array(height));
  let population = 0,
    cellsChanged = false,
    neighborCount,
    coord,
    _x,
    _y;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      neighborCount = 0;
      for (coord of neighborhood.coords) {
        _x = x + coord[0];
        _y = y + coord[1];

        if (wrap) {
          if (_x < 0) {
            // wrap to the west
            _x = width + _x;
          } else if (_x >= width) {
            // wrap to the east
            _x = width - _x;
          }

          if (_y < 0) {
            // wrap to the north
            _y = height + _y;
          } else if (_y >= height) {
            // wrap to the south
            _y = height - _y;
          }
        } else {
          if (_x < 0 || _x >= width || _y < 0 || _y >= height) {
            // ignore this neighbor
            continue;
          }
        }

        neighborCount += cells[_x][_y];
      }

      if (cells[x][y] === 0 && born[neighborCount] === true) {
        newCells[x][y] = 1;
        cellsChanged = true;
      } else if (cells[x][y] === 1 && survive[neighborCount] === false) {
        newCells[x][y] = 0;
        cellsChanged = true;
      } else {
        newCells[x][y] = cells[x][y];
      }

      population += newCells[x][y];
    }
  }
  // return newCells;
  return [newCells, population, cellsChanged];
};
