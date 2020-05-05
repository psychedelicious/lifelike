import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';

import { Text, Flex } from '@chakra-ui/core';
import HUDOptions from 'features/canvas/HUDOptions';

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

const HUD = () => {
  const {
    density,
    generation,
    height,
    isRunning,
    population,
    px,
    width,
    shouldWrap,
  } = useSelector((state) => state.life);

  const { hudDisplay, opacity } = useSelector((state) => state.hud);

  const { msDelay, speed, fps } = useSelector((state) => state.performance);

  const { aliveCellColor, deadCellColor } = useSelector(
    (state) => state.theme,
    shallowEqual
  );

  const { isInDrawMode, isInTranslateMode } = useSelector(
    (state) => state.drawing
  );

  return (
    <Flex
      pos="absolute"
      top="0"
      left="0"
      zIndex="3"
      direction="column"
      display="grid"
      gridTemplateColumns="auto auto"
      gridTemplateRows="auto"
      position="absolute"
      padding="0.5rem"
      pr={hudDisplay.length ? '2rem' : null}
      margin="0.5rem"
      opacity={opacity}
      bg={aliveCellColor}
      borderRadius="0.15rem"
      color={deadCellColor}
      fontSize="sm"
      minH="1.5rem"
      minW="1.5rem"
    >
      <HUDOptions
        zIndex="4"
        position="absolute"
        right={0}
        bottom={0}
        m="0.25rem"
        p="0"
        w="1rem"
        h="1rem"
        fontSize="1rem"
      />

      {hudDisplay.includes('width') && (
        <NumberDisplay name={'width (cells)'} value={width} />
      )}
      {hudDisplay.includes('height') && (
        <NumberDisplay name={'height (cells)'} value={height} />
      )}
      {hudDisplay.includes('scale') && (
        <NumberDisplay name={'scale (px)'} value={px} />
      )}
      {hudDisplay.includes('generation') && (
        <NumberDisplay name={'generation'} value={generation} />
      )}
      {hudDisplay.includes('population') && (
        <NumberDisplay name={'population'} value={population} />
      )}
      {hudDisplay.includes('density') && (
        <NumberDisplay name={'density (%)'} value={`${density}`} />
      )}
      {hudDisplay.includes('delay') && (
        <NumberDisplay name={'delay'} value={formatDelay(speed, msDelay)} />
      )}
      {hudDisplay.includes('fps') && <NumberDisplay name={'fps'} value={fps} />}
      {hudDisplay.includes('wrap') && (
        <NumberDisplay name={'wrap'} value={shouldWrap ? 'yes' : 'no'} />
      )}
      {hudDisplay.includes('running') && (
        <NumberDisplay name={'running'} value={isRunning ? 'yes' : 'no'} />
      )}
      {hudDisplay.includes('mode') && (
        <NumberDisplay
          name={'mode'}
          value={
            isInTranslateMode ? 'translate' : isInDrawMode ? 'draw' : 'view'
          }
        />
      )}
    </Flex>
  );
};

export default React.memo(HUD);
