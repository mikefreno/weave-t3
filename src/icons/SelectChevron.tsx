import React from "react";

const SelectChevron = (props: {
  height: number;
  width: number;
  stroke: string;
  strokeWidth: number;
}) => {
  return (
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
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

export default SelectChevron;
