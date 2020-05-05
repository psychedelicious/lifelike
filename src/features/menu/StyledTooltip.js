import React from 'react';
import { Tooltip } from '@chakra-ui/core';
import { useMediaQuery } from 'react-responsive';

import { useSelector } from 'react-redux';

const StyledTooltip = ({
  children,
  hasArrow = true,
  placement = 'top',
  ...rest
}) => {
  const { colorMode, theme } = useSelector((state) => state.theme);
  const { shouldShowTooltips } = useSelector((state) => state.menu);
  const isMobile = useMediaQuery({ maxWidth: theme.breakpoints.md });

  const bg = {
    dark: 'blue.200',
    light: 'blue.500',
  };

  const color = {
    dark: 'darkBackground',
    light: 'white',
  };

  const boxShadow = {
    dark: `0 0 0.5rem 0rem ${theme.colors.darkBackground}`,
    light: `0 0 0.5rem -.1rem ${theme.colors.blue[800]}`,
  };

  return !isMobile && shouldShowTooltips ? (
    <Tooltip
      bg={bg[colorMode]}
      color={color[colorMode]}
      fontWeight="300"
      boxShadow={boxShadow[colorMode]}
      zIndex={5}
      hasArrow={hasArrow}
      placement={placement}
      {...rest}
    >
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );
};

StyledTooltip.propTypes = {};

export default React.memo(StyledTooltip);
