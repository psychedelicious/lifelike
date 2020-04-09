export const getNextCells = ({
  cells,
  cellWidth,
  cellHeight,
  born,
  survive,
  wrap,
  neighborhood,
}) => {
  // let newCells = [...cells];
  let newCells = Array.from(Array(cellWidth), () => new Array(cellHeight));

  for (let x = 0; x < cellWidth; x++) {
    for (let y = 0; y < cellHeight; y++) {
      let neighborCount = 0;

      for (let coord of neighborhood.coords) {
        let _x = x + coord[0];
        let _y = y + coord[1];

        if (wrap) {
          if (_x < 0) {
            // wrap to the west
            _x = cellWidth + _x;
          } else if (_x >= cellWidth) {
            // wrap to the east
            _x = cellWidth - _x;
          }

          if (_y < 0) {
            // wrap to the north
            _y = cellHeight + _y;
          } else if (_y >= cellHeight) {
            // wrap to the south
            _y = cellHeight - _y;
          }
        } else {
          if (_x < 0 || _x >= cellWidth || _y < 0 || _y >= cellHeight) {
            // ignore this neighbor
            continue;
          }
        }

        neighborCount += cells[_x][_y];
      }

      if (cells[x][y] === 0 && born[neighborCount] === true) {
        newCells[x][y] = 1;
      } else if (cells[x][y] === 1 && survive[neighborCount] === false) {
        newCells[x][y] = 0;
      } else {
        newCells[x][y] = cells[x][y];
      }
    }
  }
  return newCells;
};
