import React from 'react';
import PropTypes from 'prop-types';

import { IoMdVideocam, IoMdPlay, IoMdPause } from 'react-icons/io';
import { MdFiberManualRecord } from 'react-icons/md';

import { IconButton } from '@chakra-ui/core';

export const SaveAsVideoButton = ({ canvasBaseLayerRef }) => {
  const [recordingState, setRecordingState] = React.useState('stopped');

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
    setRecordingState('recording');
  }, [startRecording, canvasBaseLayerRef]);

  const handleStopCapture = React.useCallback(() => {
    recorder.current.stop();
    setRecordingState('stopped');
  }, []);

  const handlePauseCapture = React.useCallback(() => {
    recorder.current.pause();
    setRecordingState('paused');
  }, []);

  const handleResumeCapture = React.useCallback(() => {
    recorder.current.resume();
    setRecordingState('recording');
  }, []);

  return (
    <>
      <IconButton
        icon={
          recordingState === 'recording' || recordingState === 'paused'
            ? MdFiberManualRecord
            : IoMdVideocam
        }
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr={recordingState !== 'stopped' ? '0.25rem' : '0.5rem'}
        variant="link"
        variantColor={
          recordingState === 'recording' || recordingState === 'paused'
            ? 'secondary'
            : 'blue'
        }
        aria-label="save as video"
        onClick={
          recordingState === 'recording' || recordingState === 'paused'
            ? handleStopCapture
            : handleStartCapture
        }
      />
      {(recordingState === 'recording' || recordingState === 'paused') && (
        <IconButton
          icon={recordingState === 'recording' ? IoMdPause : IoMdPlay}
          fontSize="1.5rem"
          p={0}
          h="unset"
          mr="0.5rem"
          minW="unset"
          variant="link"
          variantColor="blue"
          aria-label="pause/resume recording"
          onClick={
            recordingState === 'recording'
              ? handlePauseCapture
              : handleResumeCapture
          }
        />
      )}
    </>
  );
};

SaveAsVideoButton.propTypes = {
  canvasBaseLayerRef: PropTypes.object.isRequired,
};

export default React.memo(SaveAsVideoButton);
