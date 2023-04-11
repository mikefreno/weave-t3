import { api } from "@/src/utils/api";
import { Button, Loading } from "@nextui-org/react";
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
    fullscreen,
  } = props;

  const { isDarkTheme } = useContext(ThemeContext);
  const [userJoined, setUserJoined] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const disconnectWS = api.websocket.disconnectWsFromChannel.useMutation();
  const bodySizing = width > 768 ? `${width - 286}px` : `${width - 175}px`;
  const joinOrLeaveCallMutation = api.websocket.joinOrLeaveCall.useMutation();
  const [joinButtonState, setJoinButtonState] = useState(false);
  const [leaveButtonState, setLeaveButtonState] = useState(false);

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

  const localPeerConnection = useRef<RTCPeerConnection | null>(null);

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
      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (localPeerConnection.current) {
          if (data.type === "offer") {
            console.log("receive offer");
            await localPeerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );

            const answer = await localPeerConnection.current.createAnswer();
            await localPeerConnection.current.setLocalDescription(answer);

            console.log("Sending answer");
            socket.send(
              JSON.stringify({
                action: "audio",
                type: "answer",
                answer: localPeerConnection.current.localDescription,
              })
            );
          } else if (data.type === "answer") {
            console.log("receive answer");
            await localPeerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          } else if (data.type === "ice-candidate") {
            console.log("receive ice candidate");
            await localPeerConnection.current.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          } else if (data.type === "leave") {
            await connectedWSQuery.refetch();
          }
        }
      };
    }
  }, [socket, localPeerConnection]);

  useEffect(() => {
    if (userJoined && !localPeerConnection.current) {
      localPeerConnection.current = new RTCPeerConnection();

      if (stream) {
        stream.getTracks().forEach((track) => {
          localPeerConnection.current?.addTrack(track, stream);
        });
      }

      localPeerConnection.current.oniceconnectionstatechange = () => {
        console.log(
          `ICE connection state changed to: ${localPeerConnection.current?.iceConnectionState}`
        );

        // if (localPeerConnection.current?.iceConnectionState === "failed") {
        //   // Handle connection failure
        // }
      };

      if (stream && userJoined && localPeerConnection.current) {
        localPeerConnection.current.ontrack = (event) => {
          // Play the received track (audio) in a new HTMLAudioElement
          if (event.streams[0]) {
            const audioElement = new Audio();
            audioElement.srcObject = event.streams[0];
            audioElement.play();
          }
        };
      }
    }
  }, [userJoined, stream, localPeerConnection.current, socket]);

  const joinCall = async () => {
    setJoinButtonState(true);
    if (socket && webSocketsInCall.length < 5) {
      //add user to inCall field in database
      await joinOrLeaveCallMutation.mutateAsync({
        newState: true,
        channelID: selectedChannel.id,
      });
      // refresh list of connections in the call, accessed with 'webSocketsInCall'
      socket?.send(
        JSON.stringify({
          action: "audio",
          type: "leave",
        })
      );
      await connectedWSQuery.refetch();
      setJoinButtonState(false);
      if (localPeerConnection.current) {
        // Set the onicecandidate event listener before creating the offer
        localPeerConnection.current.onicecandidate = (event) => {
          console.log("triggered onicecandidate");
          if (event.candidate) {
            console.log("sending ice candidate");
            socket.send(
              JSON.stringify({
                action: "audio",
                type: "ice-candidate",
                candidate: event.candidate,
              })
            );
          }
        };

        const offer = await localPeerConnection.current.createOffer();
        await localPeerConnection.current.setLocalDescription(offer);

        socket.send(
          JSON.stringify({
            action: "audio",
            type: "offer",
            offer: localPeerConnection.current.localDescription,
          })
        );

        // Add event listener for iceconnectionstatechange
        localPeerConnection.current.oniceconnectionstatechange = () => {
          console.log(
            `ICE connection state changed to: ${localPeerConnection.current?.iceConnectionState}`
          );

          // if (localPeerConnection.current?.iceConnectionState === "failed") {
          //   // Handle connection failure
          // }
        };
      }
    }
  };

  const leaveCall = async () => {
    setLeaveButtonState(true);
    await joinOrLeaveCallMutation.mutateAsync({
      newState: false,
      channelID: selectedChannel.id,
    });
    socket?.send(
      JSON.stringify({
        action: "audio",
        type: "leave",
      })
    );
    await connectedWSQuery.refetch();
    setLeaveButtonState(false);

    // await disconnectWS.mutateAsync();
  };

  const joinCallButton = () => {
    if (joinButtonState) {
      return (
        <Button auto shadow size={"lg"} color="secondary" animated disabled>
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
    if (leaveButtonState) {
      return (
        <Button auto shadow size={"lg"} color="secondary" animated disabled>
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
        {webSocketsInCall.length === 5 ? (
          <div className="py-4 text-center text-sm italic">
            Currently voice calls only support up to 5 people.
          </div>
        ) : null}
        {webSocketsInCall ? (
          <div className={`grid grid-cols-5 justify-center`}>
            {webSocketsInCall.map((websocket) => (
              <div className="px-4 py-6" key={websocket.user.id}>
                <div className="flex h-24 w-24 rounded-full md:h-36 md:w-36">
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
                        className="h-24 w-24 rounded-full md:h-36 md:w-36"
                      />
                      <div className="py-4">{websocket.user.name}</div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {!userJoined ? (
          <div className="flex h-screen flex-col justify-center">
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
        ) : (
          <>
            <div className="flex content-center justify-center pt-12">
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
            <div className="absolute bottom-4 pl-4">{leaveCallButton()}</div>
          </>
        )}
      </div>
    </div>
  );
}
