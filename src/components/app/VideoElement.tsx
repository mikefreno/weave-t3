import React, { useEffect, useRef, useState } from "react";

interface VideoElementProps {
  peerUserID: string;
  stream: MediaStream | null;
  currentUserID: string;
  videoTrackState: boolean;
  isLocal: boolean;
  deafen: boolean;
  peerCount: number;
}

const gridMap = new Map<number, string>([
  [0, "h-full"],
  [2, "h-1/2"],
  [2, "h-1/2"],
  [3, "h-1/2"],
  [4, "h-1/2"],
  [5, "h-1/3"],
  [6, "h-1/3"],
]);

export default function VideoElement(props: VideoElementProps) {
  const { peerUserID, stream, currentUserID, videoTrackState, isLocal, deafen, peerCount } = props;
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
      className={`${gridMap.get(peerCount)} z-50 rounded-md ${currentUserID === peerUserID ? "scale-x-[-1]" : null} ${
        videoTrackState ? "visible" : "invisible"
      }`}
    />
  );
}
