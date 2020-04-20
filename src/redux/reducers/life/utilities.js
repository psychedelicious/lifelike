export const speedToMs = (speed) => Math.pow(100 - speed, 3) / 1000;

export const getDensity = (population, width, height) =>
  Math.round((population * 1000) / (width * height)) / 10;
