import React, { useEffect, useRef } from "react";

interface VideoElementProps {
  peerUserID: string;
  stream: MediaStream | null;
  currentUserID: string;
  videoTrackState: boolean;
  isLocal: boolean;
  deafen: boolean;
}

export default function VideoElement(props: VideoElementProps) {
  const {
    peerUserID,
    stream,
    currentUserID,
    videoTrackState,
    isLocal,
    deafen,
  } = props;
  const videoElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoElementRef.current) {
      videoElementRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoElementRef}
      autoPlay
      playsInline
      muted={isLocal || deafen ? true : false}
      className={`absolute z-50 h-64 rounded-md ${
        currentUserID === peerUserID ? "scale-x-[-1]" : null
      } ${videoTrackState ? "visible" : "invisible"}`}
    />
  );
}
