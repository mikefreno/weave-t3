import React, { useEffect, useRef } from "react";

interface VideoElementProps {
  peerUserID: string;
  stream: MediaStream | null;
  currentUserID: string;
}

const VideoElement: React.FC<VideoElementProps> = ({
  peerUserID,
  stream,
  currentUserID,
}) => {
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
      className={`absolute z-50 h-64 rounded-md ${
        currentUserID === peerUserID ? "scale-x-[-1]" : null
      }`}
    />
  );
};

export default VideoElement;
