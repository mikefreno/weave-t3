import DownloadIcon from "@/src/icons/DownloadIcon";
import { Button, Tooltip } from "@nextui-org/react";
import { userAgent } from "next/server";
import React, { useEffect, useState } from "react";
import { usePlatform, Platform } from "./getPlatform";

const DownloadButton = () => {
  const platform: Platform = usePlatform();

  return (
    <>
      <Tooltip content={"Coming Soon!"} trigger="click" color={"secondary"} placement="topEnd">
        <Button shadow color={"gradient"} size="xl" className="z-0">
          Download {platform === "Unknown" ? "" : `for ${platform}`}
          <DownloadIcon className="ml-2 h-4 w-4" />
        </Button>
      </Tooltip>
    </>
  );
};

export default DownloadButton;
