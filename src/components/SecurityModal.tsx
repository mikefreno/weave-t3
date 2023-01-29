import React from "react";
import ShieldIcon from "../icons/ShieldIcon";

function SecurityModal(props: { fill: string }) {
  return (
    <div className="z-50 w-60 rounded-2xl border-2 border-violet-900 bg-zinc-300 bg-opacity-50 p-4 shadow-2xl backdrop-blur dark:bg-zinc-800 dark:bg-opacity-50">
      <span className="flex justify-center">
        <ShieldIcon height={144} width={144} fill={props.fill} />
      </span>
      <div className="text-[#171717] dark:text-[#E2E2E2]">
        <h3 className="text-md text-center">Control Your Data Flow</h3>
        <p className="text-center text-sm">
          Soft requests allow the user to not share the requested info but still
          join the group, hard requests must be accepted to join. (Full Name,
          current activity, etc.)
        </p>
      </div>
    </div>
  );
}

export default SecurityModal;
