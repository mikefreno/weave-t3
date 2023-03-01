import { api } from "@/src/utils/api";
import React, { useCallback, useContext, useRef, useState } from "react";
import Dropzone from "@/src/components/app/Dropzone";
import Navbar from "@/src/components/Navbar";
import { Button, Input, Loading } from "@nextui-org/react";
import BackArrow from "@/src/icons/BackArrow";
import ThemeContext from "@/src/components/ThemeContextProvider";
import axios from "axios";
import Link from "next/link";
import LoadingElement from "@/src/components/loading";
import { useSession } from "next-auth/react";
import router from "next/router";
import Resizer from "react-image-file-resizer";

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

async function uploadPicturesToS3(
  id: string,
  type: string,
  ext: string,
  picture: File
) {
  const category = "users";
  let data: any;
  data = await axios
    .get(`/api/s3upload?category=${category}&id=${id}&type=${type}&ext=${ext}`)
    .catch((err) => {
      console.log(err);
    });
  const { uploadURL, key } = data.data;
  const resizedFile = await resizeFile(picture, ext);
  await axios.put(uploadURL, resizedFile).catch((err) => {
    console.log(err);
  });
  return key;
}

const userSetup = () => {
  const userQuery = api.users.getCurrentUser.useQuery();
  const [realNamePicture, setRealNamePicture] = useState<File | Blob | null>(
    null
  );
  const [realNamePictureExt, setRealNamePictureExt] = useState<string>("");
  const [realNamePicHolder, setRealNamePicHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [psuedonymPicture, setPsuedonymPicture] = useState<File | Blob | null>(
    null
  );
  const [psuedonymPictureExt, setPsuedonymPictureExt] = useState<string>("");
  const [psuedonymPicHolder, setPsuedonymPicHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [step, setStep] = useState(0);
  const realName = useRef<HTMLInputElement | null>(null);
  const psuedonym = useRef<HTMLInputElement | null>(null);
  const { isDarkTheme, switchDarkTheme } = useContext(ThemeContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonPassState, setButtonPassState] = useState(false);
  const { data: session, status } = useSession();

  const nameMutation = api.users.setUserName.useMutation();
  const psuedonymMutation = api.users.setUserPsuedonym.useMutation();
  const imageMutation = api.users.setUserImage.useMutation();
  const psuedonymImageMutation = api.users.setUserPsuedonymImage.useMutation();

  const [nameField, setNameField] = useState("-");
  const [psuedonymField, setPsuedonymField] = useState("-");
  const switchRef = useRef<HTMLDivElement | null>(null);

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

  const handlePsuedonymPictureDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setPsuedonymPicture(file);
      const ext = file.type.split("/")[1];
      setPsuedonymPictureExt(ext as string);
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setPsuedonymPicHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const setNames = () => {
    setButtonLoading(true);
    if (nameField !== "-") {
      nameMutation.mutate(realName.current!.value);
    }
    if (psuedonymField !== "-") {
      psuedonymMutation.mutate(psuedonym.current!.value);
    }
    setButtonLoading(false);
    setStep(1);
  };
  const setPictures = async () => {
    setButtonLoading(true);

    if (realNamePicture !== null) {
      const type = "image";
      const ext = realNamePictureExt;
      const id = userQuery.data!.id;
      const key = await uploadPicturesToS3(
        id,
        type,
        ext,
        realNamePicture as File
      );
      imageMutation.mutate(key);
    }
    if (psuedonymPicture !== null) {
      const type = "psuedonym_image";
      const ext = psuedonymPictureExt;
      const id = userQuery.data!.id;
      const key = await uploadPicturesToS3(
        id,
        type,
        ext,
        psuedonymPicture as File
      );
      psuedonymImageMutation.mutate(key);
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
        <div className="text-center text-3xl">
          At least one of these is needed, but both are encouraged
          <div className="flex flex-row">
            <div className="flex w-1/2 flex-col items-center">
              <div className="pt-8">
                <Input
                  id="realName"
                  ref={realName}
                  onChange={(e) => setNameField(e.target.value)}
                  label="Your Full Name"
                  required
                  clearable
                  underlined
                  color="secondary"
                  initialValue={userQuery.data?.name ? userQuery.data.name : ""}
                />
              </div>
              <div className="mx-12  text-sm">
                This is generally only used for workspaces.
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center border-l border-zinc-500">
              <div className="pt-8">
                <Input
                  id="psuedonym"
                  ref={psuedonym}
                  onChange={(e) => setPsuedonymField(e.target.value)}
                  label="Psuedonym"
                  required
                  clearable
                  underlined
                  color="secondary"
                  initialValue={
                    userQuery.data?.psuedonym ? userQuery.data.psuedonym : ""
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
              <Button auto shadow color={"secondary"} onClick={setNames}>
                Next
              </Button>
            )}
          </div>
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
                  onDrop={handlePsuedonymPictureDrop}
                  acceptedFiles={"image/jpeg, image/png"}
                  fileHolder={psuedonymPicHolder}
                  preSet={userQuery.data?.psuedonym_image}
                />
                Paired with Psuedonym
              </div>
            </div>
            <div className="pt-4">
              If only one picture is chosen it will be used for both.
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

export default userSetup;
