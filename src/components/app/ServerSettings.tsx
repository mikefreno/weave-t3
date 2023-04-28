import { api } from "@/src/utils/api";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import { RefObject, useEffect, useState } from "react";

interface ServerSettingsProps {
  privilegeLevel: "admin" | "member" | "owner" | undefined;
  server: Server | null;
  deletionServerButtonRef: RefObject<HTMLButtonElement>;
  serverDeletionToggle: () => void;
}

export default function ServerSettings(props: ServerSettingsProps) {
  const [fullServerData, setFullServerData] = useState<
    Server & { owner: User; admin: Server_Admin[]; members: Server_Member[] }
  >();

  const fullServerDataMutation = api.server.getFullServerData.useMutation();

  useEffect(() => {
    serverDataSetter();
  }, []);

  const serverDataSetter = async () => {
    if (props.server) {
      if (props.privilegeLevel === "owner" || props.privilegeLevel === "admin") {
        const res = await fullServerDataMutation.mutateAsync(props.server.id);
        if (res) {
          setFullServerData(res);
        }
      }
    }
  };

  const adminSettingsOptions = () => {
    if (props.privilegeLevel === "owner" || props.privilegeLevel === "admin") {
      return <></>;
    }
  };
  const ownerSettingsOptions = () => {
    if (props.privilegeLevel === "owner") {
      return <></>;
    }
  };

  return (
    <div className="px-8 py-6">
      <div className="text-center text-2xl tracking-widest">{props.server?.name}</div>
      <div className="py-4 text-center text-xl tracking-wider">Settings</div>
      {adminSettingsOptions()}
      {ownerSettingsOptions()}
      {props.privilegeLevel !== "owner" ? (
        <button className="flex underline-offset-2 hover:underline">
          <div>Leave Server</div>
          <span className="my-auto"></span>
        </button>
      ) : (
        <button
          ref={props.deletionServerButtonRef}
          className="flex underline-offset-2 hover:underline"
          onClick={props.serverDeletionToggle}
        >
          <div>Delete Server</div>
          <span className="my-auto"></span>
        </button>
      )}
    </div>
  );
}
