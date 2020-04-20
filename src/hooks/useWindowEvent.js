import React from 'react';

export const useWindowEvent = (event, callback) => {
  React.useEffect(() => {
    window.addEventListener(event, callback);
    return () => window.removeEventListener(event, callback);
  }, [event, callback]);
};

export const useGlobalMouseUp = (callback) => {
  return useWindowEvent('mouseup', callback);
};

export const useGlobalMouseMove = (callback) => {
  return useWindowEvent('mousemove', callback);
};

export const useGlobalKeyDown = (callback) => {
  return useWindowEvent('keydown', callback);
};

export const useWithModifiers = () => {
  return (e) => {
    return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
  };
};
