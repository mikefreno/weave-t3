import CommentsIcon from "@/src/icons/CommentsIcon";
import HeadphonesIcon from "@/src/icons/HeadphonesIcon";
import Xmark from "@/src/icons/Xmark";
import React from "react";

const CreateChannelModal = (props: {
  isDarkTheme: boolean;
  createChannelToggle: any;
}) => {
  const { isDarkTheme, createChannelToggle } = props;

  return (
    <div className="fixed">
      <div className="absolute flex w-screen items-center justify-center">
        <div className="fade-in w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3">
          <div className="">
            <button
              className="right-4 w-10"
              onClick={() => {
                createChannelToggle();
              }}
            >
              <Xmark className="text-zinc-800 dark:text-zinc-200" />
            </button>
            <div className="text-center text-xl">Create A Channel</div>
            <div className="flex">
              <button className="m-4 mx-auto flex rounded-xl bg-emerald-500 p-4  hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800">
                <CommentsIcon
                  height={40}
                  width={40}
                  strokeWidth={1.5}
                  color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                />
                <div className="my-auto ml-8 text-xl">Text Channel</div>
              </button>
              <button className="m-4 mx-auto flex rounded-xl bg-blue-500 p-4 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800">
                <HeadphonesIcon
                  height={36}
                  width={36}
                  color={isDarkTheme ? "#e4e4e7" : "#27272a"}
                />
                <div className="my-auto ml-8 text-xl">Voice Channel</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;
