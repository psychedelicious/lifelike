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

  const bg = colorMode === 'light' ? 'blue.500' : 'blue.200';

  const color = colorMode === 'light' ? 'lightBackground' : 'darkBackground';

  const boxShadow =
    colorMode === 'light'
      ? `0 0 0.25rem 0rem ${theme.colors.darkBackground}70`
      : `0 0 0.5rem 0rem ${theme.colors.darkBackground}70`;

  return !isMobile && shouldShowTooltips && label ? (
    <Tooltip
      bg={bg}
      color={color}
      fontWeight="300"
      boxShadow={boxShadow}
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
