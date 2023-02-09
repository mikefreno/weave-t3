import React from "react";

const HeadphoneSlashIcon = (props: {
  width: number;
  height: number;
  color: string;
}) => {
  return (
    <svg
      fill={props.color}
      height={props.height}
      viewBox="0 0 512 512"
      width={props.width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter
        id="a"
        filterUnits="userSpaceOnUse"
        height="516.354"
        width="534.028"
        x="-8.51407"
        y="-4.67688"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_1_2"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_1_2"
          mode="normal"
          result="shape"
        />
      </filter>
      <clipPath id="b">
        <path d="m0 0h512v512h-512z" />
      </clipPath>
      <g clip-path="url(#b)">
        <path
          d="m512 287.734v112.141c0 44.18-35.889 80.125-80 80.125-26.467 0-48-21.562-48-48.062v-127.876c0-26.5 21.533-48.062 48-48.062 10.826 0 20.9 2.643 30.287 6.598-12.59-102.727-100.215-182.598-206.287-182.598s-193.697 79.871-206.287 182.598c9.387-3.955 19.461-6.598 30.287-6.598 26.467 0 48 21.562 48 48.062v127.876c0 26.5-21.533 48.062-48 48.062-44.111 0-80-35.945-80-80.125v-111.875c0-141.156 114.844-256 256-256 140.922 0 255.582 114.469 255.965 255.305.006.146.029.283.035.429z"
          fill={props.color}
        />
        <g filter="url(#a)">
          <path d="m0 0 517 499" stroke={props.color} strokeWidth="30" />
        </g>
      </g>
    </svg>
  );
};

export default HeadphoneSlashIcon;
