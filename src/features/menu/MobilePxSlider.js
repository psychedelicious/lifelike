import React from 'react';
import PropTypes from 'prop-types';
import { GiResize } from 'react-icons/gi';

import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorMode,
} from '@chakra-ui/core';
import { useSelector } from 'react-redux';

export const MobilePxSlider = ({ onChange, isDisabled, ...rest }) => {
  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? 'gray.50' : 'blue.100';
  const color = colorMode === 'light' ? 'blue.600' : 'blue.800';

  const px = useSelector((state) => state.life.px);
  const minPx = useSelector((state) => state.life.minPx);
  const maxPx = useSelector((state) => state.life.maxPx);

  return (
    <Slider
      {...rest}
      flex="1"
      value={px}
      min={minPx}
      max={maxPx}
      onChange={onChange}
      isDisabled={isDisabled}
      w="calc(100% - 2rem)"
      alignSelf="center"
    >
      <SliderTrack />
      <SliderFilledTrack />
      <SliderThumb size={6} borderRadius="sm" border="1px " bg={bg}>
        <Box as={GiResize} color={color} />
      </SliderThumb>
    </Slider>
  );
};

MobilePxSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default React.memo(MobilePxSlider);
