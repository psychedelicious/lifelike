export const Neighborhoods = {
  types: ['MOORE', 'VONNEUMANN', 'HEXAGONAL'],
  MOORE: {
    id: 'MOORE',
    name: 'Moore',
    coords: [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ],
  },
  VONNEUMANN: {
    id: 'VONNEUMANN',
    name: 'von Neumann',
    coords: [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ],
  },
  HEXAGONAL: {
    id: 'HEXAGONAL',
    name: 'hex',
    coords: [
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
    ],
  },
};
