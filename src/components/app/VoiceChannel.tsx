import DoubleChevrons from "@/src/icons/DoubleChevrons";
import { api } from "@/src/utils/api";
import { Button } from "@nextui-org/react";
import {
  Server_Channel,
  Server,
  Server_Member,
  Server_Admin,
  User,
} from "@prisma/client";
import { Dispatch, useContext, useEffect, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import TopBanner from "./TopBanner";
import Image from "next/image";

interface VoiceChannelProps {
  selectedChannel: Server_Channel;
  hideInnerNavToggle: () => void;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  socket: WebSocket;
  setSocket: any;
  innerNavShowing: boolean;
  setInnerNavShowing: Dispatch<React.SetStateAction<boolean>>;
  microphoneState: boolean;
  audioState: boolean;
  audioToggle: () => void;
  microphoneToggle: () => void;
  stream: MediaStream | null;
}

export default function VoiceChannel(props: VoiceChannelProps) {
  const {
    selectedChannel,
    currentUser,
    socket,
    setSocket,
    stream,
    hideInnerNavToggle,
    setInnerNavShowing,
    microphoneState,
    audioState,
  } = props;
  const { isDarkTheme } = useContext(ThemeContext);
  const [userJoined, setUserJoined] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [usersInChannel, setUsersInChannel] = useState<User[]>();
  // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
  //   null
  // );
  // const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  // const [audioWorklet, setAudioWorklet] = useState<AudioWorklet | null>(null);
  // const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const getUsersInChannel = api.server.getUsersInChannel.useQuery(
    selectedChannel.id
  );
  const disconnectWS = api.websocket.disconnectWsFromChannel.useMutation();
  const updateWS = api.websocket.updateWs.useMutation();
  const bodySizing = width > 768 ? `${width - 286}px` : `${width - 175}px`;
  const joinOrLeaveCallMutation = api.websocket.joinOrLeaveCall.useMutation();
  const usersInCallQuery = api.websocket.usersInCall.useQuery(
    selectedChannel.id
  );
  const [usersInCall, setUsersInCall] = useState<User[] | null>(null);

  useEffect(() => {
    if (usersInCallQuery.data && usersInCallQuery.data !== "No users in call") {
      setUsersInCall(usersInCallQuery.data);
    }
  }, [usersInCallQuery]);

  useEffect(() => {
    if (socket.readyState === 0) {
      const newSocket = new WebSocket(
        process.env.NEXT_PUBLIC_WEBSOCKET as string
      );
      setSocket(newSocket);
    }
    const payload = {
      senderID: currentUser.id,
      channelID: selectedChannel.id,
      channelUpdate: true,
    };
    socket.send(JSON.stringify(payload));
  }, [selectedChannel]);

  useEffect(() => {
    if (getUsersInChannel) {
      setUsersInChannel(getUsersInChannel.data);
    }
  }, [getUsersInChannel]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", (event) => {
        // Handle the incoming audio data here
        const audioContext = new AudioContext();
        const receivedData = JSON.parse(event.data);
        playReceivedAudio(audioContext, event.data);
      });
    }
  }, [socket]);

  useEffect(() => {
    async function loadAudioWorklet() {
      if (window.AudioWorklet) {
        const audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule("/audio-processor.js");
        setAudioContext(audioContext);
      }
    }
    loadAudioWorklet();
  }, []);

  // useEffect(() => {
  //   return () => {

  //   };
  // }, []);

  const joinCall = async () => {
    await joinOrLeaveCallMutation.mutateAsync(true);
    usersInCallQuery.refetch();
    if (microphoneState == false) {
      const res = confirm("Turn on Microphone?");
      if (res) {
        props.microphoneToggle();
      }
    }
    await updateWS.mutateAsync(selectedChannel.id);
    await getUsersInChannel.refetch();

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
          senderID: currentUser.id,
          channelID: selectedChannel.id,
          channelUpdate: false,
          audio: audioData,
          audioChannelTag: true,
        };
        socket.send(JSON.stringify(payload));
      };
    }
  };

  const leaveCall = async () => {
    await joinOrLeaveCallMutation.mutateAsync(false);
    usersInCallQuery.refetch();
    if (microphoneState) {
      const res = confirm("Turn off Microphone?");
      if (res) {
        props.microphoneToggle();
      }
    }
    await disconnectWS.mutateAsync();
    await getUsersInChannel.refetch();
  };

  useEffect(() => {
    return joinOrLeaveCallMutation.mutate(false);
  }, []);

  ///audio streaming

  const playReceivedAudio = (
    audioContext: AudioContext,
    audioData: ArrayBuffer
  ) => {
    const buffer = new Float32Array(audioData);
    const audioBuffer = audioContext.createBuffer(
      1,
      buffer.length,
      audioContext.sampleRate
    );
    audioBuffer.copyToChannel(buffer, 0);
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(audioContext.destination);
    bufferSource.start();
  };

  return (
    <div className="">
      <TopBanner
        currentChannel={selectedChannel}
        innerNavShowing={props.innerNavShowing}
      />
      <div className={`${props.innerNavShowing ? "md:hidden" : ""}`}>
        <button
          className={`absolute ${props.innerNavShowing ? null : "rotate-180"}`}
          onClick={hideInnerNavToggle}
        >
          <DoubleChevrons
            height={24}
            width={24}
            stroke={isDarkTheme ? "#f4f4f5" : "#27272a"}
            strokeWidth={1}
          />
        </button>
      </div>
      <div
        className="scrollXDisabled h-screen overflow-y-scroll rounded bg-zinc-50 pt-14 dark:bg-zinc-900"
        style={{ width: bodySizing }}
      >
        <div className="pt-8 text-center text-lg">
          {usersInCall && usersInCall?.length !== 0
            ? "Currently in Channel:"
            : "No one's here... yet"}
        </div>
        {usersInCall ? (
          <div className={`grid grid-cols-5 justify-center`}>
            {usersInCall.map((user) => (
              <div className="px-4 py-6" key={user.id}>
                <div className="flex h-24 w-24 rounded-full border md:h-36 md:w-36">
                  <div className="flex flex-col">
                    <button>
                      <img
                        src={
                          user.image
                            ? user.image
                            : user.pseudonym_image
                            ? user.pseudonym_image
                            : "/Logo - light.png"
                        }
                        alt={"user-logo"}
                        className="rounded-full"
                      />
                      <div className="pl-4">{user.name}</div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {!userJoined ? (
          <div className="absolute bottom-24 -ml-36 w-full">
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
            <div className="flex">
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
