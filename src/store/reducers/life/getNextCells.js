export const getNextCells_shouldDrawAllCells = (
  cells,
  width,
  height,
  born,
  survive,
  shouldWrap,
  neighborhood
) => {
  let newCells = [],
    population = 0,
    didAnyCellsChange = false,
    neighborCount,
    coordCount = neighborhood.coords.length,
    coords = neighborhood.coords,
    _x,
    _y;

  for (let x = 0; x < width; x++) {
    newCells[x] = [];
    for (let y = 0; y < height; y++) {
      neighborCount = 0;
      for (let i = 0; i < coordCount; i++) {
        _x = x + coords[i][0];
        _y = y + coords[i][1];

        if (shouldWrap) {
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
        didAnyCellsChange = true;
      } else if (cells[x][y] === 1 && survive[neighborCount] === false) {
        newCells[x][y] = 0;
        didAnyCellsChange = true;
      } else {
        newCells[x][y] = cells[x][y];
      }

      population += newCells[x][y];
    }
  }
  return [newCells, population, didAnyCellsChange];
};

export const getNextCells_drawChangedCells = (
  cells,
  width,
  height,
  born,
  survive,
  shouldWrap,
  neighborhood
) => {
  let newCells = [],
    redrawCellList = [[], []],
    population = 0,
    didAnyCellsChange = false,
    neighborCount,
    coordCount = neighborhood.coords.length,
    coords = neighborhood.coords,
    _x,
    _y;

  for (let x = 0; x < width; x++) {
    newCells[x] = [];
    for (let y = 0; y < height; y++) {
      neighborCount = 0;
      for (let i = 0; i < coordCount; i++) {
        _x = x + coords[i][0];
        _y = y + coords[i][1];

        if (shouldWrap) {
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
        didAnyCellsChange = true;
        redrawCellList[1].push([x, y]);
      } else if (cells[x][y] === 1 && survive[neighborCount] === false) {
        newCells[x][y] = 0;
        didAnyCellsChange = true;
        redrawCellList[0].push([x, y]);
      } else {
        newCells[x][y] = cells[x][y];
      }

      population += newCells[x][y];
    }
  }
  return [newCells, population, didAnyCellsChange, redrawCellList];
};
