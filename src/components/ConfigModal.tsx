import React from "react";
import CommandLineIcon from "@/src/icons/CommandLineIcon";

function ConfigModal(props: { fill: string }) {
  return (
    <div className="z-50 w-48 rounded-2xl border-2 border-violet-900 bg-zinc-300 bg-opacity-50  p-4 shadow-2xl backdrop-blur dark:bg-zinc-800 dark:bg-opacity-50">
      <span className="flex justify-center">
        <CommandLineIcon
          height={144}
          width={144}
          stroke={props.fill}
          strokeWidth={0.5}
          fill={""}
        />
      </span>
      <div className="text-[#171717] dark:text-[#E2E2E2]">
        <h3 className="text-md text-center">Highly configurable</h3>
        <p className="text-center text-sm">accessability or just per taste</p>
      </div>
    </div>
  );
}

export default ConfigModal;
