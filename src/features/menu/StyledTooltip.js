import React from 'react';
import { Tooltip, useColorMode } from '@chakra-ui/core';
import { useMediaQuery } from 'react-responsive';

import { useTheme } from '@chakra-ui/core';
import { useSelector } from 'react-redux';

const StyledTooltip = ({ children, ...rest }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery({ maxWidth: theme.breakpoints.md });
  const { colorMode } = useColorMode();
  const { aliveCellColor, deadCellColor } = useSelector(
    (state) => state.theme[`${colorMode}ModeColors`]
  );

  const bg = {
    dark: 'blue.200',
    light: 'blue.500',
  };

  const color = {
    dark: aliveCellColor,
    light: 'white',
  };

  const boxShadow = {
    dark: `0 0 0.5rem 0rem ${theme.colors.darkBackground}`,
    light: `0 0 0.5rem -.1rem ${theme.colors.blue[800]}`,
  };

  return isMobile ? (
    <>{children}</>
  ) : (
    <Tooltip
      bg={bg[colorMode]}
      color={color[colorMode]}
      fontWeight="300"
      boxShadow={boxShadow[colorMode]}
      zIndex={5}
      showDelay={300}
      {...rest}
    >
      {children}
    </Tooltip>
  );
};

StyledTooltip.propTypes = {};

export default React.memo(StyledTooltip);
