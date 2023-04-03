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
  socket: WebSocket;
  setSocket: any;
  microphoneState: boolean;
  audioState: boolean;
  audioToggle: () => void;
  microphoneToggle: () => void;
  stream: MediaStream | null;
  audioContext: AudioContext | null;
  fullscreen: boolean;
}

type WSWithUser = WSConnection & {
  user: User;
};
export default function VoiceChannel(props: VoiceChannelProps) {
  const {
    selectedChannel,
    currentUser,
    socket,
    setSocket,
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

  const [audioNodes, setAudioNodes] = useState<AudioNode[]>([]);

  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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

  // useEffect(() => {
  //   if (socket.readyState === 0 || socket.readyState === 2 || !socket) {
  //     const newSocket = new WebSocket(
  //       process.env.NEXT_PUBLIC_WEBSOCKET as string
  //     );
  //     setSocket(newSocket);
  //   }
  // }, [selectedChannel]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   socket.binaryType = "arraybuffer";
  // }, []);

  socket.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log(data);
    // if (data) {
    //   if (audioContext && userJoined) {
    //     playAudio(data);
    //   }
  };

  const joinCall = async () => {
    if (socket) {
      await joinOrLeaveCallMutation.mutateAsync({
        newState: true,
        channelID: selectedChannel.id,
      });
      await connectedWSQuery.refetch();
    }
  };

  useEffect(() => {
    if (userJoined && microphoneState) {
      handleAudioStream();
    } else {
      audioNodes.forEach((node) => node.disconnect());
    }
  }, [microphoneState, userJoined]);

  // const initRecorder = async () => {
  //   try {
  //     if (stream) {
  //       mediaRecorderRef.current = new MediaRecorder(stream);
  //       mediaRecorderRef.current.start(500);
  //       mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
  //         if (e.data.size > 0) {
  //           sendData(e.data);
  //         }
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Failed to initialize the MediaRecorder:", error);
  //   }
  // };

  // const sendData = async (data: Blob) => {
  //   if (socket.readyState === 1) {
  //     const arrayBuffer = await data.arrayBuffer();
  //     const audioData = new Uint8Array(arrayBuffer);
  //     const payload = {
  //       audio: audioData,
  //       senderID: currentUser.id,
  //       channelID: selectedChannel.id,
  //       invocation: "audio",
  //     };
  //     socket.send(JSON.stringify(payload));
  //   }
  // };

  const handleAudioStream = () => {
    if (audioContext && stream) {
      const audioSource = audioContext.createMediaStreamSource(stream);
      const audioProcessorNode = new AudioWorkletNode(
        audioContext,
        "audio-processor"
      );
      audioSource.connect(audioProcessorNode);
      audioProcessorNode.connect(audioContext.destination);

      // Listen for messages from the audio processor to receive audio data
      audioProcessorNode.port.onmessage = (event: MessageEvent) => {
        const audioData = event.data as Float32Array;
        // Send audio data to WebSocket
        const payload = {
          audio: audioData,
          senderID: currentUser.id,
          channelID: selectedChannel.id,
          action: "audio",
        };
        socket.send(JSON.stringify(payload));
        console.log("send audio");
      };
      setAudioNodes([
        audioSource,
        audioProcessorNode,
        audioContext.destination,
      ]);
    } else {
      console.log("stream needs restart");
      //retrigger audio context and stream
    }
  };

  const leaveCall = async () => {
    await joinOrLeaveCallMutation.mutateAsync({
      newState: false,
      channelID: selectedChannel.id,
    });
    await connectedWSQuery.refetch();
    await disconnectWS.mutateAsync();
  };

  // async function playAudio(audioData: any) {
  //   if (audioContext) {
  //     console.log(audioData);
  //     const float32Array = new Float32Array(audioData.buffer);

  //     const buffer = audioContext.createBuffer(
  //       1,
  //       float32Array.length,
  //       audioContext.sampleRate
  //     );
  //     buffer.copyToChannel(float32Array, 0);

  //     const source = audioContext.createBufferSource();
  //     source.buffer = buffer;
  //     source.connect(audioContext.destination);
  //     source.start();

  //     // If you want to handle the end of the playback, you can use the following event listener:
  //     source.onended = () => {
  //       console.log("Audio playback ended.");
  //     };
  //   }
  // }

  async function playAudio(audioData: Uint8Array) {
    // Create an AudioBuffer
    if (audioContext) {
      const arrayBuffer = audioData.buffer;

      // decode the ArrayBuffer into an AudioBuffer
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // create a new AudioBufferSourceNode and connect it to the AudioContext destination
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);

      // start playing the audio
      sourceNode.start();
    } else {
      console.log("audio context start error");
    }
  }

  return (
    <div className="">
      <TopBanner currentChannel={selectedChannel} fullscreen={fullscreen} />
      <div
        className={`scrollXDisabled h-screen overflow-y-scroll rounded bg-zinc-50 pt-14 dark:bg-zinc-900`}
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
