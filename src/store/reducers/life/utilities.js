export const getDensity = (population, width, height) =>
  Math.round((population * 1000) / (width * height)) / 10;
