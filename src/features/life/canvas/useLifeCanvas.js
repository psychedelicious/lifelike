import { useStore } from '../../../store';

export const useLifeCanvas = () => {
  const { state } = useStore();

  const drawCells = ({ canvas }) => {
    const context = canvas.getContext('2d', { alpha: false });
    context.fillStyle = state.deadCellColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = state.aliveCellColor;
    for (let x = 0; x < state.width; x++) {
      for (let y = 0; y < state.height; y++) {
        state.cells[x][y] &&
          context.fillRect(x * state.px, y * state.px, state.px, state.px);
      }
    }
  };

  const clearCanvas = ({ canvas }) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawGridlines = ({ canvas }) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (state.showGridlines) {
      context.fillStyle = state.gridlineColor;

      for (let cellX = 1; cellX < state.width; cellX++) {
        context.fillRect(cellX * state.px, 0, 0.5, state.height * state.px);
      }
      for (let cellY = 1; cellY < state.height; cellY++) {
        context.fillRect(0, cellY * state.px, state.width * state.px, 0.5);
      }
    }
  };

  return { drawCells, clearCanvas, drawGridlines };
};

// export const drawCells = ({
//   canvas,
//   cells,
//   px,
//   width,
//   height,
//   deadCellColor,
//   aliveCellColor,
// }) => {

//   const context = canvas.getContext('2d', { alpha: false });
//   context.fillStyle = deadCellColor;
//   context.fillRect(0, 0, canvas.width, canvas.height);

//   context.fillStyle = aliveCellColor;
//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       cells[x][y] && context.fillRect(x * px, y * px, px, px);
//     }
//   }
// };
