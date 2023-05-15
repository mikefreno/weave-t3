import { api } from "@/src/utils/api";
import { Button, Loading } from "@nextui-org/react";
import { Server_Channel, Server, Server_Member, Server_Admin, User, WSConnection } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import TopBanner from "./TopBanner";
import VideoElement from "./VideoElement";
import { message } from "@/src/types/types";

interface VoiceChannelProps {
  selectedChannel: Server_Channel;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  socket: WebSocket | null;
  microphoneState: boolean;
  audioState: boolean;
  audioToggle: () => void;
  microphoneToggle: () => void;
  socketChannelUpdate: () => Promise<void>;
}

const constraints = {
  audio: true,
  video: true,
};

export default function VoiceChannel(props: VoiceChannelProps) {
  // prettier-ignore
  const {selectedChannel, currentUser, socket, microphoneState, audioState, socketChannelUpdate} = props;
  //state
  const [userJoined, setUserJoined] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [joinButtonLoadingState, setJoinButtonLoadingState] = useState(false);
  const [leaveButtonLoadingState, setLeaveButtonLoadingState] = useState(false);
  const [cameraState, setCameraState] = useState<boolean>(false);
  const [checkCamButtonLoading, setCheckCamButtonLoading] = useState<boolean>(false);
  const [webSocketsInCall, setWebSocketsInCall] = useState<(WSConnection & { user: User })[]>([]);
  const [webSocketsInChannel, setWebSocketsInChannel] = useState<(WSConnection & { user: User })[]>([]);

  const [videoTrackStatus, setVideoTrackStatus] = useState<Map<string, boolean>>(new Map());
  const [peerStreams, setPeerStreams] = useState<Map<string, MediaStream>>(new Map());
  const [videoTrackStates, setVideoTrackStates] = useState<Map<string, boolean>>(new Map());
  const [audioTrackStates, setAudioTrackStates] = useState<Map<string, boolean>>(new Map());
  //ref
  const stream = useRef<MediaStream>(new MediaStream());
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  //trpc (api)
  const connectedWSQuery = api.websocket.wssConnectedToChannel.useQuery(selectedChannel.id);
  const joinOrLeaveCallMutation = api.websocket.joinOrLeaveCall.useMutation();

  const bodySizing = width > 768 ? `${width - 286}px` : `${width - 175}px`;

  useEffect(() => {
    if (connectedWSQuery.data) {
      setWebSocketsInChannel(connectedWSQuery.data);
    }
  }, [connectedWSQuery]);

  useEffect(() => {
    if (webSocketsInChannel) {
      const wsInCall = webSocketsInChannel.filter((connection) => connection.inCall);
      const userInCallBoolean = wsInCall.some((connection) => connection.user.id === currentUser.id);
      setUserJoined(userInCallBoolean);
      setWebSocketsInCall(wsInCall);
    }
  }, [webSocketsInChannel]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //signalling server handler
  useEffect(() => {
    socketOnMessage();
  }, [socket]);

  const socketOnMessage = () => {
    if (socket) {
      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data) as message | null;
        if (data && data.userID && data.type) {
          const senderID = data.userID;
          const sendingConnection = peerConnections.current?.get(senderID);

          switch (data.type) {
            case "join":
              await connectedWSQuery.refetch();
              break;

            case "offer":
              console.log("receive offer");
              await addPeer(senderID, false);
              const newPeer = peerConnections.current.get(senderID);
              if (newPeer && data.offer) {
                await newPeer.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await newPeer.createAnswer();
                await newPeer.setLocalDescription(answer);
                console.log("Sending answer");
                socket.send(
                  JSON.stringify({
                    action: "audio",
                    type: "answer",
                    userID: currentUser.id,
                    targetUserID: senderID,
                    answer: newPeer.localDescription,
                  })
                );
              } else {
                console.error("Peer Creation Failed!");
                console.log(peerConnections.current);
              }

              break;
            case "answer":
              console.log("receive answer");
              if (sendingConnection && data.answer) {
                await sendingConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
              } else {
                console.error("Peer Creation Failed!");
                console.log(peerConnections.current);
              }
              break;

            case "ice-candidate":
              console.log("received ice candidate");
              if (sendingConnection) {
                if (sendingConnection.remoteDescription && data.candidate) {
                  await sendingConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                } else {
                  console.error("Remote description is not set yet. Ignoring ICE candidate.");
                }
              }
              break;

            case "leave":
              removePeer(senderID);
              await connectedWSQuery.refetch();
              break;
          }
        }
      };
    }
  };

  const addPeer = async (peerUserID: string, initiator: boolean) => {
    const newPeerConnection = new RTCPeerConnection();

    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log("sending ice candidate");
        socket.send(
          JSON.stringify({
            action: "audio",
            type: "ice-candidate",
            userID: currentUser.id,
            targetUserID: peerUserID,
            candidate: event.candidate,
          })
        );
      }
    };

    stream.current.getTracks().forEach((track) => {
      console.log("adding local stream");
      newPeerConnection.addTrack(track, stream.current);
    });

    if (initiator) {
      const offer = await newPeerConnection.createOffer();
      await newPeerConnection.setLocalDescription(offer);

      console.log("Sending offer");
      socket?.send(
        JSON.stringify({
          action: "audio",
          type: "offer",
          userID: currentUser.id,
          targetUserID: peerUserID,
          offer: newPeerConnection.localDescription,
        })
      );
    }

    newPeerConnection.ontrack = (event) => {
      if (event.streams[0]) {
        console.log("adding remote stream");
        setPeerStreams((prevStreams) => {
          const newStreams = new Map(prevStreams);
          newStreams.set(peerUserID, event.streams[0] as MediaStream);
          return newStreams;
        });

        const videoTrack = event.streams[0].getVideoTracks()[0];
        const videoTrackEnabled = videoTrack?.enabled || false;
        setVideoTrackStates((prevVideoTrackStates) => {
          const newVideoTrackStates = new Map(prevVideoTrackStates);
          newVideoTrackStates.set(peerUserID, videoTrackEnabled);
          return newVideoTrackStates;
        });
      }
    };

    newPeerConnection.oniceconnectionstatechange = async () => {
      console.log(`ICE connection state with ${peerUserID} changed to: ${newPeerConnection.iceConnectionState}`);
    };

    peerConnections.current?.set(peerUserID, newPeerConnection);
    return newPeerConnection;
  };
  //peer video handling
  const updateVideoTrackListeners = (peerUserID: string, videoTrack: MediaStreamTrack) => {
    videoTrack.onmute = () => {
      console.log(`Video track muted for user ${peerUserID}`);
      setVideoTrackStates((prevVideoTrackStates) => {
        const newVideoTrackStates = new Map(prevVideoTrackStates);
        newVideoTrackStates.set(peerUserID, false);
        return newVideoTrackStates;
      });
    };

    videoTrack.onunmute = () => {
      console.log(`Video track unmuted for user ${peerUserID}`);
      setVideoTrackStates((prevVideoTrackStates) => {
        const newVideoTrackStates = new Map(prevVideoTrackStates);
        newVideoTrackStates.set(peerUserID, true);
        return newVideoTrackStates;
      });
    };
  };

  useEffect(() => {
    peerStreams.forEach((stream, peerUserID) => {
      const videoTrack = stream.getVideoTracks()[0];

      if (videoTrack) {
        updateVideoTrackListeners(peerUserID, videoTrack);
      }
    });
  }, [peerStreams]);

  const removePeer = (peerUserID: string) => {
    const peerConnection = peerConnections.current?.get(peerUserID);
    if (peerConnection) {
      // Close the RTCPeerConnection
      peerConnection.close();
    }
    peerConnections.current?.delete(peerUserID);
    setVideoTrackStatus((prevStatus) => {
      const updatedStatus = new Map(prevStatus);
      updatedStatus.delete(peerUserID);
      return updatedStatus;
    });
  };

  const joinCall = async () => {
    try {
      setJoinButtonLoadingState(true);
      stream.current = await navigator.mediaDevices.getUserMedia(constraints);

      await joinOrLeaveCallMutation.mutateAsync({
        newState: true,
        channelID: selectedChannel.id,
      });

      await connectedWSQuery.refetch();

      socket?.send(
        JSON.stringify({
          action: "audio",
          type: "join",
          userID: currentUser.id,
        })
      );

      await Promise.all(
        webSocketsInCall.map(async (socket) => {
          await addPeer(socket.user.id, true);
        })
      );

      setJoinButtonLoadingState(false);
    } catch (err) {
      console.log(err);
    }
  };

  const leaveCall = async () => {
    setLeaveButtonLoadingState(true);
    await joinOrLeaveCallMutation.mutateAsync({
      newState: false,
      channelID: selectedChannel.id,
    });
    socket?.send(
      JSON.stringify({
        action: "audio",
        type: "leave",
        userID: currentUser.id,
      })
    );
    await connectedWSQuery.refetch();
    stream.current.getTracks().forEach((track) => track.stop());
    setLeaveButtonLoadingState(false);
  };

  useEffect(() => {
    return () => {
      joinOrLeaveCallMutation.mutate({
        newState: false,
        channelID: selectedChannel.id,
      });
      socket?.send(
        JSON.stringify({
          action: "audio",
          type: "leave",
          userID: currentUser.id,
        })
      );
      stream.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Helper functions to enable/disable tracks
  const setAudioTracksState = (state: boolean) => {
    stream.current.getAudioTracks().forEach((track) => {
      track.enabled = state;
    });
  };

  const setVideoTracksState = (state: boolean) => {
    stream.current.getVideoTracks().forEach((track) => {
      track.enabled = state;
    });
  };

  // Update tracks states when microphoneState or cameraState change
  useEffect(() => {
    setAudioTracksState(microphoneState);
    setVideoTracksState(cameraState);
  }, [microphoneState, cameraState, stream, userJoined]);

  const cameraToggle = () => {
    setCameraState(!cameraState);
  };

  // Handle camera state changes
  useEffect(() => {
    if (cameraState) {
      setupChecker();
    } else if (!userJoined) {
      stream.current.getTracks().forEach((track) => track.stop());
    } else {
      setVideoTracksState(cameraState);
    }
  }, [cameraState]);

  const setupChecker = async () => {
    setCheckCamButtonLoading(true);
    if (!userJoined) {
      try {
        stream.current = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {}
    }
    setCheckCamButtonLoading(false);
  };

  //ui
  const joinCallButton = () => {
    if (joinButtonLoadingState) {
      return (
        <Button auto shadow size={"lg"} animated disabled>
          <Loading type="points" />
        </Button>
      );
    } else {
      return (
        <Button
          auto
          shadow
          size={"lg"}
          color="secondary"
          onClick={() => {
            joinCall();
          }}
          animated
        >
          <div className="px-12">Join</div>
        </Button>
      );
    }
  };

  const leaveCallButton = () => {
    if (leaveButtonLoadingState) {
      return (
        <Button auto shadow size={"lg"} animated disabled>
          <Loading type="points" />
        </Button>
      );
    } else {
      return (
        <Button
          auto
          shadow
          size={"lg"}
          color="secondary"
          onClick={() => {
            leaveCall();
          }}
          animated
        >
          <div className="">Leave</div>
        </Button>
      );
    }
  };

  const checkCamButton = () => {
    if (checkCamButtonLoading) {
      return (
        <button className="h-12 w-20 rounded-xl bg-zinc-300 dark:bg-zinc-800">
          <div className="my-auto">
            <Loading type="points" />
          </div>
        </button>
      );
    } else {
      if (cameraState) {
        return (
          <button
            onClick={cameraToggle}
            className="rounded-xl bg-purple-700 text-white shadow-md shadow-purple-500 hover:bg-purple-800 hover:shadow-purple-600 active:bg-purple-900 active:shadow-purple-700"
          >
            <div className="px-4 py-2">Switch off</div>
          </button>
        );
      } else {
        return (
          <button
            onClick={cameraToggle}
            className="rounded-xl bg-purple-700 text-white shadow-md shadow-purple-500 hover:bg-purple-800 hover:shadow-purple-600 active:bg-purple-900 active:shadow-purple-700"
          >
            <div className="px-4 py-2">Check Camera</div>
          </button>
        );
      }
    }
  };

  return (
    <div className="">
      <TopBanner key={selectedChannel.id} selectedChannel={selectedChannel} />
      <div className={`scrollXDisabled h-screen overflow-y-hidden rounded bg-zinc-50 pt-14 dark:bg-zinc-900`}>
        <div className="pt-8 text-center text-lg">
          {webSocketsInCall && webSocketsInCall?.length !== 0 ? "Currently in Channel:" : "No one's here... yet"}
        </div>
        <div className="absolute flex w-full justify-center">
          <div className="flex flex-col text-center">
            <div className="text-2xl text-purple-600 dark:text-purple-400">
              {microphoneState ? "" : userJoined ? "You are Muted" : ""}
            </div>
            <div className="text-2xl text-purple-600 dark:text-purple-400">
              {audioState ? "" : userJoined ? "You are Deafened" : ""}
            </div>
          </div>
        </div>
        {webSocketsInCall.length === 6 ? (
          <div className="py-4 text-center text-sm italic">Currently voice calls only support up to 6 people.</div>
        ) : null}
        {webSocketsInCall ? (
          <div className="flex h-[60vh] justify-center px-4 pb-8 pt-12 md:px-6 lg:px-10 xl:px-12">
            {webSocketsInCall.map((websocket) => (
              <div className="m-4 h-64 w-5/12 rounded-xl bg-purple-200 dark:bg-zinc-700" key={websocket.user.id}>
                <VideoElement
                  peerUserID={websocket.user.id}
                  stream={peerStreams.get(websocket.user.id) || stream.current}
                  currentUserID={currentUser.id}
                  videoTrackState={videoTrackStates.get(websocket.user.id) || cameraState}
                  isLocal={currentUser.id === websocket.user.id}
                  deafen={!audioState}
                />
                <div className="flex justify-center px-6 py-4">
                  <button className="flex flex-col content-center justify-center">
                    <img
                      src={
                        websocket.user.image
                          ? websocket.user.image
                          : websocket.user.pseudonym_image
                          ? websocket.user.pseudonym_image
                          : "/Logo - light.png"
                      }
                      alt={"user-logo"}
                      className="h-24 w-24 rounded-full md:h-36 md:w-36"
                    />
                    <div className="mx-auto pt-4 text-black">{websocket.user.name}</div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {!userJoined ? (
          <>
            {cameraState ? (
              <div className="absolute top-36 flex w-full justify-center">
                <div className="h-[300px] w-[400px]">
                  <div className="flex content-center justify-center">
                    <Loading css={{ zIndex: 0 }} />
                  </div>
                  <div className="-mt-8 flex justify-center">
                    <VideoElement
                      peerUserID={currentUser.id}
                      stream={stream.current}
                      currentUserID={currentUser.id}
                      videoTrackState={cameraState}
                      isLocal={!microphoneState}
                      deafen={!audioState}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="absolute right-24 -mt-24">{checkCamButton()}</div>
            <div className="flex flex-col justify-center">
              <div className="flex justify-center pb-4">{joinCallButton()}</div>
              <div className="flex flex-col">
                {microphoneState ? (
                  <button
                    onClick={props.microphoneToggle}
                    className="underline-offset-4 hover:text-purple-400 hover:underline"
                  >
                    Turn Mic Off
                  </button>
                ) : (
                  <button
                    onClick={props.microphoneToggle}
                    className="underline-offset-4 hover:text-purple-400 hover:underline"
                  >
                    Turn Mic On
                  </button>
                )}
                {audioState ? (
                  <button
                    onClick={props.audioToggle}
                    className="underline-offset-4 hover:text-purple-400 hover:underline"
                  >
                    Turn Sound Off
                  </button>
                ) : (
                  <button
                    onClick={props.audioToggle}
                    className="underline-offset-4 hover:text-purple-400 hover:underline"
                  >
                    Turn Sound On
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="">
              <div className="flex justify-center">
                {microphoneState ? (
                  <div className="px-2">
                    <Button auto onClick={props.microphoneToggle}>
                      Turn Mic Off
                    </Button>
                  </div>
                ) : (
                  <div className="px-2">
                    <Button auto onClick={props.microphoneToggle} className="px-2">
                      Turn Mic On
                    </Button>
                  </div>
                )}
                {audioState ? (
                  <div className="px-2">
                    <Button auto onClick={props.audioToggle} className="px-2">
                      Turn Sound Off
                    </Button>
                  </div>
                ) : (
                  <div className="px-2">
                    <Button auto onClick={props.audioToggle} className="px-2">
                      Turn Sound On
                    </Button>
                  </div>
                )}
                {cameraState ? (
                  <div className="px-2">
                    <Button auto onClick={cameraToggle}>
                      Turn Camera Off
                    </Button>
                  </div>
                ) : (
                  <div className="px-2">
                    <Button auto onClick={cameraToggle} className="px-2">
                      Turn Camera On
                    </Button>
                  </div>
                )}
              </div>
              <div className="pl-12 pt-4">{leaveCallButton()}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
