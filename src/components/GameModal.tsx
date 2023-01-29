import React from "react";
import GamepadIcon from "../icons/GamepadIcon";

function GameModal(props: { fill: string }) {
  return (
    <div className="z-50 w-96 rounded-2xl border-2 border-violet-900 bg-zinc-300 bg-opacity-50  p-4 shadow-2xl backdrop-blur dark:bg-zinc-800 dark:bg-opacity-50">
      <span className="flex justify-center">
        <GamepadIcon
          height={120}
          width={160}
          fill={undefined}
          stroke={props.fill}
        />
      </span>
      <div className="text-[#171717] dark:text-[#E2E2E2]">
        <h3 className="text-md text-center">Easy voice-lobby creation</h3>
        <p className="text-center text-sm">
          Currently-speaking overlays, and current game display allows you
          connect with friends quickly and easily.
        </p>
      </div>
    </div>
  );
}

export default GameModal;
