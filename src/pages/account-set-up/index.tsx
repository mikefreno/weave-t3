import { api } from "@/src/utils/api";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Dropzone from "@/src/components/app/Dropzone";
import Navbar from "@/src/components/Navbar";
import { Button, Input, Loading, Tooltip } from "@nextui-org/react";
import BackArrow from "@/src/icons/BackArrow";
import ThemeContext from "@/src/components/ThemeContextProvider";
import axios from "axios";
import Link from "next/link";
import LoadingElement from "@/src/components/loading";
import { useSession } from "next-auth/react";
import router from "next/router";
import Resizer from "react-image-file-resizer";
import Head from "next/head";
import crypto from "crypto";

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
  const userQuery = api.users.getCurrentUser.useQuery();
  const [realNamePicture, setRealNamePicture] = useState<File | Blob | null>(
    null
  );
  const [realNamePictureExt, setRealNamePictureExt] = useState<string>("");
  const [realNamePicHolder, setRealNamePicHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [pseudonymPicture, setPseudonymPicture] = useState<File | Blob | null>(
    null
  );
  const [pseudonymPictureExt, setPseudonymPictureExt] = useState<string>("");
  const [pseudonymPicHolder, setPseudonymPicHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [step, setStep] = useState(0);
  const realName = useRef<HTMLInputElement | null>(null);
  const pseudonym = useRef<HTMLInputElement | null>(null);
  const { isDarkTheme, switchDarkTheme } = useContext(ThemeContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonPassState, setButtonPassState] = useState(false);
  const { data: session, status } = useSession();

  const nameMutation = api.users.setUserName.useMutation();
  const pseudonymMutation = api.users.setUserPseudonym.useMutation();
  const imageMutation = api.users.setUserImage.useMutation();
  const pseudonymImageMutation = api.users.setUserPseudonymImage.useMutation();
  const gravatarImageMutation = api.users.setGravatarAsImage.useMutation();
  const [nameField, setNameField] = useState("-");
  const [pseudonymField, setPseudonymField] = useState("-");
  const switchRef = useRef<HTMLDivElement | null>(null);
  const [nameError, setNameError] = useState("");
  const [gravatar, setGravatar] = useState<string | null>(null);
  const s3TokenMutation = api.misc.returnS3Token.useMutation();

  // create gravatar
  useEffect(() => {
    if (session?.user && session.user.email) {
      const normalizedEmail = session.user.email.trim().toLowerCase();
      const hash = crypto
        .createHash("md5")
        .update(normalizedEmail)
        .digest("hex");
      setGravatar(`https://www.gravatar.com/avatar/${hash}?s=80&d=identicon`);
    }
  }, [session?.user]);

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
  const setPictures = async () => {
    setButtonLoading(true);
    if (
      realNamePicture == null &&
      pseudonymPicture == null &&
      userQuery.data?.image == null &&
      userQuery.data?.pseudonym_image == null &&
      gravatar
    ) {
      gravatarImageMutation.mutate(gravatar);
    } else if (realNamePicture !== null) {
      const type = "image";
      const ext = realNamePictureExt;
      const id = userQuery.data!.id;
      const s3TokenReturn = await s3TokenMutation.mutateAsync({
        id: id,
        type: type,
        ext: ext,
        category: "users",
      });
      const resizedFile = await resizeFile(realNamePicture as File, ext);

      await axios.put(s3TokenReturn.uploadURL, resizedFile).catch((err) => {
        console.log(err);
      });

      imageMutation.mutate(s3TokenReturn.key);
    } else if (pseudonymPicture !== null) {
      const type = "pseudonym_image";
      const ext = pseudonymPictureExt;
      const id = userQuery.data!.id;
      const s3TokenReturn = await s3TokenMutation.mutateAsync({
        id: id,
        type: type,
        ext: ext,
        category: "users",
      });

      const resizedFile = await resizeFile(pseudonymPicture as File, ext);

      await axios.put(s3TokenReturn.uploadURL, resizedFile).catch((err) => {
        console.log(err);
      });

      pseudonymImageMutation.mutate(s3TokenReturn.key);
    }

    setStep(2);
    setButtonLoading(false);
  };
  if (status === "loading") {
    return <LoadingElement isDarkTheme={isDarkTheme} />;
  }
  if (status === "unauthenticated") {
    return router.push("/");
  }
  const contextualContentRenderer = () => {
    if (step == 0) {
      // Set Names
      return (
        <div className="text-center">
          <div className="text-3xl">
            At least one of these is needed, but both are encouraged
          </div>
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
                    initialValue={
                      userQuery.data?.name ? userQuery.data.name : ""
                    }
                  />
                </div>
                <div className="mx-12  text-sm">
                  This is generally only used for workspaces.
                </div>
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
                    initialValue={
                      userQuery.data?.pseudonym ? userQuery.data.pseudonym : ""
                    }
                  />
                </div>
                <div className="mx-12 text-sm">
                  Used in more casual communities.
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-8">
              {buttonLoading ? (
                <Button
                  disabled
                  auto
                  bordered
                  color="gradient"
                  css={{ px: "$13" }}
                >
                  <Loading type="points" size="sm" />
                </Button>
              ) : (
                <Button auto shadow color={"secondary"} type="submit">
                  Next
                </Button>
              )}
            </div>
            <span className="text-center text-lg text-red-500">
              {nameError}
            </span>
          </form>
        </div>
      );
    } else if (step == 1) {
      // Set Pictures
      return (
        <>
          <div className="text-center">
            <div className="text-3xl">
              Choose a profile picture, or two - squared images work best
            </div>
            <div className="-mt-6">
              <Button
                auto
                color={"secondary"}
                onClick={() => setStep(step - 1)}
              >
                <BackArrow
                  height={12}
                  width={12}
                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  strokeWidth={3}
                />
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
            <div className="pt-4">
              If only one picture is chosen it will be used for both.
            </div>
            <div className="flex justify-center pt-1">
              If none are chosen, a
              <Tooltip
                content={
                  <div className="p-2">
                    <div>Your gravatar</div>
                    <div className="flex justify-center pt-2">
                      <img src={gravatar ? gravatar : ""} alt="gravatar" />
                    </div>
                  </div>
                }
              >
                <span className="px-1 text-blue-400 underline underline-offset-4">
                  gravatar
                </span>
              </Tooltip>
              will be used
            </div>
            <div className="w-full">
              <div className="float-right flex justify-end">
                {buttonLoading ? (
                  <Button
                    disabled
                    auto
                    bordered
                    color="gradient"
                    css={{ px: "$13" }}
                  >
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
          <div className="mb-4 text-center text-xl">
            All good for now! Thanks!
          </div>
          <div className="flex flex-row justify-evenly">
            <Link
              href={"/downloads"}
              className="rounded-md border border-zinc-600 py-2 px-4 text-center text-zinc-600 hover:bg-zinc-500 active:bg-zinc-600 dark:border-zinc-100 dark:text-zinc-100"
            >
              Jump to Downloads
            </Link>
            <Link
              href={"/app"}
              className="rounded-md border border-zinc-600 py-2 px-4 text-center text-zinc-600 hover:bg-zinc-500 active:bg-zinc-600 dark:border-zinc-100 dark:text-zinc-100"
            >
              Continue to Web App
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="my-4 text-lg">Join a few a servers</div>
            <div></div>
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
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800">
        <div className="-mt-24 mb-12 text-3xl">
          Lets Get a Few Things Set Up...
        </div>
        <div className="fade-in min-h-96 w-5/6 rounded-lg bg-zinc-300 p-4 shadow-xl dark:bg-zinc-700 md:w-2/3 lg:w-1/2 xl:w-2/5">
          {contextualContentRenderer()}
        </div>
      </div>
    </>
  );
};

export default UserSetup;
