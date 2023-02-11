import { Loading } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";

const LoadingElement = (props: { isDarkTheme: boolean }) => {
  return (
    <div className="mx-auto my-auto flex h-screen flex-row items-center justify-center bg-zinc-100 text-3xl dark:bg-zinc-800">
      <Loading color={"secondary"} size="xl" />
      <div className="absolute">
        {props.isDarkTheme ? (
          <Image src={DarkLogo} alt={"logo"} width="50" />
        ) : (
          <Image src={LightLogo} alt={"logo"} width="50" />
        )}
      </div>
    </div>
  );
};

export default LoadingElement;
