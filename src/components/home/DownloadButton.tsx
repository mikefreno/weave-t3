"use client";
import DownloadIcon from "@/src/icons/DownloadIcon";
import { Button, Tooltip } from "@nextui-org/react";
import { userAgent } from "next/server";
import React, { useEffect, useState } from "react";

function DownloadButton() {
  const [os, setOS] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Windows") !== -1) {
      setOS("Windows");
    } else if (userAgent.indexOf("Mac OS X") !== -1) {
      setOS("Mac");
    } else if (userAgent.indexOf("Linux") !== -1) {
      setOS("Linux");
    } else {
      setOS("Other");
    }
  }, []);

  return (
    <>
      <Tooltip
        content={"Coming Soon!"}
        trigger="click"
        color={"secondary"}
        placement="topEnd"
      >
        <Button shadow color={"gradient"} size="xl" className="z-0">
          Download for {os} <DownloadIcon className="ml-2 h-4 w-4" />
        </Button>
      </Tooltip>
    </>
  );
}

export default DownloadButton;
