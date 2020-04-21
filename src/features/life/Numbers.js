import React from 'react';

import { useSelector } from 'react-redux';

import { Flex, Text } from '@chakra-ui/core';

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
    <Flex direction="row" key={name}>
      <Text w="6rem" textAlign="right" mr=".5rem">
        {name}
      </Text>
      <Text minW="6rem">~> {value}</Text>
    </Flex>
  );
});

const Numbers = React.memo(() => {
  const density = useSelector((state) => state.life.density);
  const generation = useSelector((state) => state.life.generation);
  const height = useSelector((state) => state.life.height);
  const msDelay = useSelector((state) => state.life.msDelay);
  const speed = useSelector((state) => state.life.speed);
  const fps = useSelector((state) => state.life.fps);
  const population = useSelector((state) => state.life.population);
  const px = useSelector((state) => state.life.px);
  const width = useSelector((state) => state.life.width);

  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '2',
        padding: '0.25rem',
        margin: '0.5rem',
        borderRadius: '0.25rem',
        backgroundColor: '#34202ebb',
        color: 'rgb(255,255,255)',
        fontSize: '0.875rem',
      }}
    >
      <NumberDisplay name={'width'} value={width} />
      <NumberDisplay name={'height'} value={height} />
      <NumberDisplay name={'scale (px)'} value={px} />
      <NumberDisplay name={'generation'} value={generation} />
      <NumberDisplay name={'population'} value={population} />
      <NumberDisplay name={'density'} value={`${density}%`} />
      <NumberDisplay name={'delay'} value={formatDelay(speed, msDelay)} />
      <NumberDisplay name={'fps'} value={fps} />
    </div>
  );
});

export default Numbers;
