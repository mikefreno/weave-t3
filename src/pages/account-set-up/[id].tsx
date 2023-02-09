import { api } from "@/src/utils/api";
import router, { useRouter } from "next/router";
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
import { getSession, useSession } from "next-auth/react";

const userSetup = () => {
  const { query } = useRouter();
  const userQuery = api.users.getById.useQuery(query.id);
  const [profilePicture, setProfilePicture] = useState<
    string | ArrayBuffer | null
  >(null);
  const [workprofilePicture, setWorkProfilePicture] = useState<
    string | ArrayBuffer | null
  >(null);
  const [step, setStep] = useState(1);
  const realName = useRef<HTMLInputElement | null>(null);
  const psuedonym = useRef<HTMLInputElement | null>(null);
  const { isDarkTheme, switchDarkTheme } = useContext(ThemeContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonPassState, setButtonPassState] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (userQuery.data?.id === query.id) {
        router.push("/");
      }
    }, 2000);
  }, []);

  const handleProfilePicDrop = useCallback((acceptedFile: Blob[]) => {
    acceptedFile.forEach((file: Blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setProfilePicture(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleWorkProfilePicDrop = useCallback((acceptedFile: Blob[]) => {
    acceptedFile.forEach((file: Blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setWorkProfilePicture(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const setNames = () => {
    setButtonLoading(true);
    let realNameValue = "";
    let psuedonymValue = "";
    if (realName.current) {
      realNameValue = realName.current.value;
    }
    if (psuedonym.current) {
      psuedonymValue = psuedonym.current.value;
    }
    //send to server logic
    setTimeout(() => {
      setStep(1);
      setButtonLoading(false);
    }, 1000);
  };
  const setPictures = () => {
    setButtonLoading(true);
    //send to server logic
    setTimeout(() => {
      setStep(2);
      setButtonLoading(false);
    }, 1000);
  };

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
                  labelPlaceholder="Your Full Name"
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
                  labelPlaceholder="Psuedonym"
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
          <div className="text-center ">
            <div className="text-3xl">
              Choose a profile picture, or two - squared images work best{" "}
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
                  onDrop={handleWorkProfilePicDrop}
                  accept={"image/*"}
                  fileHolder={workprofilePicture}
                />
                Paired with Full Name
              </div>
              <div className="flex w-1/2 flex-col items-center border-l border-l-zinc-500">
                <Dropzone
                  onDrop={handleProfilePicDrop}
                  accept={"image/*"}
                  fileHolder={profilePicture}
                />
                Paired with Psuedonym
              </div>
            </div>
            <div className="pt-4">
              If only one picture is chosen it will be used for both. If only
              one picture is chosen it will be used for both.
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
                ) : buttonPassState ? (
                  <Button auto shadow color={"secondary"} onClick={setPictures}>
                    Next
                  </Button>
                ) : (
                  <Tooltip content={"Fill out one of the two fields"}>
                    <Button
                      auto
                      shadow
                      color={"secondary"}
                      onClick={setPictures}
                    >
                      Next
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <Navbar />
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
