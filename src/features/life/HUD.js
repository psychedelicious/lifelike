import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';

import { Text, Box } from '@chakra-ui/core';

const formatDelay = (speed, msDelay) => {
  let delayString;

  if (speed === 0) {
    delayString = '1s';
  } else if (speed === 100) {
    delayString = 'none';
  } else {
    let delayFormatted = Math.round(msDelay * 100) / 100;
    if (delayFormatted === 0) {
      delayFormatted = Math.round(msDelay * 1000) / 1000;
    }
    delayString = `${delayFormatted}ms`;
  }
  return delayString;
};

const NumberDisplay = React.memo(({ name, value }) => {
  return (
    <React.Fragment key={name}>
      <Text textAlign="right" mr=".5rem">
        {name}
      </Text>
      <Text>~> {value}</Text>
    </React.Fragment>
  );
});

const HUD = React.memo(() => {
  const density = useSelector((state) => state.life.density);
  const generation = useSelector((state) => state.life.generation);
  const height = useSelector((state) => state.life.height);
  const msDelay = useSelector((state) => state.life.msDelay);
  const speed = useSelector((state) => state.life.speed);
  const fps = useSelector((state) => state.life.fps);
  const population = useSelector((state) => state.life.population);
  const px = useSelector((state) => state.life.px);
  const width = useSelector((state) => state.life.width);
  const isRunning = useSelector((state) => state.life.isRunning);
  const { aliveCellColor, deadCellColor } = useSelector(
    (state) => state.life.colors,
    shallowEqual
  );
  const isInDrawMode = useSelector((state) => state.drawing.isInDrawMode);
  const isInTranslateMode = useSelector(
    (state) => state.drawing.isInTranslateMode
  );

  return (
    <>
      <Box
        pos="absolute"
        top="0"
        left="0"
        padding="0.5rem"
        margin="0.5rem"
        zIndex="2"
        width="14rem"
        height="14rem"
        opacity="0.7"
        borderRadius="0.15rem"
        bg={aliveCellColor}
      />
      <Box
        pos="absolute"
        top="0"
        left="0"
        zIndex="3"
        display="grid"
        gridTemplateColumns="auto 7rem"
        gridTemplateRows="repeat(10 auto)"
        position="absolute"
        padding="0.5rem"
        margin="0.5rem"
        borderRadius="0.25rem"
        color={deadCellColor}
        fontSize="sm"
      >
        <NumberDisplay name={'width'} value={width} />
        <NumberDisplay name={'height'} value={height} />
        <NumberDisplay name={'scale (px)'} value={px} />
        <NumberDisplay name={'generation'} value={generation} />
        <NumberDisplay name={'population'} value={population} />
        <NumberDisplay name={'density'} value={`${density}%`} />
        <NumberDisplay name={'delay'} value={formatDelay(speed, msDelay)} />
        <NumberDisplay name={'fps'} value={fps} />
        <NumberDisplay name={'running'} value={isRunning ? 'yes' : 'no'} />
        <NumberDisplay
          name={'mode'}
          value={
            isInTranslateMode ? 'translate' : isInDrawMode ? 'draw' : 'view'
          }
        />
      </Box>
    </>
  );
});

export default HUD;
