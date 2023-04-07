import { api } from "@/src/utils/api";
import { Button } from "@nextui-org/react";
import {
  Server_Channel,
  Server,
  Server_Member,
  Server_Admin,
  User,
  WSConnection,
} from "@prisma/client";
import { useContext, useEffect, useRef, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import TopBanner from "./TopBanner";

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
  stream: MediaStream | null;
  audioContext: AudioContext | null;
  fullscreen: boolean;
}

export default function VoiceChannel(props: VoiceChannelProps) {
  const {
    selectedChannel,
    currentUser,
    socket,
    stream,
    microphoneState,
    audioState,
    audioContext,
    fullscreen,
  } = props;

  const { isDarkTheme } = useContext(ThemeContext);
  const [userJoined, setUserJoined] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const disconnectWS = api.websocket.disconnectWsFromChannel.useMutation();
  const bodySizing = width > 768 ? `${width - 286}px` : `${width - 175}px`;
  const joinOrLeaveCallMutation = api.websocket.joinOrLeaveCall.useMutation();

  const [webSocketsInCall, setWebSocketsInCall] = useState<
    | (WSConnection & {
        user: User;
      })[]
  >([]);

  const [webSocketsInChannel, setWebSocketsInChannel] = useState<
    | (WSConnection & {
        user: User;
      })[]
  >([]);

  const connectedWSQuery = api.websocket.wssConnectedToChannel.useQuery(
    selectedChannel.id
  );

  const [peerConnections, setPeerConnections] = useState<
    Map<string, RTCPeerConnection>
  >(new Map());

  useEffect(() => {
    if (connectedWSQuery.data) {
      setWebSocketsInChannel(connectedWSQuery.data);
    }
  }, [connectedWSQuery]);

  useEffect(() => {
    if (webSocketsInChannel) {
      const wsInCall = webSocketsInChannel.filter(
        (connection) => connection.inCall
      );
      const userInCallBoolean = wsInCall.some(
        (connection) => connection.user.id === currentUser.id
      );
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

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === "signal") {
          handleSignalMessage(data);
        }
      };
    }
  }, [socket, peerConnections]);

  const joinCall = async () => {
    if (socket) {
      await joinOrLeaveCallMutation.mutateAsync({
        newState: true,
        channelID: selectedChannel.id,
      });
      await connectedWSQuery.refetch();

      webSocketsInCall.forEach(async (websocket) => {
        const targetSocket = websocket.connectionID;
        const peerConnection = new RTCPeerConnection();
        handlePeerConnection(targetSocket, peerConnection);

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.send(
          JSON.stringify({
            action: "audio",
            requestType: "signal",
            targetConnectionID: targetSocket,
            data: JSON.stringify({ type: "offer", offer: offer }),
          })
        );

        setPeerConnections(
          (prevConnections) =>
            new Map(prevConnections.set(targetSocket, peerConnection))
        );
      });
    }
  };

  const handlePeerConnection = async (
    targetSocket: string,
    peerConnection: RTCPeerConnection
  ) => {
    const dataChannel = peerConnection.createDataChannel("chat");

    dataChannel.onmessage = (event) => {
      console.log("DataChannel message:", event.data);
    };

    dataChannel.onopen = () => {
      console.log("DataChannel opened.");
    };

    dataChannel.onclose = () => {
      console.log("DataChannel closed.");
    };

    let iceCandidates: RTCIceCandidate[] = [];
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate && socket) {
        iceCandidates.push(event.candidate);
      } else {
        // The event.candidate is null, which means the ICE gathering process has completed
        if (iceCandidates.length > 0) {
          // Send all the candidates in a single message
          socket?.send(
            JSON.stringify({
              action: "audio",
              requestType: "signal",
              targetConnectionID: targetSocket,
              data: JSON.stringify({
                type: "candidates",
                candidates: iceCandidates,
              }),
            })
          );
          iceCandidates = [];
        }
      }
    };

    peerConnection.ontrack = async (event) => {
      console.log("ontrack triggered");
      const remoteAudioStream = new MediaStream();
      if (event.streams[0]) {
        console.log("if check passed");
        event.streams[0].getTracks().forEach((track) => {
          remoteAudioStream.addTrack(track);
        });
      } else {
        console.error("No media stream found.");
      }
    };

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    }
  };

  const handleSignalMessage = async (data: any) => {
    const targetSocket = data.from;

    let peerConnection = peerConnections.get(targetSocket);

    console.log("Current peer connections :" + peerConnections);

    if (!peerConnection) {
      peerConnection = new RTCPeerConnection();
      handlePeerConnection(targetSocket, peerConnection);
      setPeerConnections(
        (prevConnections) =>
          new Map(
            prevConnections.set(
              targetSocket,
              peerConnection as RTCPeerConnection
            )
          )
      );
    }

    if (data.signal.type === "offer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.signal.offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket?.send(
        JSON.stringify({
          action: "audio",
          requestType: "signal",
          targetConnectionID: targetSocket,
          data: JSON.stringify({ type: "answer", answer: answer }),
        })
      );
      console.log("answer sent");
    } else if (data.signal.type === "answer") {
      console.log("answer found");
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.signal.answer)
      );
    } else if (data.signal.type === "candidate") {
      const candidate = new RTCIceCandidate(data.signal.candidate);
      await peerConnection.addIceCandidate(candidate);
    }
  };

  const leaveCall = async () => {
    peerConnections.forEach((peerConnection) => {
      peerConnection.close();
    });
    setPeerConnections(new Map());

    await joinOrLeaveCallMutation.mutateAsync({
      newState: false,
      channelID: selectedChannel.id,
    });
    await connectedWSQuery.refetch();
    await disconnectWS.mutateAsync();
  };
  return (
    <div className="">
      <TopBanner currentChannel={selectedChannel} fullscreen={fullscreen} />
      <div
        className={`scrollXDisabled h-screen overflow-y-hidden rounded bg-zinc-50 pt-14 dark:bg-zinc-900`}
        style={{ width: fullscreen ? "100vw" : bodySizing }}
      >
        <div className="pt-8 text-center text-lg">
          {webSocketsInCall && webSocketsInCall?.length !== 0
            ? "Currently in Channel:"
            : "No one's here... yet"}
        </div>
        {webSocketsInCall ? (
          <div className={`grid grid-cols-5 justify-center`}>
            {webSocketsInCall.map((websocket) => (
              <div className="px-4 py-6" key={websocket.user.id}>
                <div className="flex h-24 w-24 rounded-full border md:h-36 md:w-36">
                  <div className="flex flex-col">
                    <button>
                      <img
                        src={
                          websocket.user.image
                            ? websocket.user.image
                            : websocket.user.pseudonym_image
                            ? websocket.user.pseudonym_image
                            : "/Logo - light.png"
                        }
                        alt={"user-logo"}
                        className="rounded-full"
                      />
                      <div className="pl-4">{websocket.user.name}</div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {!userJoined ? (
          <div className="flex h-screen flex-col justify-center">
            <div className="flex justify-center pb-4">
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
            </div>
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
        ) : (
          <>
            <div className="flex content-center justify-center ">
              {microphoneState ? (
                <Button auto onClick={props.microphoneToggle} className="mx-2">
                  Turn Mic Off
                </Button>
              ) : (
                <Button auto onClick={props.microphoneToggle}>
                  Turn Mic On
                </Button>
              )}
              {audioState ? (
                <Button auto onClick={props.audioToggle}>
                  Turn Sound Off
                </Button>
              ) : (
                <Button auto onClick={props.audioToggle}>
                  Turn Sound On
                </Button>
              )}
            </div>
            <div className="absolute bottom-4 pl-4">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
