export type message = {
  userID: string;
  type: string;
  offer: RTCSessionDescription | null;
  answer: RTCSessionDescriptionInit | null;
  candidate: RTCIceCandidate | null;
};
