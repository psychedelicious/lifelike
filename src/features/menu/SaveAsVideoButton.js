import React from 'react';
import PropTypes from 'prop-types';

import { IoMdVideocam } from 'react-icons/io';
import { MdFiberManualRecord } from 'react-icons/md';

import { IconButton } from '@chakra-ui/core';
import StyledTooltip from './StyledTooltip';

export const SaveAsVideoButton = ({ canvasBaseLayerRef }) => {
  const [isRecordingVideo, setIsRecordingVideo] = React.useState(false);

  const recorder = React.useRef();
  const stream = React.useRef();

  const exportVid = React.useCallback((blob) => {
    const a = document.createElement('a');
    const uid = Math.random().toString(36).substr(2, 9);
    a.download = `lifelike_${uid}.webm`;
    a.href = URL.createObjectURL(blob);
    a.click();
  }, []);

  const startRecording = React.useCallback(
    (canvas) => {
      const chunks = []; // here we will store our recorded media chunks (Blobs)
      let mimeType;
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      }

      stream.current = canvas.captureStream(); // grab our canvas MediaStream

      recorder.current = new MediaRecorder(stream.current, {
        videoBitsPerSecond: 10000000,
        mimeType,
      }); // init the recorder
      // every time the recorder has new data, we will store it in our array
      recorder.current.ondataavailable = (e) =>
        e.data && e.data.size > 0 && chunks.push(e.data);
      // only when the recorder stops, we construct a complete Blob from all the chunks
      recorder.current.onstop = (e) =>
        exportVid(new Blob(chunks, { type: 'video/webm' }));
      recorder.current.start();
    },
    [exportVid]
  );

  const handleStartCapture = React.useCallback(() => {
    startRecording(canvasBaseLayerRef.current);
    setIsRecordingVideo(true);
  }, [startRecording, canvasBaseLayerRef]);

  const handleStopCapture = React.useCallback(() => {
    setIsRecordingVideo(false);
    recorder.current.stop();
  }, []);

  return (
    <StyledTooltip
      label={isRecordingVideo ? 'stop recording & download' : 'start recording'}
      placement="top"
      hasArrow
    >
      <IconButton
        icon={isRecordingVideo ? MdFiberManualRecord : IoMdVideocam}
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr="0.5rem"
        variant="link"
        variantColor={isRecordingVideo ? 'red' : 'blue'}
        aria-label="save as video"
        onClick={isRecordingVideo ? handleStopCapture : handleStartCapture}
      />
    </StyledTooltip>
  );
};

SaveAsVideoButton.propTypes = {
  canvasBaseLayerRef: PropTypes.object.isRequired,
};

export default React.memo(SaveAsVideoButton);
