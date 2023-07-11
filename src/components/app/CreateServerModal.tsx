import AddIcon from "@/src/icons/AddIcon";
import BackArrow from "@/src/icons/BackArrow";
import BriefcaseIcon from "@/src/icons/BriefcaseIcon";
import ClipboardIcon from "@/src/icons/ClipboardIcon";
import GamepadIcon from "@/src/icons/GamepadIcon";
import LongArrow from "@/src/icons/LongArrow";
import StackedBoxesIcon from "@/src/icons/StackedBoxesIcon";
import Xmark from "@/src/icons/Xmark";
import { Button, Checkbox, Input, Loading, Textarea } from "@nextui-org/react";
import React, { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import Dropzone from "@/src/components/app/Dropzone";
import { api } from "@/src/utils/api";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { Server } from "@prisma/client";

export default function CreateServerModal(props: {
  serverModalToggle: React.MouseEventHandler<HTMLButtonElement>;
  serverModalRef: RefObject<HTMLDivElement>;
  refreshUserServers: () => any;
  serverSetter: (server: Server) => void;
}) {
  const { isDarkTheme } = useContext(ThemeContext);
  //state
  const [logoImage, setLogoImage] = useState<File | Blob | null>(null);
  const [bannerImage, setBannerImage] = useState<File | Blob | null>(null);
  const [logoImageExt, setLogoImageExt] = useState<string | null>(null);
  const [bannerImageExt, setBannerImageExt] = useState<string | null>(null);
  const [logoImageHolder, setLogoImageHolder] = useState<string | ArrayBuffer | null>(null);
  const [bannerImageHolder, setBannerImageHolder] = useState<string | ArrayBuffer | null>(null);
  const [specifiedTemplate, setSpecifiedTemplate] = useState<string>("");
  const [joiningServer, setJoiningServer] = useState<boolean>(false);
  const [serverPublic, setServerPublic] = useState(false);
  const [serverType, setServerType] = useState<string | null>(null);
  const [serverDescriptionLength, setServerDescriptionLength] = useState(0);
  const [searchable, setSearchable] = useState<boolean>(true);
  const [createButtonLoading, setCreateButtonLoading] = useState(false);
  const [serverImageLoading, setServerImageLoading] = useState(false);
  const [endingReached, setEndingReached] = useState<boolean>(false);
  const [newServerData, setNewServerData] = useState<Server | null>(null);
  //ref
  const serverNameRef = useRef<HTMLInputElement>(null);
  const serverSelectRef = useRef<HTMLSelectElement>(null);
  const serverDescriptionRef = useRef<HTMLTextAreaElement>(null);
  //trpc (api)
  const createServerMutation = api.server.createServer.useMutation({});
  const serverLogoMutation = api.server.updateServerLogo.useMutation({});
  const serverBannerMutation = api.server.updateServerBanner.useMutation({});
  const s3TokenMutation = api.misc.returnS3Token.useMutation();

  useEffect(() => {
    if (!serverSelectRef.current) {
      setServerType(null);
    } else {
      setServerType(serverSelectRef.current.value);
    }
  }, [serverSelectRef.current]);

  const joinServerRequest = (event: any) => {
    event.preventDefault();
  };

  const handleServerTypeChange = (event: any) => {
    setServerType(event.target.value);
  };
  const descriptionLengthReport = () => {
    setServerDescriptionLength(serverDescriptionRef.current!.value.length);
  };

  const createServerRequest = async (event: { preventDefault: () => void }) => {
    setCreateButtonLoading(true);
    event.preventDefault();
    // first create server, then upload images to s3, then update server with image urls
    const serverName = serverNameRef.current?.value;
    const serverDescription = serverDescriptionRef.current?.value;
    if (serverName) {
      //creates server, grabs server ID
      const res = await createServerMutation.mutateAsync({
        name: serverName,
        blurb: serverDescription ? serverDescription : undefined,
        category: serverType ? serverType : undefined,
        public: serverPublic ? true : false,
      });
      setNewServerData(res);
      await updateServerImages(res);
      await props.refreshUserServers();
      setEndingReached(true);
    }
    setCreateButtonLoading(false);
  };

  const goToServer = () => {
    if (createServerMutation.data) props.serverSetter(createServerMutation.data);
  };

  //image handling
  const updateServerImages = async (server: Server) => {
    if (bannerImage) {
      const s3TokenReturn = await s3TokenMutation.mutateAsync({
        id: server.id.toString(),
        type: "banner",
        ext: bannerImageExt as string,
        category: "servers",
      });
      //update server with image url
      await axios.put(s3TokenReturn.uploadURL, bannerImage as File).catch((err) => {
        console.log(err);
      });
      serverBannerMutation.mutate({
        serverID: server.id,
        url: s3TokenReturn.key,
      });
    }
    if (logoImage) {
      const s3TokenReturn = await s3TokenMutation.mutateAsync({
        id: server.id.toString(),
        type: "logo",
        ext: logoImageExt as string,
        category: "servers",
      });
      await axios.put(s3TokenReturn.uploadURL, logoImage as File).catch((err) => {
        console.log(err);
      });
      serverLogoMutation.mutate({
        serverID: server.id,
        url: s3TokenReturn.key,
      });
    }
  };

  const handleBannerDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setBannerImage(file);
      const ext = file.type.split("/")[1];
      setBannerImageExt(ext!);

      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setBannerImageHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleLogoDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setLogoImage(file);
      const ext = file.type.split("/")[1];
      setLogoImageExt(ext!);

      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setLogoImageHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  //ui
  const stateReturn = () => {
    if (endingReached) {
      return (
        <>
          <div>
            <button onClick={props.serverModalToggle}>
              <Xmark className={"w-10"} />
            </button>
          </div>
          <div className="text-center">
            <div>You&apos;re all set!</div>
            {/* <div>You can invite others now with the following link: </div> */}
          </div>
          <div className="flex justify-end">
            <Button auto color={"secondary"} onClick={goToServer}>
              Go To Server
              <div className="rotate-180">
                <BackArrow height={24} width={24} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1.5} />
              </div>
            </Button>
          </div>
        </>
      );
    } else if (specifiedTemplate === "" && !joiningServer) {
      return (
        <>
          <div className="flex w-full justify-between">
            <button onClick={props.serverModalToggle}>
              <Xmark className={"w-10"} />
            </button>
            <div className="flex">
              <span className="my-auto mr-4">Joining a server?</span>
              <span className="animate-left-right mr my-auto">
                <LongArrow height={30} width={30} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
              </span>
              <button id="add" onClick={() => setJoiningServer(true)}>
                <AddIcon height={36} width={36} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="py-4 text-center text-2xl">Create a Server</div>
          <button
            id="Generic"
            onClick={() => setSpecifiedTemplate("generic")}
            className="m-4 mx-auto flex w-4/5 rounded-xl bg-zinc-200 p-4 hover:bg-zinc-300 active:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:active:bg-zinc-900"
          >
            <ClipboardIcon height={20} width={20} color={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1.5} />
            <div className="mx-auto text-lg">Generic Server</div>
          </button>
          <div className="py-2 text-center text-xl">Server Templates</div>
          <button
            id="Work"
            onClick={() => setSpecifiedTemplate("work")}
            className="m-4 mx-auto flex w-4/5 rounded-xl bg-blue-500 p-4 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
          >
            <BriefcaseIcon height={20} width={20} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
            <div className="mx-auto text-lg">
              Work centric
              <div className="text-sm">Real names enforced, private and unlisted in search.</div>
            </div>
          </button>
          <button
            id="Gaming"
            onClick={() => setSpecifiedTemplate("gaming")}
            className="m-4 mx-auto flex w-4/5 rounded-xl bg-emerald-500 p-4  hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800"
          >
            <GamepadIcon height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
            <div className="mx-auto text-lg">
              Gaming Centric
              <div className="text-sm">Pseudonyms on, private, but users can request to join from search</div>
            </div>
          </button>
          <button
            id="Stacked"
            onClick={() => setSpecifiedTemplate("full")}
            className="m-4 mx-auto flex w-4/5 rounded-xl bg-violet-500 p-4 hover:bg-violet-600 active:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 dark:active:bg-violet-800"
          >
            <StackedBoxesIcon height={24} width={24} color={isDarkTheme ? "#e4e4e7" : "#27272a"} />
            <div className="mx-auto text-lg">
              Fully Stacked
              <div className="text-sm">
                Same as Gaming, but start some with text, voice, and video channels. Pre set emoji reactions, and more!
              </div>
            </div>
          </button>
        </>
      );
    } else if (joiningServer) {
      return (
        <>
          <div className="flex w-full justify-between">
            <button id="selector" onClick={() => setJoiningServer(false)}>
              <BackArrow height={30} width={30} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
            </button>
          </div>
          <div className="text-center text-2xl">Join a server</div>
          <form onSubmit={joinServerRequest}>
            <div className="mb-4 mt-12">
              <div className="flex justify-center">
                <Input
                  clearable
                  size="xl"
                  labelPlaceholder="Enter invite link or code!"
                  status={isDarkTheme ? "default" : "secondary"}
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  auto
                  shadow
                  css={{
                    backgroundColor: "#6d28d9",
                  }}
                >
                  Join in!
                </Button>
              </div>
            </div>
          </form>
        </>
      );
    } else if (specifiedTemplate === "generic") {
      return (
        <>
          <div className="flex w-full justify-between">
            <button id="selector" onClick={() => setSpecifiedTemplate("")}>
              <BackArrow height={30} width={30} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={1} />
            </button>
          </div>
          <div className="flex justify-center text-2xl">Generic Template</div>
          <form onSubmit={createServerRequest}>
            <div className="flex flex-col items-center pt-12">
              <Input
                ref={serverNameRef}
                id="serverName"
                clearable
                required
                size="xl"
                maxLength={24}
                labelPlaceholder="Desired Server Name"
                status={isDarkTheme ? "default" : "secondary"}
              />
              <Checkbox
                className="my-4"
                id="publicSet"
                isSelected={serverPublic}
                onChange={() => setServerPublic(!serverPublic)}
                color={isDarkTheme ? "default" : "secondary"}
              >
                Make Public?
              </Checkbox>
              {serverPublic ? (
                <div className="relative">
                  <select
                    ref={serverSelectRef}
                    id="ServerSelect"
                    className="custom-select mb-4 rounded-xl border-zinc-300 bg-purple-200 text-purple-700 dark:bg-zinc-900 dark:text-zinc-100"
                    onChange={handleServerTypeChange}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select Server Type
                    </option>
                    <option value="Finance & Economics">Finance & Economics</option>
                    <option value="Music">Music</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Education">Education</option>
                    <option value="Science & Technology">Science & Technology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : null}
              {serverType === "Other" && serverPublic ? (
                <div className="mx-12 mb-6 text-center">
                  Your server will not be listed under any category, it will only be found by searching directly
                </div>
              ) : null}
            </div>
            {!serverPublic ? (
              <div className="flex justify-center">
                <Checkbox
                  className="my-4"
                  id="searchableCheckbox"
                  isSelected={searchable}
                  onChange={() => setSearchable(!searchable)}
                  color={isDarkTheme ? "default" : "secondary"}
                >
                  List in search?
                </Checkbox>
              </div>
            ) : null}
            <div className="flex justify-center pt-4">
              <Textarea
                ref={serverDescriptionRef}
                label={`Server Description (optional)`}
                placeholder="Community to discuss the..."
                onChange={descriptionLengthReport}
                size="xl"
                minRows={4}
                status={serverDescriptionLength > 100 ? "error" : isDarkTheme ? "default" : "secondary"}
              />
            </div>
            <div className="flex justify-center pb-8 pl-36">{serverDescriptionLength}/100</div>
            <div className="flex justify-evenly">
              <div className="flex w-min flex-col">
                <div className="text-center">Server Logo (optional)</div>
                <Dropzone
                  onDrop={handleLogoDrop}
                  acceptedFiles={"image/jpg, image/jpeg, image/png"}
                  fileHolder={logoImageHolder}
                  preSet={null}
                />
              </div>
              <div className="flex w-min flex-col">
                <div className="text-center">Server Banner (optional)</div>
                <Dropzone
                  onDrop={handleBannerDrop}
                  acceptedFiles={"image/jpg, image/jpeg, image/png"}
                  fileHolder={bannerImageHolder}
                  preSet={null}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="pt-2">Logo / Banner can be uploaded at any time</div>
            </div>
            <div className="my-4 flex justify-center pt-10">
              {createButtonLoading ? (
                <Button disabled auto bordered size={"lg"} color="gradient">
                  <Loading type="points" size="sm" />
                </Button>
              ) : serverDescriptionLength > 100 ? (
                <Button color={"gradient"} size={"lg"} type="submit" disabled>
                  Description too long
                </Button>
              ) : (
                <Button color={"gradient"} size={"lg"} type="submit">
                  Create Server and Continue!
                </Button>
              )}
            </div>
          </form>
        </>
      );
    } else if (specifiedTemplate == "gaming") {
      return;
    }
  };
  return (
    <div className="absolute h-screen w-screen overflow-y-scroll py-36 backdrop-blur-sm">
      <div className="flex justify-center ">
        <div
          ref={props.serverModalRef}
          id="serverModalContent"
          className="fade-in h-fit w-11/12 rounded-xl bg-zinc-100 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:-mt-24 md:w-1/2 xl:w-1/3"
        >
          {stateReturn()}
        </div>
      </div>
    </div>
  );
}
