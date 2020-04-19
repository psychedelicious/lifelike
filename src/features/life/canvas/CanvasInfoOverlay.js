import React from 'react';

import { shallowEqual, useSelector } from 'react-redux';

const CanvasInfoOverlay = React.memo(({ ...rest }) => {
  const { canvasOverlayText, isRunning } = useSelector(
    (state) => ({
      canvasOverlayText: state.life.canvasOverlayText,
      isRunning: state.life.isRunning,
      inEditMode: state.life.inEditMode,
    }),
    shallowEqual
  );

  return (
    <div
      {...rest}
      style={{
        display: !isRunning && canvasOverlayText.length ? 'block' : 'none',
        touchAction: 'none',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '2',
        padding: '0.25rem',
        margin: '0.5rem',
        borderRadius: '0.25rem',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'rgb(255,255,255)',
        fontSize: '0.875rem',
      }}
    >
      {canvasOverlayText.map((text, i) => (
        <div key={`canvasOverlayText${i}`}>{text}</div>
      ))}
    </div>
  );
});

export default CanvasInfoOverlay;
