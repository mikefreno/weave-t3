import { User } from "@prisma/client";
import { Button } from "@nextui-org/react";

const UserTooltip = (props: { user: User }) => {
  const { user } = props;
  return (
    <>
      <div className="flex">
        <div className="">
          <img
            src={
              user.image
                ? user.image
                : user.pseudonym_image
                ? user.pseudonym_image
                : ""
            }
            alt="user-image"
            height={40}
            width={40}
            className="rounded-full"
          />
        </div>
        <div className="my-auto pl-4">
          <div className="">{user.name}</div>
          {user.pseudonym ? (
            <div className="text-center text-sm text-zinc-300">
              @{user.pseudonym}
            </div>
          ) : null}
        </div>
      </div>
      <div className="w-36 text-center text-zinc-300">{user.bio}</div>
      <div className="flex justify-evenly pt-2">
        <div className="px-1">
          <Button auto size={"sm"}>
            Follow
          </Button>
        </div>
        <div className="px-1">
          <Button auto size={"sm"}>
            Friend
          </Button>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default UserTooltip;
