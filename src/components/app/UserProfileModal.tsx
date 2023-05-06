import { api } from "@/src/utils/api";
import { type User as MongoUser } from "@prisma/client/mongo";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import { Button, Input, Loading, Tooltip } from "@nextui-org/react";
import ThemeContext from "../ThemeContextProvider";
import Xmark from "@/src/icons/Xmark";
import AddFriendIcon from "@/src/icons/AddFriendIcon";
import PaperPlanes from "@/src/icons/PaperPlanes";
import SendIcon from "@/src/icons/SendIcon";
import AdjustableLoadingElement from "../AdjustableLoadingElement";

export default function UserProfileModal(props: {
  viewedUser: MongoUser;
  UserProfileModalRef: RefObject<HTMLDivElement>;
  userProfileModalToggle: () => void;
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
}) {
  const { isDarkTheme } = useContext(ThemeContext);
  //state
  const { viewedUser, UserProfileModalRef } = props;
  const [fullViewedUser, setFullViewedUser] = useState<User | null>(null);
  const [inputShowing, setInputShowing] = useState<boolean>(false);
  const [messageSendLoading, setMessageSendLoading] = useState<boolean>(false);
  const [messageResponse, setMessageResponse] = useState<string>("");
  const [friendState, setFriendState] = useState<boolean>(false);
  const [friendRequestState, setFriendRequestState] = useState<boolean>(false);
  const [friendButtonLoading, setFriendButtonLoading] = useState<boolean>(false);
  //refs
  const messageInputRef = useRef<HTMLInputElement>(null);
  //trpc (api)
  const getUserByID = api.users.getUserByIdQuery.useQuery(viewedUser.id);
  const sendFriendRequestMutation = api.friends.sendFriendRequest.useMutation();
  const sendConversationRequestMutation = api.conversation.createConversation.useMutation();
  const friendsStateCheckMutation = api.friends.checkFriendState.useMutation();
  const friendRequestCheckMutation = api.friends.checkFriendRequestState.useMutation();

  useEffect(() => {
    getUserByID.refetch();
    friendStateSetter();
  }, [viewedUser]);

  const friendStateSetter = async () => {
    const res = await friendsStateCheckMutation.mutateAsync(viewedUser.id);
    setFriendState(res);
    const res2 = await friendRequestCheckMutation.mutateAsync(viewedUser.id);
    setFriendRequestState(res2);
  };

  useEffect(() => {
    if (getUserByID && getUserByID.data) {
      setFullViewedUser(getUserByID.data);
    }
  }, [getUserByID]);

  const sendFriendRequest = async () => {
    setFriendButtonLoading(true);
    await sendFriendRequestMutation.mutateAsync(viewedUser.id);
    await friendStateSetter();
    setFriendButtonLoading(false);
  };

  const sendConversationRequest = async (e: any) => {
    e.preventDefault();
    if (messageInputRef.current) {
      setMessageSendLoading(true);
      const res = await sendConversationRequestMutation.mutateAsync({
        message: messageInputRef.current.value,
        targetUserID: viewedUser.id,
      });
      setMessageResponse(res);
      setMessageSendLoading(false);
      messageInputToggle();
    }
  };

  const messageInputToggle = async () => {
    setInputShowing(!inputShowing);
  };

  const loadState = () => {
    if (fullViewedUser) {
      return (
        <>
          <div className="flex justify-between pb-4">
            <button onClick={props.userProfileModalToggle}>
              <Xmark className={"w-10"} />
            </button>
            {inputShowing ? (
              <form onSubmit={sendConversationRequest}>
                <Input
                  aria-label="message input"
                  ref={messageInputRef}
                  contentClickable
                  contentRight={
                    <div className="flex">
                      <button type="submit">
                        {messageSendLoading ? (
                          <Loading size="xs" />
                        ) : (
                          <div>
                            <SendIcon
                              height={16}
                              strokeWidth={1}
                              width={16}
                              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                            />
                          </div>
                        )}
                      </button>
                    </div>
                  }
                />
              </form>
            ) : (
              <div className="italic">{messageResponse}</div>
            )}
            {props.currentUser.id !== viewedUser.id ? (
              <div className="flex">
                <Tooltip content={"Send a message"}>
                  <Button color={"primary"} auto onClick={messageInputToggle} className="mx-2">
                    <PaperPlanes height={20} width={20} color={"white"} />
                  </Button>
                </Tooltip>
                {friendButtonLoading ? (
                  <Button color={"secondary"} auto disabled>
                    <Loading />
                  </Button>
                ) : friendState ? null : friendRequestState ? (
                  <Tooltip content={"Friend Request already sent!"}>
                    <Button color={"secondary"} auto disabled>
                      <AddFriendIcon height={20} width={20} stroke={"white"} strokeWidth={1.5} />
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip content={"Send a friend request"}>
                    <Button color={"secondary"} auto onClick={sendFriendRequest}>
                      <AddFriendIcon height={20} width={20} stroke={"white"} strokeWidth={1.5} />
                    </Button>
                  </Tooltip>
                )}
              </div>
            ) : null}
          </div>
          <div className="flex flex-row justify-evenly">
            {fullViewedUser.image ? (
              <div className="my-auto flex justify-center">
                <img className="h-36 w-36 rounded-full" src={fullViewedUser.image} />
              </div>
            ) : null}
            <div className="my-auto flex justify-center">{fullViewedUser.name}</div>
          </div>
          <div className="flex flex-row justify-evenly">
            {fullViewedUser.pseudonym_image ? (
              <div className="my-auto flex justify-center">
                <img className="h-36 w-36 rounded-full" src={fullViewedUser.pseudonym_image} />
              </div>
            ) : null}
            <div className="my-auto flex justify-center">
              {fullViewedUser.pseudonym ? "@" + fullViewedUser.pseudonym : null}
            </div>
          </div>
        </>
      );
    } else {
      return <AdjustableLoadingElement />;
    }
  };

  return (
    <div className="fixed">
      <div className="flex h-screen w-screen items-center justify-center backdrop-blur-sm">
        <div
          ref={UserProfileModalRef}
          className="fade-in -mt-24 w-11/12 rounded-xl bg-zinc-100 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <div className="py-4">{loadState()}</div>
        </div>
      </div>
    </div>
  );
}
