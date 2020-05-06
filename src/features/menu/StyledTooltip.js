import React from 'react';
import { Tooltip } from '@chakra-ui/core';
import { useMediaQuery } from 'react-responsive';

import { useSelector } from 'react-redux';

const StyledTooltip = ({
  label,
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
    light: 'lightBackground',
  };

  const boxShadow = {
    dark: `0 0 0.5rem 0rem ${theme.colors.darkBackground}70`,
    light: `0 0 0.25rem 0rem ${theme.colors.darkBackground}70`,
  };

  return !isMobile && shouldShowTooltips && label ? (
    <Tooltip
      bg={bg[colorMode]}
      color={color[colorMode]}
      fontWeight="300"
      boxShadow={boxShadow[colorMode]}
      zIndex={1500}
      hasArrow={hasArrow}
      placement={placement}
      label={label}
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
