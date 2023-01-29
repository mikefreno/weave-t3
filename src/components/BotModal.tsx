import React from "react";
import RobotIcon from "../icons/RobotIcon";

function BotModal(props: { fill: string }) {
  return (
    <div className="z-50 w-72 rounded-2xl border-2 border-violet-900 bg-zinc-300 bg-opacity-50 p-4 shadow-2xl backdrop-blur dark:bg-zinc-800 dark:bg-opacity-50">
      <span className="flex justify-center">
        <RobotIcon height={144} width={144} fill={props.fill} />
      </span>
      <div className="text-[#171717] dark:text-[#E2E2E2]">
        <h3 className="text-md text-center">Ready-made Bots</h3>
        <p className="text-center text-sm">
          Pre-built bots for productivity and entertainment. User extensible, or
          BYOB (bring your own bot)!
        </p>
      </div>
    </div>
  );
}

export default BotModal;
