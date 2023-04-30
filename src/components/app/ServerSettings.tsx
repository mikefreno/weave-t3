import BackArrow from "@/src/icons/BackArrow";
import CircleSlashIcon from "@/src/icons/CircleSlashIcon";
import HandRaiseIcon from "@/src/icons/HandRaiseIcon";
import { api } from "@/src/utils/api";
import { Button, Loading, Tooltip } from "@nextui-org/react";
import { Server, Server_Admin, Server_Member, User } from "@prisma/client";
import { RefObject, useEffect, useState } from "react";
//emojis
import AngryEmoji from "@/src/icons/emojis/Angry.svg";
import BlankEmoji from "@/src/icons/emojis/Blank.svg";
import CryEmoji from "@/src/icons/emojis/Cry.svg";
import ExcitedEmoji from "@/src/icons/emojis/Excited.svg";
import FlatEmoji from "@/src/icons/emojis/Flat.svg";
import HeartEyeEmoji from "@/src/icons/emojis/HeartEye.svg";
import MoneyEyeEmoji from "@/src/icons/emojis/MoneyEye.svg";
import ShiftyEmoji from "@/src/icons/emojis/Shifty.svg";
import SickEmoji from "@/src/icons/emojis/Sick.svg";
import SilentEmoji from "@/src/icons/emojis/Silent.svg";
import SmirkEmoji from "@/src/icons/emojis/Smirk.svg";
import TearsEmoji from "@/src/icons/emojis/Tears.svg";
import ThumbsUpEmoji from "@/src/icons/emojis/ThumbsUp.svg";
import TongueEmoji from "@/src/icons/emojis/Tongue.svg";
import UpsideDownEmoji from "@/src/icons/emojis/UpsideDown.svg";
import WorriedEmoji from "@/src/icons/emojis/Worried.svg";

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
  const smallScreenBoolean = width < 1024;
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [emojiResponse, setEmojiResponse] = useState<string | null>(null);
  const [emojiSetterLoading, setEmojiSetterLoading] = useState<boolean>(false);

  const serverDataQuery = api.server.getPrivilegeBasedServerData.useQuery({
    serverID: props.serverID,
    privilegeLevel: props.privilegeLevel,
  });
  const promoteMemberMutation = api.server.promoteMemberToAdmin.useMutation();
  const demoteAdminMutation = api.server.demoteAdminToMember.useMutation();
  const emojiMutation = api.server.setServerEmojis.useMutation();

  useEffect(() => {
    if (serverDataQuery.data) {
      setPrivilegeLevelData(serverDataQuery.data);
    }
  }, [serverDataQuery]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (privilegeLevelData) {
      const emojiString = privilegeLevelData.emojiReactions;
      if (emojiString) {
        const emojiArray = emojiString.split(",");
        const enforcedLength = emojiArray.slice(0, 7);
        const newSelectedEmojis = [...enforcedLength];
        setSelectedEmojis(newSelectedEmojis);
      }
    }
  }, [privilegeLevelData]);

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
  const addEmojiToList = (newEmoji: string) => {
    if (selectedEmojis.length < 7) {
      setSelectedEmojis([...selectedEmojis, newEmoji]);
    }
  };
  const removeEmojiFromList = (emojiToRemove: string) => {
    setSelectedEmojis(selectedEmojis.filter((emoji) => emoji !== emojiToRemove));
  };
  const emojiStateHandler = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      removeEmojiFromList(emoji);
    } else {
      addEmojiToList(emoji);
    }
  };
  const setServerEmojiList = async () => {
    if (props.serverID) {
      setEmojiSetterLoading(true);
      const emojiString = selectedEmojis.join(",");
      const res = await emojiMutation.mutateAsync({ serverID: props.serverID, emojiString: emojiString });
      setEmojiSetterLoading(false);
      await serverDataQuery.refetch();
      setEmojiResponse(res);
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

  const reactionSettings = () => {
    return (
      <div className="w-full rounded-lg bg-zinc-50 px-4 py-6 shadow-lg dark:bg-zinc-600 md:w-5/6 md:px-8">
        <div className="pb-8 text-2xl tracking-widest underline underline-offset-2">Reactions</div>
        <div className="-mt-12 flex w-full justify-end">
          <div className="m-2 h-12 w-12 rounded-2xl border-2 border-green-500 bg-zinc-50 fill-rose-500 p-2 shadow-xl dark:bg-zinc-700">
            <div className="rotate-180">
              <ThumbsUpEmoji />
            </div>
          </div>
          <div className="m-2 h-12 w-12 rounded-2xl border-2 border-green-500 bg-zinc-50 fill-green-500 p-2 shadow-xl dark:bg-zinc-700">
            <ThumbsUpEmoji />
          </div>
        </div>
        <div className="text py-4 text-center">
          Select <span className="underline underline-offset-4">up to 5</span> emoji's (in addition to thumbs up and
          down) that users can react to messages with!
        </div>
        <div className="">
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("angry") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("angry")}
          >
            <AngryEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("blank") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("blank")}
          >
            <BlankEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("cry") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("cry")}
          >
            <CryEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("excited") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("excited")}
          >
            <ExcitedEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("flat") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("flat")}
          >
            <FlatEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("heartEye") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("heartEye")}
          >
            <HeartEyeEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("moneyEye") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("moneyEye")}
          >
            <MoneyEyeEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("shifty") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("shifty")}
          >
            <ShiftyEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("sick") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("sick")}
          >
            <SickEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("silent") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("silent")}
          >
            <SilentEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("smirk") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("smirk")}
          >
            <SmirkEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("tears") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("tears")}
          >
            <TearsEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("tongue") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("tongue")}
          >
            <TongueEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("upsideDown") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("upsideDown")}
          >
            <UpsideDownEmoji />
          </button>
          <button
            className={`m-2 h-16 w-16 rounded-2xl bg-zinc-50 p-2 shadow-xl dark:bg-zinc-700 ${
              selectedEmojis.includes("worried") ? "border-2 border-green-500" : ""
            }`}
            onClick={() => emojiStateHandler("worried")}
          >
            <WorriedEmoji />
          </button>
        </div>
        <div className="flex justify-end">
          <div className="my-auto px-6 italic">{emojiResponse}</div>
          {emojiSetterLoading ? (
            <Button color={"secondary"} disabled auto shadow>
              <Loading type="points" />
            </Button>
          ) : (
            <Button color={"secondary"} onClick={setServerEmojiList} auto shadow>
              Set Selection
            </Button>
          )}
        </div>
      </div>
    );
  };

  const adminSettingsOptions = () => {
    if (props.privilegeLevel === "owner" || props.privilegeLevel === "admin") {
      return (
        <>
          <div className="w-full rounded-lg bg-zinc-50 px-4 py-6 shadow-lg dark:bg-zinc-600 md:w-5/6 md:px-8">
            <div className="pb-8 text-2xl tracking-widest underline underline-offset-2">User Management</div>
            {smallScreenBoolean ? userManagementMobileScreenFormat() : userManagementDesktopFormat()}
          </div>
          <div className="flex justify-center py-4">{reactionSettings()}</div>
        </>
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
      <div className="flex flex-col items-center py-2">
        {adminSettingsOptions()}
        {ownerSettingsOptions()}
      </div>
      <div className="flex justify-center">
        <div className="my-8 w-full rounded-lg bg-red-600 px-8 py-6 shadow-lg md:w-5/6">
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
    </div>
  );
}
