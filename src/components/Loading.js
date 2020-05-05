import React from 'react';
import { Flex, Spinner } from '@chakra-ui/core';

const Loading = () => {
  return (
    <Flex w="100vw" h="100vh" justify="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  );
};

export default Loading;
