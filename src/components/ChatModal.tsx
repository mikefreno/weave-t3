import React from "react";
import CommentsIcon from "../icons/CommentsIcon";

function ChatModal(props: { fill: string }) {
  return (
    <div className="z-50 w-48 rounded-2xl border-2 border-violet-900 bg-zinc-300 bg-opacity-50 p-4  shadow-2xl backdrop-blur dark:bg-zinc-800 dark:bg-opacity-50">
      <span className="flex justify-center">
        <CommentsIcon
          height={144}
          width={144}
          fill={props.fill}
          stroke={undefined}
        />
      </span>
      <div className="text-[#171717] dark:text-[#E2E2E2]">
        <h3 className="text-md text-center">Chat in an invite-only space</h3>
        <p className="text-center text-sm">
          Admin controlled individual privileges allow for flexibly creating the
          spaces you want.
        </p>
      </div>
    </div>
  );
}

export default ChatModal;
