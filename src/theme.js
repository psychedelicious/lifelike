import { theme } from '@chakra-ui/core';

const breakpoints = ['30em', '48em', '62em', '80em'];
// aliases
breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];

export const lifelikeTheme = {
  ...theme,
  breakpoints,
  fonts: {
    body: '"Fira Code", monospace',
    heading: '"Fira Code", monospace',
    mono: '"Fira Code", monospace',
  },
  colors: {
    ...theme.colors,
    transparent: 'transparent',
    black: '#252020',
    white: '#ebeaea',
    whiteAlpha: {
      50: 'rgba(255, 255, 255, 0.04)',
      100: 'rgba(255, 255, 255, 0.08)',
      200: 'rgba(255, 255, 255, 0.12)',
      300: 'rgba(255, 255, 255, 0.24)',
      400: 'rgba(255, 255, 255, 0.32)',
      500: 'rgba(255, 255, 255, 0.48)',
      600: 'rgba(255, 255, 255, 0.60)',
      700: 'rgba(255, 255, 255, 0.72)',
      800: 'rgba(255, 255, 255, 0.80)',
      900: 'rgba(255, 255, 255, 0.92)',
    },
    blue: {
      50: '#E9E2E7',
      100: '#D8CBD4',
      200: '#beaab9',
      300: '#a5889c',
      400: '#8b6680',
      500: '#714465',
      600: '#492c41',
      700: '#34202e',
      800: '#20131b',
      900: '#191016',
    },
    gray: {
      50: '#faf9fa',
      100: '#e4e0e3',
      200: '#bab0b8',
      300: '#a99ca6',
      400: '#948490',
      500: '#7a6675',
      600: '#584652',
      700: '#41343D',
      800: '#2A2227',
      900: '#1F171D',
    },
  },
};
