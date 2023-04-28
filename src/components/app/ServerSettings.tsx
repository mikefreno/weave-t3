import BackArrow from "@/src/icons/BackArrow";
import { api } from "@/src/utils/api";
import { Tooltip } from "@nextui-org/react";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import { RefObject, useEffect, useState } from "react";

interface ServerSettingsProps {
  privilegeLevel: "admin" | "member" | "owner" | undefined;
  serverID: number | undefined;
  deletionServerButtonRef: RefObject<HTMLButtonElement>;
  serverDeletionToggle: () => void;
}

export default function ServerSettings(props: ServerSettingsProps) {
  const [fullServerData, setFullServerData] = useState<
    | (Server & {
        owner: User;
        admin: (Server_Admin & {
          admin: User;
        })[];
        members: (Server_Member & {
          member: User;
        })[];
      })
    | null
  >(null);
  const [baseServerData, setBaseServerData] = useState<Server | null>(null);

  const baseServerDataMutation = api.server.getServerByID.useMutation();
  const fullServerDataMutation = api.server.getFullServerData.useMutation();
  const promoteMemberMutation = api.server.promoteMemberToAdmin.useMutation();

  useEffect(() => {
    serverDataSetter();
    return () => {
      setFullServerData(null);
      setBaseServerData(null);
    };
  }, [props.serverID]);

  const serverDataSetter = async () => {
    if (props.serverID) {
      if (props.privilegeLevel === "owner" || props.privilegeLevel === "admin") {
        const res = await fullServerDataMutation.mutateAsync(props.serverID);
        if (res) {
          setFullServerData(res);
        }
      }
      const res = await baseServerDataMutation.mutateAsync(props.serverID);
      if (res) {
        setBaseServerData(res);
      }
    }
  };
  const promoteMemberToAdmin = async (promoteeID: string) => {
    await promoteMemberMutation.mutateAsync(promoteeID, currentUser.id);
  };

  const adminSettingsOptions = () => {
    if (props.privilegeLevel === "owner" || props.privilegeLevel === "admin") {
      return (
        <div>
          <div className="text-2xl tracking-widest underline underline-offset-4">User Management</div>
          <div className="py-2 text-xl">Admin</div>
          <ul>
            {fullServerData?.admin.map((admin) => (
              <>
                <div>{admin.admin.name}</div>
                <div>{admin.admin.pseudonym}</div>
                <div>{admin.admin.email}</div>
              </>
            ))}
            {fullServerData?.admin.length === 0 ? (
              <div className="-mt-4 italic">No admin, you can promote a member to help with server administration</div>
            ) : null}
          </ul>
          <div className="py-2 text-xl">Members</div>
          <ul>
            <div className="grid grid-cols-4">
              <div className="underline underline-offset-4">Name</div>
              <div className="underline underline-offset-4">Pseudonym</div>
              <div className="underline underline-offset-4">Email</div>
              <div className="underline underline-offset-4">Management Options</div>
            </div>
            {fullServerData?.members.map((member) => (
              <div className="grid grid-cols-4 py-2 pl-4">
                <div className="my-auto">
                  {member.member.name ? member.member.name : <span className="italic">null</span>}
                </div>
                <div className="my-auto">{member.member.email}</div>
                <div className="my-auto">
                  {member.member.pseudonym ? member.member.pseudonym : <span className="italic">null</span>}
                </div>
                <div className="my-auto">
                  <div>
                    <Tooltip content={"Promote to admin"}>
                      <button
                        className="rounded-md bg-purple-500 p-2 hover:bg-purple-600 active:bg-purple-700"
                        onClick={() => promoteMemberToAdmin(member.memberId)}
                      >
                        <div className="rotate-90">
                          <BackArrow height={12} width={12} stroke={"white"} strokeWidth={1.5} />
                        </div>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      );
    }
  };
  const ownerSettingsOptions = () => {
    if (props.privilegeLevel === "owner") {
      return <div></div>;
    }
  };

  return (
    <div className="px-8 py-6">
      <div className="text-center text-2xl tracking-widest">{baseServerData?.name}</div>
      <div className="py-4 text-center text-xl tracking-wider">Settings</div>
      {adminSettingsOptions()}
      {ownerSettingsOptions()}
      {props.privilegeLevel !== "owner" ? (
        <button className="flex underline-offset-4 hover:underline">
          <div>Leave Server</div>
          <span className="my-auto"></span>
        </button>
      ) : (
        <button
          ref={props.deletionServerButtonRef}
          className="flex underline-offset-4 hover:underline"
          onClick={props.serverDeletionToggle}
        >
          <div>Delete Server</div>
          <span className="my-auto"></span>
        </button>
      )}
    </div>
  );
}
