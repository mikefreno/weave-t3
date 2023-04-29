import BackArrow from "@/src/icons/BackArrow";
import CircleSlashIcon from "@/src/icons/CircleSlashIcon";
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
  const [width, setWidth] = useState<number>(window.innerWidth);
  const smallScreenBoolean = width < 768;

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

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
  const banMember = async (memberID: string) => {
    if (props.serverID) {
    }
  };

  const userManagementMobileScreenFormat = () => {
    return (
      <div>
        <div className="rule-around py-2 text-center text-xl">Admin</div>
        {privilegeLevelData?.admin?.length === 0 ? (
          <div className="py-2 text-center italic">
            No admin, you can promote a member to help with server administration
          </div>
        ) : null}
        {privilegeLevelData?.admin?.map((admin) => (
          <div className="my-4 rounded-md bg-purple-50 px-2 py-1 shadow-md dark:bg-zinc-700" key={admin.id}>
            <div className="flex justify-between px-4 pb-2">
              <div className="italic underline underline-offset-4">Name</div>
              <div className="italic underline underline-offset-4">Pseudonym</div>
            </div>
            <div className="flex justify-between px-4 pb-2">
              <div className="my-auto">
                {admin.admin.name ? admin.admin.name : <span className="italic">null</span>}
              </div>
              <div className="my-auto">
                {admin.admin.pseudonym ? admin.admin.pseudonym : <span className="italic">null</span>}
              </div>
            </div>
            <div className="flex justify-between px-4 pb-2">
              <div className="italic underline underline-offset-4">Email</div>
              <div className="italic underline underline-offset-4">Management</div>
            </div>
            <div className="flex justify-between px-4 pb-2">
              <div className="my-auto">{admin.admin.email === admin.admin.id ? "User Deleted" : admin.admin.email}</div>
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
          </div>
        ))}
        <div className="rule-around py-2 text-center text-xl">Members</div>
        {privilegeLevelData?.members?.length === 0 ? (
          <div className="py-2 text-center italic">No members yet!</div>
        ) : null}
        {privilegeLevelData?.members?.map((member) => (
          <div className="my-4 rounded-md bg-purple-50 px-2 py-1 shadow-md dark:bg-zinc-700" key={member.id}>
            <div className="flex justify-between px-4 pb-2">
              <div className="italic underline underline-offset-4">Name</div>
              <div className="italic underline underline-offset-4">Pseudonym</div>
            </div>
            <div className="flex justify-between px-4 pb-2">
              <div className="my-auto">
                {member.member.name ? member.member.name : <span className="italic">null</span>}
              </div>
              <div className="my-auto">
                {member.member.pseudonym ? member.member.pseudonym : <span className="italic">null</span>}
              </div>
            </div>
            <div className="flex justify-between px-4 pb-2">
              <div className="italic underline underline-offset-4">Email</div>
              <div className="italic underline underline-offset-4">Management</div>
            </div>
            <div className="flex justify-between px-4 pb-2">
              <div className="my-auto">
                {member.member.email === member.member.id ? "User Deleted" : member.member.email}
              </div>
              <div className="my-auto flex w-2/5 justify-between">
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
                      className="rounded-md bg-orange-500 p-2 hover:bg-orange-600 active:bg-orange-700"
                      onClick={() => suspendMember(member.memberId)}
                    >
                      <div className="">
                        <HandRaiseIcon height={12} width={12} stroke={"white"} strokeWidth={1.5} />
                      </div>
                    </button>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip content={"Ban member"}>
                    <button
                      className="rounded-md bg-red-500 p-2 hover:bg-red-600 active:bg-red-700"
                      onClick={() => banMember(member.memberId)}
                    >
                      <div className="rotate-180">
                        <CircleSlashIcon height={12} width={12} stroke={"white"} strokeWidth={1.5} />
                      </div>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const userManagementDesktopFormat = () => {
    return (
      <>
        <div className="rule-around py-2 text-center text-xl">Admin</div>
        {privilegeLevelData?.admin?.length !== 0 ? (
          <div className="grid grid-cols-4 pb-2 pl-4">
            <div className="underline underline-offset-4">Name</div>
            <div className="underline underline-offset-4">Pseudonym</div>
            <div className="underline underline-offset-4">Email</div>
            <div className="underline underline-offset-4">Management</div>
          </div>
        ) : (
          <div className="py-2 text-center italic">
            No admin, you can promote a member to help with server administration
          </div>
        )}
        {privilegeLevelData?.admin?.map((admin) => (
          <div className="my-2 rounded-md bg-purple-50 px-2 py-1 shadow-md dark:bg-zinc-700" key={admin.id}>
            <div className="grid grid-cols-2 py-2 pl-4 md:grid-cols-4">
              <div className="my-auto">
                {admin.admin.name ? admin.admin.name : <span className="italic">null</span>}
              </div>
              <div className="my-auto">
                {admin.admin.pseudonym ? admin.admin.pseudonym : <span className="italic">null</span>}
              </div>
              <div className="my-auto">{admin.admin.email === admin.admin.id ? "User Deleted" : admin.admin.email}</div>
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
          </div>
        ))}
        <div className="rule-around py-2 text-center text-xl">Members</div>
        {privilegeLevelData?.members?.length !== 0 ? (
          <div className="grid grid-cols-4 pb-2 pl-4">
            <div className="underline underline-offset-4">Name</div>
            <div className="underline underline-offset-4">Pseudonym</div>
            <div className="underline underline-offset-4">Email</div>
            <div className="underline underline-offset-4">Management</div>
          </div>
        ) : (
          <div className="py-2 text-center italic">No members yet!</div>
        )}
        {privilegeLevelData?.members?.map((member) => (
          <div className="my-2 rounded-md bg-purple-50 px-2 py-1 shadow-md dark:bg-zinc-700" key={member.id}>
            <div className="grid grid-cols-4 py-2 pl-4">
              <div className="my-auto">
                {member.member.name ? member.member.name : <span className="italic">null</span>}
              </div>
              <div className="my-auto">
                {member.member.pseudonym ? member.member.pseudonym : <span className="italic">null</span>}
              </div>
              <div className="my-auto">
                {member.member.email === member.member.id ? "User Deleted" : member.member.email}
              </div>
              <div className="my-auto flex w-5/6 justify-between">
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
                      className="rounded-md bg-orange-500 p-2 hover:bg-orange-600 active:bg-orange-700"
                      onClick={() => suspendMember(member.memberId)}
                    >
                      <div className="">
                        <HandRaiseIcon height={12} width={12} stroke={"white"} strokeWidth={1.5} />
                      </div>
                    </button>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip content={"Ban member"}>
                    <button
                      className="rounded-md bg-red-500 p-2 hover:bg-red-600 active:bg-red-700"
                      onClick={() => banMember(member.memberId)}
                    >
                      <div className="rotate-180">
                        <CircleSlashIcon height={12} width={12} stroke={"white"} strokeWidth={1.5} />
                      </div>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  const adminSettingsOptions = () => {
    if (props.privilegeLevel === "owner" || props.privilegeLevel === "admin") {
      return (
        <div className="w-full rounded-lg bg-zinc-50 px-4 py-6 shadow-lg dark:bg-zinc-600 md:w-5/6 md:px-8">
          <div className="pb-8 text-2xl tracking-widest underline underline-offset-2">User Management</div>
          {smallScreenBoolean ? userManagementMobileScreenFormat() : userManagementDesktopFormat()}
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
    <div className="max-h-screen w-full select-text overflow-y-scroll p-2 md:px-8 md:py-6">
      <div className="text-center text-2xl tracking-widest">{privilegeLevelData?.name}</div>
      <div className="py-4 text-center text-xl tracking-wider">Settings</div>
      <div className="">
        {adminSettingsOptions()}
        {ownerSettingsOptions()}
      </div>
      <div className="mt-8 w-full rounded-lg bg-red-600 px-8 py-6 shadow-lg md:w-5/6">
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
