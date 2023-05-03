import { api } from "@/src/utils/api";
import {
  Conversation,
  Conversation_junction,
  DirectMessage,
  Server,
  Server_Admin,
  Server_Member,
  User,
} from "@prisma/client";
import { useEffect, useState } from "react";

interface DmListProps {
  currentUser: User & {
    servers: Server[];
    memberships: Server_Member[];
    adminships: Server_Admin[];
  };
  setConversationPage: (conversationID: number) => void;
  requestedConversationID: number | null;
}

export default function DirectMessageConversationList(props: DmListProps) {
  const { currentUser, setConversationPage, requestedConversationID } = props;
  const [conversations, setConversations] = useState<
    (Conversation & {
      conversation_junction: (Conversation_junction & {
        user: User;
      })[];
      directMessage: DirectMessage[];
    })[]
  >();
  const conversationsQuery = api.conversation.getUsersConversations.useQuery();

  useEffect(() => {
    if (conversationsQuery.data) {
      setConversations(
        conversationsQuery.data.conversation_junction.map((conversation_junction) => {
          return conversation_junction.conversation;
        })
      );
    }
  }, [conversationsQuery.data]);

  const showConversation = (conversation: Conversation) => {
    setConversationPage(conversation.id);
  };

  const returnConditional = (
    conversation: Conversation & {
      conversation_junction: (Conversation_junction & {
        user: User;
      })[];
      directMessage: DirectMessage[];
    }
  ) => {
    return conversation.conversation_junction.map((conversation_junction) =>
      conversation_junction.user.id !== currentUser.id ? (
        <button
          key={conversation_junction.user.id}
          className={`my-2 flex h-8 w-full justify-center rounded-md bg-zinc-100 shadow-sm dark:bg-zinc-900 ${
            requestedConversationID === conversation_junction.conversationID ? "border border-purple-800" : null
          }`}
          onClick={() => showConversation(conversation)}
        >
          <div className="my-auto">{conversation_junction.user.name}</div>
        </button>
      ) : null
    );
  };

  return (
    <div className="overflow-y-scroll px-2">
      <div className="flex flex-col">{conversations?.map((conversation) => returnConditional(conversation))}</div>
    </div>
  );
}
