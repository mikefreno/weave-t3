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
  const [websocketsInCall, setWebsocketsInCall] = useState<
    | (WSConnection & {
        user: User;
      })[]
    | null
  >(null);
  const [websocketsInChannel, setWebsocketsInChannel] = useState<
    | (WSConnection & {
        user: User;
      })[]
    | null
  >(null);

  const connectedWSQuery = api.websocket.wssConnectedToChannel.useQuery(
    selectedChannel.id
  );

  useEffect(() => {
    if (connectedWSQuery.data) {
      setWebsocketsInChannel(connectedWSQuery.data);
    }
  }, [connectedWSQuery]);

  useEffect(() => {
    if (websocketsInChannel) {
      const wsInCall = websocketsInChannel.filter(
        (connection) => connection.inCall
      );
      const userInCallBoolean = wsInCall.some(
        (connection) => connection.user.id === currentUser.id
      );
      setUserJoined(userInCallBoolean);
      setWebsocketsInCall(wsInCall);
    }
  }, [websocketsInChannel]);

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
      };
    }
  }, []);

  const joinCall = async () => {
    if (socket) {
      await joinOrLeaveCallMutation.mutateAsync({
        newState: true,
        channelID: selectedChannel.id,
      });
      await connectedWSQuery.refetch();
    }
  };

  const createOffer = () => {
    const peerConnection = new RTCPeerConnection();
  };

  const leaveCall = async () => {
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
          {websocketsInCall && websocketsInCall?.length !== 0
            ? "Currently in Channel:"
            : "No one's here... yet"}
        </div>
        {websocketsInCall ? (
          <div className={`grid grid-cols-5 justify-center`}>
            {websocketsInCall.map((websocket) => (
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
                <button onClick={props.microphoneToggle}>Turn Mic Off</button>
              ) : (
                <button onClick={props.microphoneToggle}>Turn Mic On</button>
              )}
              {audioState ? (
                <button onClick={props.audioToggle}>Turn Sound Off</button>
              ) : (
                <button onClick={props.audioToggle}>Turn Sound On</button>
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
