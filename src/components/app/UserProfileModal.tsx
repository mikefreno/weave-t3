import { api } from "@/src/utils/api";
import { type User as MongoUser } from "@prisma/client/mongo";
import { RefObject, useContext, useEffect, useState } from "react";
import { User } from "@prisma/client";
import { Button, Loading } from "@nextui-org/react";
import LoadingElement from "../loading";
import ThemeContext from "../ThemeContextProvider";
import Xmark from "@/src/icons/Xmark";

export default function UserProfileModal(props: {
  user: MongoUser;
  UserProfileModalRef: RefObject<HTMLDivElement>;
  userProfileModalToggle: () => void;
}) {
  const { isDarkTheme } = useContext(ThemeContext);

  const { user, UserProfileModalRef } = props;
  const getUserByID = api.users.getById.useQuery(user.id);
  const [fullUser, setFullUser] = useState<User | null>(null);

  useEffect(() => {
    getUserByID.refetch();
  }, [user]);

  useEffect(() => {
    if (getUserByID && getUserByID.data) {
      setFullUser(getUserByID.data);
    }
  }, [getUserByID]);

  const loadState = () => {
    if (fullUser) {
      return (
        <>
          <div className="flex justify-between">
            <button onClick={props.userProfileModalToggle}>
              <Xmark className={"w-10"} />
            </button>
            <Button color={"secondary"}>Request Friend</Button>
          </div>
          <div className="flex flex-row justify-evenly">
            <div className="my-auto flex justify-center">
              {fullUser.image ? (
                <img className="h-36 w-36 rounded-full" src={fullUser.image} />
              ) : null}
            </div>
            <div className="my-auto flex justify-center">{fullUser.name}</div>
          </div>
          <div className="flex flex-row justify-evenly">
            <div className="my-auto flex justify-center">
              {fullUser.pseudonym_image ? (
                <img
                  className="h-36 w-36 rounded-full"
                  src={fullUser.pseudonym_image}
                />
              ) : null}
            </div>
            <div className="my-auto flex justify-center">
              {fullUser.pseudonym ? "@" + fullUser.pseudonym : null}
            </div>
          </div>
        </>
      );
    } else {
      return <LoadingElement isDarkTheme={isDarkTheme} />;
    }
  };

  return (
    <div className="fixed">
      <div className="modal-offset flex h-screen w-screen items-center justify-center backdrop-blur-sm">
        <div
          ref={UserProfileModalRef}
          className="fade-in -mt-24 w-11/12 rounded-xl bg-zinc-100 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <div className="py-4">{loadState()}</div>
        </div>
      </div>
    </div>
  );
}
