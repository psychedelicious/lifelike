import React from 'react';

// animationFrame callback
// https://codesandbox.io/s/ojxl32jm4z
export const useAnimationFrame = (callback) => {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = React.useCallback(() => {
    frameRef.current = requestAnimationFrame(loop);
    const cb = callbackRef.current;
    cb();
  }, []);

  const frameRef = React.useRef();

  React.useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [loop]);

  return frameRef;
};
