import { api } from "@/src/utils/api";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Dropzone from "@/src/components/app/Dropzone";
import Navbar from "@/src/components/Navbar";
import { Button, Input, Loading, Tooltip } from "@nextui-org/react";
import BackArrow from "@/src/icons/BackArrow";
import ThemeContext from "@/src/components/ThemeContextProvider";
import Link from "next/link";
import { useSession } from "next-auth/react";
import router from "next/router";
import Resizer from "react-image-file-resizer";
import Head from "next/head";
import { toSvg } from "jdenticon";
import AdjustableLoadingElement from "@/src/components/AdjustableLoadingElement";
import { Server } from "@prisma/client";
import ServerCard from "@/src/components/app/ServerCard";
import InfoIcon from "@/src/icons/InfoIcon";
import { type Server as MongoServer, type User as MongoUser } from "@prisma/client/mongo";
import Search from "@/src/components/app/Search";
import SearchIcon from "@/src/icons/SearchIcon";

const resizeFile = (file: File, extension: string) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      extension,
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

const UserSetup = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const { data: session, status } = useSession();

  //state
  const [realNamePicture, setRealNamePicture] = useState<File | Blob | null>(null);
  const [realNamePictureExt, setRealNamePictureExt] = useState<string | null>(null);
  const [realNamePicHolder, setRealNamePicHolder] = useState<string | ArrayBuffer | null>(null);
  const [pseudonymPicture, setPseudonymPicture] = useState<File | Blob | null>(null);
  const [pseudonymPictureExt, setPseudonymPictureExt] = useState<string | null>(null);
  const [pseudonymPicHolder, setPseudonymPicHolder] = useState<string | ArrayBuffer | null>(null);
  const [step, setStep] = useState(0);
  const [nameField, setNameField] = useState("-");
  const [pseudonymField, setPseudonymField] = useState("-");
  const switchRef = useRef<HTMLDivElement | null>(null);
  const [nameError, setNameError] = useState("");
  const [identicon, setIdenticon] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [publicServers, setPublicServers] = useState<Server[]>();
  const [userSearchData, setUserSearchData] = useState<MongoServer[] | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  //ref
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const realName = useRef<HTMLInputElement>(null);
  const pseudonym = useRef<HTMLInputElement>(null);

  //trpc (api)
  const nameMutation = api.users.setUserName.useMutation();
  const pseudonymMutation = api.users.setUserPseudonym.useMutation();
  const imageMutation = api.users.setUserImage.useMutation();
  const pseudonymImageMutation = api.users.setUserPseudonymImage.useMutation();
  const identiconImageMutation = api.users.setIdenticonAsImage.useMutation();
  const userQuery = api.users.getCurrentUser.useQuery();
  const s3TokenMutation = api.misc.returnS3Token.useMutation();
  const serverQuery = api.server.getAllPublicServers.useQuery();
  const getServerSearchData = api.search.getPublicMongoServer.useMutation();

  useEffect(() => {
    if (userQuery.data) {
      setIdenticon(toSvg(userQuery.data.email, 100));
    }
  }, [userQuery.data]);

  useEffect(() => {
    if (serverQuery.data) {
      setPublicServers(serverQuery.data);
    }
  }, [serverQuery]);

  const handleRealNamePictureDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setRealNamePicture(file);
      const ext = file.type.split("/")[1];
      setRealNamePictureExt(ext as string);

      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setRealNamePicHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handlePseudonymPictureDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setPseudonymPicture(file);
      const ext = file.type.split("/")[1];
      setPseudonymPictureExt(ext as string);
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setPseudonymPicHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const setNames = (e: any) => {
    e.preventDefault();
    setButtonLoading(true);
    if (realName.current?.value || pseudonym.current?.value) {
      if (nameField !== "-") {
        nameMutation.mutate(realName.current!.value);
      }
      if (pseudonymField !== "-") {
        pseudonymMutation.mutate(pseudonym.current!.value);
      }
      setButtonLoading(false);
      setStep(1);
    } else {
      setNameError("One of the above is required!");
      setButtonLoading(false);
    }
  };

  const loadServerSearchData = async () => {
    if (!userSearchData) {
      const res: MongoServer[] | null = await getServerSearchData.mutateAsync();
      if (res) {
        setUserSearchData(res);
      } else {
        console.log("error retrieving user search data");
      }
    }
  };
  const showSelectedServer = () => {
    return <></>;
  };

  const setPictures = async () => {
    setButtonLoading(true);
    let type = "image"; // type refers to being paired with real name or pseudonym
    let ext = realNamePictureExt ? realNamePictureExt : "png";
    let id = userQuery.data!.id;
    let s3TokenReturn = await s3TokenMutation.mutateAsync({
      id: id,
      type: type,
      ext: ext,
      category: "users", // category is used to separate user and server images cleanly in s3
    });
    if (realNamePicture == null && userQuery.data?.image == null) {
      await identiconImageMutation.mutateAsync({
        type: type,
        uploadURL: s3TokenReturn.uploadURL,
        s3key: s3TokenReturn.key,
      });
    } else if (realNamePicture !== null) {
      const resizedFile = (await resizeFile(realNamePicture as File, ext)) as File;

      await fetch(s3TokenReturn.uploadURL, {
        method: "PUT",
        body: resizedFile,
      }).catch((err) => {
        console.log(err);
      });

      imageMutation.mutate(s3TokenReturn.key);
    }
    type = "pseudonym_image";
    ext = pseudonymPictureExt ? pseudonymPictureExt : "png";
    id = userQuery.data!.id;
    s3TokenReturn = await s3TokenMutation.mutateAsync({
      id: id,
      type: type,
      ext: ext,
      category: "users",
    });
    if (pseudonymPicture == null && userQuery.data?.pseudonym_image == null) {
      await identiconImageMutation.mutateAsync({
        type: type,
        uploadURL: s3TokenReturn.uploadURL,
        s3key: s3TokenReturn.key,
      });
    } else if (pseudonymPicture !== null) {
      const resizedFile = (await resizeFile(pseudonymPicture as File, ext)) as File;

      await fetch(s3TokenReturn.uploadURL, {
        method: "PUT",
        body: resizedFile,
      }).catch((err) => {
        console.log(err);
      });

      pseudonymImageMutation.mutate(s3TokenReturn.key);
    }
    setStep(2);
    setButtonLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="h-screen w-screen bg-zinc-50 dark:bg-zinc-800">
        <AdjustableLoadingElement />
      </div>
    );
  }
  if (status === "unauthenticated") {
    return router.push("/");
  }
  const contextualContentRenderer = () => {
    if (step == 0) {
      // Set Names
      return (
        <div className="text-center">
          <div className="text-3xl">At least one of these is needed, but both are encouraged</div>
          <form onSubmit={setNames}>
            <div className="flex flex-row">
              <div className="flex w-1/2 flex-col items-center">
                <div className="pt-8">
                  <Input
                    id="realName"
                    ref={realName}
                    onChange={(e) => setNameField(e.target.value)}
                    label="Your Full Name"
                    clearable
                    underlined
                    color="secondary"
                    initialValue={userQuery.data?.name ? userQuery.data.name : ""}
                  />
                </div>
                <div className="mx-12  text-sm">This is generally only used for workspaces.</div>
              </div>
              <div className="flex w-1/2 flex-col items-center border-l border-zinc-500">
                <div className="pt-8">
                  <Input
                    id="pseudonym"
                    ref={pseudonym}
                    onChange={(e) => setPseudonymField(e.target.value)}
                    label="Pseudonym"
                    clearable
                    underlined
                    color="secondary"
                    initialValue={userQuery.data?.pseudonym ? userQuery.data.pseudonym : ""}
                  />
                </div>
                <div className="mx-12 text-sm">Used in more casual communities.</div>
              </div>
            </div>
            <div className="flex justify-end pt-8">
              {buttonLoading ? (
                <Button disabled auto bordered color="gradient" css={{ px: "$13" }}>
                  <Loading type="points" size="sm" />
                </Button>
              ) : (
                <Button auto shadow color={"secondary"} type="submit">
                  Next
                </Button>
              )}
            </div>
            <span className="text-center text-lg text-red-500">{nameError}</span>
          </form>
        </div>
      );
    } else if (step == 1) {
      // Set Pictures
      return (
        <>
          <div className="py-2 text-center">
            <div className="text-3xl">Choose a profile picture, or two - squared images work best</div>
            <div className="">
              <Button auto color={"secondary"} onClick={() => setStep(step - 1)}>
                <BackArrow height={12} width={12} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} strokeWidth={3} />
              </Button>
            </div>
            <div className="flex flex-row">
              <div className="flex w-1/2 flex-col items-center">
                <Dropzone
                  onDrop={handleRealNamePictureDrop}
                  acceptedFiles={"image/jpeg, image/png"}
                  fileHolder={realNamePicHolder}
                  preSet={userQuery.data?.image}
                />
                Paired with Full Name
              </div>
              <div className="flex w-1/2 flex-col items-center border-l border-l-zinc-500">
                <Dropzone
                  onDrop={handlePseudonymPictureDrop}
                  acceptedFiles={"image/jpeg, image/png"}
                  fileHolder={pseudonymPicHolder}
                  preSet={userQuery.data?.pseudonym_image}
                />
                Paired with Pseudonym
              </div>
            </div>
            <div className="pt-4 text-center">
              If one is not chosen, an identicon will be used in its place.
              <div className="flex justify-center pt-4">
                <Tooltip
                  content={
                    <div className="p-2">
                      <div>Your identicon</div>
                      <div
                        className="flex justify-center rounded-full pt-2"
                        dangerouslySetInnerHTML={{ __html: identicon as string }}
                      ></div>
                    </div>
                  }
                >
                  <InfoIcon height={16} width={16} fill={"#a855f7"} />
                </Tooltip>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-end">
                {buttonLoading ? (
                  <Button disabled auto bordered color="gradient" css={{ px: "$13" }}>
                    <Loading type="points" size="sm" />
                  </Button>
                ) : (
                  <Button auto shadow color={"secondary"} onClick={setPictures}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      );
    } else if (step == 2) {
      return (
        <div>
          <div className="mb-4 text-center text-xl">All good for now! Thanks!</div>
          <div className="flex flex-row justify-evenly">
            <Tooltip content="Coming soon!">
              <Button auto color={"secondary"} disabled>
                <Link href={"/downloads"} className="px-4 py-2 text-white">
                  Jump to Downloads
                </Link>
              </Button>
            </Tooltip>
            <Button auto color={"gradient"}>
              <Link href={"/app"} className="px-4 py-2 text-white">
                Continue to Web App
              </Link>
            </Button>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <Head>
        <title>Account Set Up | Weave</title>
        <meta name="description" content="Account Set Up" />
      </Head>
      <Navbar switchRef={switchRef} />
      <div className="flex h-screen justify-center overflow-y-scroll bg-zinc-50 pt-24 dark:bg-zinc-800">
        <div className="w-full">
          <div className="flex justify-center pb-12 text-3xl">Lets Get a Few Things Set Up...</div>
          <div className="fade-in min-h-96 mx-auto w-5/6 rounded-lg bg-purple-50 p-4 shadow-xl dark:bg-zinc-700 md:w-2/3 lg:w-1/2 xl:w-2/5">
            {contextualContentRenderer()}
          </div>
          {step == 2 ? (
            <div className="w-screen pt-8">
              <div className="flex justify-center px-2 pt-2">
                <Input
                  ref={searchInputRef}
                  aria-label="search input"
                  type="search"
                  className="w-24 text-xs"
                  placeholder="Search..."
                  value={searchTerm}
                  onFocus={() => {
                    loadServerSearchData();
                    setShowSearch(true);
                  }}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  contentLeft={<SearchIcon height={12} width={12} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} />}
                />
                {showSearch && userSearchData && searchTerm.length > 2 ? (
                  <div className="flex justify-center">
                    <div className="fixed w-48 " ref={searchResultsRef}>
                      <Search userInput={searchTerm} select={showSelectedServer} />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="mx-auto text-center text-lg">Join a few a servers</div>
              <div className="pt-4">
                <div className="mx-auto flex w-1/2 overflow-x-scroll">
                  {publicServers?.map((publicServer) => (
                    <div key={publicServer.id} className="px-4">
                      <div className="rounded-lg shadow-lg">
                        <ServerCard
                          logo={publicServer.logo_url ? publicServer.logo_url : ""}
                          banner={publicServer.banner_url ? publicServer.banner_url : ""}
                          name={publicServer.name}
                          blurb={publicServer.blurb ? publicServer.blurb : ""}
                          members={0}
                          membersOnline={0}
                          serverID={publicServer.id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default UserSetup;
