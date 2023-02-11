import React from "react";
import { number } from "zod";

function CommandLineIcon(props: {
  height: number | undefined;
  width: number | undefined;
  stroke: string | undefined;
  strokeWidth: number | 1.5;
}) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={props.strokeWidth}
        stroke={props.stroke}
        height={props.height}
        width={props.width}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    </div>
  );
}

export default CommandLineIcon;
