import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { Box, useColorMode } from '@chakra-ui/core';

import Lifelike from 'features/life/Lifelike';
import Loading from 'components/Loading';
import { lifelikeTheme } from 'theme';
import { setThemeColor } from 'store/reducers/theme';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();

  const { shouldSwapCellColors, themeColor } = useSelector(
    (state) => state.theme
  );

  const themeSetRef = React.useRef(false);

  React.useEffect(() => {
    dispatch(setThemeColor({ colorMode, shouldSwapCellColors, themeColor }));
    themeSetRef.current = true;
  }, [dispatch, colorMode, shouldSwapCellColors, themeColor]);

  const isMobile = useMediaQuery({ maxWidth: lifelikeTheme.breakpoints.md });

  return (
    <>
      {themeSetRef.current ? (
        <Box
          w="100%"
          minH="100%"
          px={isMobile ? '0.75rem' : '1rem'}
          py={isMobile ? '0.5rem' : '1rem'}
        >
          <Lifelike isMobile={isMobile} colorMode={colorMode} />
        </Box>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default React.memo(App);
