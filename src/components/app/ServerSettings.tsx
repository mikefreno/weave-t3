import BackArrow from "@/src/icons/BackArrow";
import HandRaiseIcon from "@/src/icons/HandRaiseIcon";
import { api } from "@/src/utils/api";
import { Tooltip } from "@nextui-org/react";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import { RefObject, useEffect, useState } from "react";

interface ServerSettingsProps {
  privilegeLevel: "admin" | "member" | "owner" | undefined;
  serverID: number | undefined;
  deletionServerButtonRef: RefObject<HTMLButtonElement>;
  serverDeletionToggle: () => void;
  currentUser: User;
}

export default function ServerSettings(props: ServerSettingsProps) {
  const [privilegeLevelData, setPrivilegeLevelData] = useState<
    | (Server & {
        owner?: User;
        admin?: (Server_Admin & {
          admin: User;
        })[];
        members?: (Server_Member & {
          member: User;
        })[];
      })
    | null
  >(null);

  const serverDataQuery = api.server.getPrivilegeBasedServerData.useQuery({
    serverID: props.serverID,
    privilegeLevel: props.privilegeLevel,
  });
  const promoteMemberMutation = api.server.promoteMemberToAdmin.useMutation();
  const demoteAdminMutation = api.server.demoteAdminToMember.useMutation();

  useEffect(() => {
    if (serverDataQuery.data) {
      setPrivilegeLevelData(serverDataQuery.data);
    }
    return () => {
      setPrivilegeLevelData(null);
    };
  }, [serverDataQuery]);

  const promoteMemberToAdmin = async (promoteeID: string) => {
    if (props.serverID) {
      await promoteMemberMutation.mutateAsync({
        promoteeID: promoteeID,
        promoterID: props.currentUser.id,
        serverID: props.serverID,
      });
      await serverDataQuery.refetch();
    }
  };
  const demoteAdminToMember = async (demoteeID: string) => {
    if (props.serverID) {
      await demoteAdminMutation.mutateAsync({
        demoteeID: demoteeID,
        demoterID: props.currentUser.id,
        serverID: props.serverID,
      });
      await serverDataQuery.refetch();
    }
  };
  const suspendMember = async (memberID: string) => {
    if (props.serverID) {
    }
  };

  const adminSettingsOptions = () => {
    if (props.privilegeLevel === "owner" || props.privilegeLevel === "admin") {
      return (
        <div className="w-5/6 rounded-lg bg-zinc-50 px-8 py-6 shadow-lg dark:bg-zinc-600">
          <div className="pb-8 text-2xl tracking-widest underline underline-offset-2">User Management</div>
          <div className="rule-around py-2 text-center text-xl">Admin</div>
          <ul>
            <div className="grid grid-cols-4">
              <div className="underline underline-offset-4">Name</div>
              <div className="underline underline-offset-4">Pseudonym</div>
              <div className="underline underline-offset-4">Email</div>
              <div className="underline underline-offset-4">Management Options</div>
            </div>
            {privilegeLevelData?.admin?.map((admin) => (
              <div className="grid grid-cols-4 py-2 pl-4" key={admin.id}>
                <div className="my-auto">
                  {admin.admin.name ? admin.admin.name : <span className="italic">null</span>}
                </div>
                <div className="my-auto">
                  {admin.admin.pseudonym ? admin.admin.pseudonym : <span className="italic">null</span>}
                </div>
                <div className="my-auto">
                  {admin.admin.email === admin.admin.id ? "User Deleted" : admin.admin.email}
                </div>
                <div className="my-auto">
                  {props.privilegeLevel === "owner" ? (
                    <div>
                      <Tooltip content={"Demote to member"}>
                        <button
                          className="rounded-md bg-red-500 p-2 hover:bg-red-600 active:bg-red-700"
                          onClick={() => demoteAdminToMember(admin.adminId)}
                        >
                          <div className="-rotate-90">
                            <BackArrow height={12} width={12} stroke={"white"} strokeWidth={1.5} />
                          </div>
                        </button>
                      </Tooltip>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {privilegeLevelData?.admin?.length === 0 ? (
              <div className="py-2 italic">No admin, you can promote a member to help with server administration</div>
            ) : null}
          </ul>
          <div className="rule-around py-2 text-center text-xl">Members</div>
          <ul>
            <div className="grid grid-cols-4">
              <div className="underline underline-offset-4">Name</div>
              <div className="underline underline-offset-4">Pseudonym</div>
              <div className="underline underline-offset-4">Email</div>
              <div className="underline underline-offset-4">Management Options</div>
            </div>
            {privilegeLevelData?.members?.map((member) => (
              <div className="grid grid-cols-4 py-2 pl-4" key={member.id}>
                <div className="my-auto">
                  {member.member.name ? member.member.name : <span className="italic">null</span>}
                </div>
                <div className="my-auto">
                  {member.member.pseudonym ? member.member.pseudonym : <span className="italic">null</span>}
                </div>
                <div className="my-auto">{member.member.email}</div>
                <div className="my-auto flex justify-between">
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
                  <div>
                    <Tooltip content={"Suspend member"}>
                      <button
                        className="rounded-md bg-purple-500 p-2 hover:bg-purple-600 active:bg-purple-700"
                        onClick={() => suspendMember(member.memberId)}
                      >
                        <div className="rotate-180">
                          <HandRaiseIcon height={12} width={12} stroke={"white"} strokeWidth={1.5} />
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
    <div className="select-text px-8 py-6">
      <div className="text-center text-2xl tracking-widest">{privilegeLevelData?.name}</div>
      <div className="py-4 text-center text-xl tracking-wider">Settings</div>
      <div className="">
        {adminSettingsOptions()}
        {ownerSettingsOptions()}
      </div>
      <div className="mt-8 w-5/6 rounded-lg bg-red-600 px-8 py-6 shadow-lg">
        <div className="py-2 text-2xl underline underline-offset-2">Danger Zone</div>
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
    </div>
  );
}
