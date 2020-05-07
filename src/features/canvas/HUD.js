import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';

import { Text, Flex } from '@chakra-ui/core';

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

  const { hudDisplayItems, opacity } = useSelector((state) => state.hud);

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
      py="0.5rem"
      px="1rem"
      margin="0.5rem"
      opacity={opacity}
      bg={aliveCellColor}
      borderRadius="0.15rem"
      color={deadCellColor}
      fontSize="sm"
      minH="1.5rem"
      minW="1.5rem"
    >
      {hudDisplayItems.includes('width') && (
        <NumberDisplay name={'width (cells)'} value={width} />
      )}
      {hudDisplayItems.includes('height') && (
        <NumberDisplay name={'height (cells)'} value={height} />
      )}
      {hudDisplayItems.includes('scale') && (
        <NumberDisplay name={'scale (px)'} value={px} />
      )}
      {hudDisplayItems.includes('generation') && (
        <NumberDisplay name={'generation'} value={generation} />
      )}
      {hudDisplayItems.includes('population') && (
        <NumberDisplay name={'population'} value={population} />
      )}
      {hudDisplayItems.includes('density') && (
        <NumberDisplay name={'density (%)'} value={`${density}`} />
      )}
      {hudDisplayItems.includes('delay') && (
        <NumberDisplay name={'delay'} value={formatDelay(speed, msDelay)} />
      )}
      {hudDisplayItems.includes('fps') && (
        <NumberDisplay name={'fps'} value={fps} />
      )}
      {hudDisplayItems.includes('wrap') && (
        <NumberDisplay name={'wrap'} value={shouldWrap ? 'yes' : 'no'} />
      )}
      {hudDisplayItems.includes('running') && (
        <NumberDisplay name={'running'} value={isRunning ? 'yes' : 'no'} />
      )}
      {hudDisplayItems.includes('mode') && (
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
