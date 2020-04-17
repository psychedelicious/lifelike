const getLine = (x, y, w) => {
  let points = [];
  for (let i = 0; i <= w; i++) {
    points.push({ x: x + i, y, state: 1 });
  }
  return points;
};

export const getBrushPoints = ({ brushShape, brushRadius, brushFill }) => {
  let points = [];

  /**
   * if points are added multiple times, canvas renders multiple
   * rects in same place, causing an unwanted artifact outline.
   *
   * use this to keep track of the added points.
   */
  let usedPoints = {};

  if (brushFill === 'solid') {
    if (brushShape === 'square') {
      for (let x = -brushRadius; x <= brushRadius; x++) {
        for (let y = -brushRadius; y <= brushRadius; y++) {
          points.push({ x, y, state: 1 });
        }
      }
    } else if (brushShape === 'circle') {
      // Bresenham filled circle algorithm
      let xOff = 0,
        yOff = brushRadius,
        balance = -brushRadius;

      while (xOff <= yOff) {
        let p0 = -xOff,
          p1 = -yOff,
          w0 = xOff + xOff,
          w1 = yOff + yOff;

        let newPoints = [
          ...getLine(p0, +yOff, w0),
          ...getLine(p0, -yOff, w0),
          ...getLine(p1, +xOff, w1),
          ...getLine(p1, -xOff, w1),
        ];

        newPoints.forEach((point) => {
          if (!usedPoints?.[point.x]?.[point.y]) {
            points.push(point);
            if (!usedPoints?.[point.x]) {
              usedPoints[point.x] = {};
            }
            usedPoints[point.x][point.y] = true;
          }
        });

        balance += xOff + xOff;
        xOff++;
        if (balance >= 0) {
          balance -= yOff + yOff;
          yOff--;
        }
      }
    }
  } else if (brushFill === 'outline') {
    if (brushShape === 'square') {
      for (let x = -brushRadius; x <= brushRadius; x++) {
        for (let y = -brushRadius; y <= brushRadius; y++) {
          if (
            x === -brushRadius ||
            x === brushRadius ||
            y === -brushRadius ||
            y === brushRadius
          ) {
            points.push({ x, y, state: 1 });
          }
        }
      }
    } else if (brushShape === 'circle') {
      let d = (5 - brushRadius * 4) / 4,
        x = 0,
        y = brushRadius;

      while (x <= y) {
        let newPoints = [
          { x: x, y: y, state: 1 },
          { x: x, y: -y, state: 1 },
          { x: -x, y: y, state: 1 },
          { x: -x, y: -y, state: 1 },
          { x: y, y: x, state: 1 },
          { x: y, y: -x, state: 1 },
          { x: -y, y: x, state: 1 },
          { x: -y, y: -x, state: 1 },
        ];

        newPoints.forEach((point) => {
          if (!usedPoints?.[point.x]?.[point.y]) {
            points.push(point);
            if (!usedPoints?.[point.x]) {
              usedPoints[point.x] = {};
            }
            usedPoints[point.x][point.y] = true;
          }
        });

        if (d < 0) {
          d += 2 * x + 1;
        } else {
          d += 2 * (x - y) + 1;
          y--;
        }
        x++;
      }
    }
  } else if (brushFill === 'random' || brushFill === 'spray') {
    let i = 0,
      cellState;
    for (let x = -brushRadius; x < brushRadius; x++) {
      for (let y = -brushRadius; y < brushRadius; y++) {
        if (brushFill === 'spray') {
          cellState =
            Math.random() > 1 / ((x * x + y * y) / brushRadius) / 2 ? 0 : 1;
        } else {
          cellState = Math.random() > 0.5 ? 1 : 0;
        }

        points.push({ x, y, state: cellState });

        if (
          brushShape === 'circle' &&
          (x - 0) * (x - 0) + (y - 0) * (y - 0) > brushRadius * brushRadius
        ) {
          points[i] = { x, y, state: 0 };
        }
        i++;
      }
    }
  }
  return points;
};
